const csv = require('csv-parser');
const fs = require('fs');
import express from 'express';
let mustacheExpress = require('mustache-express');

import dayjs from 'dayjs';
import 'dayjs/locale/de';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.locale('de');
dayjs.extend(customParseFormat);

import sort from 'fast-sort';
import _ from 'lodash';

const months = [
  'jan',
  'feb',
  'mar',
  'apr',
  'mai',
  'juni',
  'juli',
  'aug',
  'sept',
  'okt',
  'nov',
  'dez',
];

class Region {
  shortCode: string;
  name: string;
  months: { [id: string]: Month } = {};

  constructor(shortCode: string, name: string) {
    this.shortCode = shortCode;
    this.name = name;
  }
}

class Month {
  month: string;
  private _fruits: Array<Fruit> = [];

  constructor(month: string) {
    this.month = month;
  }

  public get fruits(): Array<Fruit> {
    return this._fruits;
  }

  public sortFruits() {
    this._fruits = this._fruits.sort((a, b) => Number(b.state - a.state));
  }

  public addFruit(fruit: Fruit) {
    this._fruits.push(fruit);
  }
}

enum FruitState {
  FRESH_BEST = 3,
  FRESH = 2,
  STORAGE = 1,
}

class Fruit {
  name: string;
  // locale_names
  state: FruitState;

  constructor(name: string, state: FruitState) {
    this.name = name;
    this.state = state;
  }
}

// init region
const region = new Region('de', 'Deutschland');
months.forEach((month: string) => {
  region.months[month] = new Month(month);
});

fs.createReadStream('data/calendar_de.csv')
  .pipe(csv({ separator: ';', skipLines: 1 }))
  .on('data', (row: any) => {
    // todo: check for months
    // todo: check if fruit existing
    months.forEach((monthName) => {
      let month = region.months[monthName];
      month.addFruit(new Fruit(row.Name, Number(row[monthName])));
    });
  })
  .on('end', () => {
    console.log('CSV file successfully processed');

    // sort all months
    months.forEach((month) => {
      region.months[month].sortFruits();
    });

    run();
  });

interface ITranslationDict {
  [index: string]: {
    toLong: ITranslationDirection;
    toShort: ITranslationDirection;
  };
}
interface ITranslationDirection {
  [index: string]: string;
}

let translation: ITranslationDict = {};
let locale: { [id: string]: string } = {};
let localeReversed: { [id: string]: string } = {};

for (let a = 0; a < 13; a++) {
  let key = dayjs('2020-01-01', 'YYYY-MM-DD')
    .add(a, 'month')
    .format('MMM')
    .toLowerCase();
  let value = dayjs('2020-01-01', 'YYYY-MM-DD')
    .add(a, 'month')
    .format('MMMM')
    .toLowerCase();
  locale[key] = value;
  localeReversed[value] = key;
}

translation['de'] = { toLong: {}, toShort: {} };
translation['de']['toLong'] = locale;
translation['de']['toShort'] = localeReversed;

// console.log(translation);

function run() {
  const app = express();
  app.set('views', `${__dirname}/views`);
  app.set('view engine', 'mustache');
  app.engine('mustache', mustacheExpress());

  app.get('/:locale/:month', (req, res, next) => {
    let monthShort: string;

    try {
      monthShort =
        translation[req.params.locale]['toShort'][
          req.params.month.toLowerCase()
        ];
    } catch (error) {
      res.redirect('/404');
      return;
    }

    // console.log(monthShort, req.params.month.toLowerCase());

    let fruits = region.months[monthShort].fruits.map((fruit) => {
      return { name: fruit.name, state: FruitState[fruit.state] };
    });

    fruits = sort(fruits).by([
      { desc: (u) => u.state },
      { asc: (u) => u.name },
    ]);

    // calc next month
    let currentMonth = dayjs(
      `2020-${_.capitalize(monthShort)}-01`,
      'YYYY-MMM-DD'
    );

    // calc further links
    let previousMonth = currentMonth.subtract(1, 'month').format('MMMM');
    let nextMonth = currentMonth.add(1, 'month').format('MMMM');

    res.render('month', {
      month: _.capitalize(req.params.month),
      fruits: fruits,
      previousMonth: previousMonth,
      nextMonth: nextMonth,
    });
  });

  app.get('/about', (req, res, next) => {
    res.render('about');
  });

  app.get('/', (req, res, next) => {
    res.redirect(`/de/${dayjs().format('MMMM').toLowerCase()}`);
  });

  app.get('*', function (req, res) {
    res.status(404).render('404');
  });

  app.listen(3000, () => {
    console.log('server is running');
  });
}
