import fs from 'fs';
import { parse } from 'csv-parse/sync';
import {
  Fruit,
  FruitState,
  FruitStateMapping,
  FruitStateMappingReverse,
  FruitView,
} from './models';
import dayjs from 'dayjs';

const data: { [key: string]: Fruit[] } = {};

// parser function
async function processCSV(fileName: string): Promise<void> {
  const records: Fruit[] = [];

  // only possible with node 16
  // https://csv.js.org/parse/recipes/promises/
  const content = fs.readFileSync(`data/${fileName}`);
  const table = parse(content, { delimiter: ';', fromLine: 3 });

  const conv = (v: string): FruitState => {
    return v.trim() !== '' ? FruitStateMapping[v] : 'IMPORT';
  };

  for (const row of table) {
    records.push({
      name: row[0],
      nameEN: row[1],
      months: row.slice(2).map(conv),
    });
  }

  // TODO: change for multi language support
  data['de'] = records;
}

/** load all files */
export function loadCalendars() {
  const files = fs.readdirSync('data/');
  files.map((filename) => processCSV(filename));
}

export function getByMonth(month: number, lang = 'de'): FruitView[] {
  return data[lang].map((fruit) => ({
    name: fruit.name,
    state: fruit.months[month],
    months: fruit.months,
  }));
}

export function markCurrentMonth(data: FruitView[]) {
  const currentMonthIndex = dayjs().get('month');
  return data.map((item) => {
    const tmp = { ...item, months: [...item.months] as string[] };
    tmp.months[currentMonthIndex] = `${tmp.months[currentMonthIndex]} CURRENT`;
    return tmp;
  });
}

export function sortRegionalToImport(a: FruitView, b: FruitView) {
  if (FruitStateMappingReverse[a.state] > FruitStateMappingReverse[b.state]) {
    return -1;
  }
  if (FruitStateMappingReverse[a.state] < FruitStateMappingReverse[b.state]) {
    return 1;
  }
  return 0;
}
