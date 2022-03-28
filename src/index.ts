import express from 'express';
import mustacheExpress from 'mustache-express';

import dayjs from 'dayjs';
import 'dayjs/locale/de';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.locale('de');
dayjs.extend(customParseFormat);

import _ from 'lodash';
import {
  getByMonth,
  loadCalendars,
  markCurrentMonth,
  sortRegionalToImport,
} from './calendar';

function run() {
  loadCalendars();

  const app = express();
  app.set('views', `${__dirname}/views`);
  app.set('view engine', 'mustache');
  app.engine('mustache', mustacheExpress());

  app.get('/:locale/:month', (req, res, next) => {
    const currentMonth = dayjs(
      `2020-${_.capitalize(req.params.month.replace('ae', 'ä'))}-01`,
      'YYYY-MMMM-DD'
    );

    const previousMonth = currentMonth.subtract(1, 'month').format('MMMM');
    const nextMonth = currentMonth.add(1, 'month').format('MMMM');

    let fruits = getByMonth(currentMonth.get('month'));

    res.render('month', {
      month: _.capitalize(req.params.month),
      fruits: markCurrentMonth(fruits.sort(sortRegionalToImport)),
      previousMonth: previousMonth,
      nextMonth: nextMonth,
    });
  });

  app.get('/about', (req, res, next) => {
    res.render('about');
  });

  app.get('/', (req, res, next) => {
    res.redirect(
      `/de/${dayjs().format('MMMM').toLowerCase().replace('ä', 'ae')}`
    );
  });

  app.get('*', function (req, res) {
    res.status(404).render('404');
  });

  app.listen(3000, () => {
    console.log('server is running');
  });
}

run();
