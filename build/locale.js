"use strict";
// const months = [
//   'jan',
//   'feb',
//   'mar',
//   'apr',
//   'mai',
//   'juni',
//   'juli',
//   'aug',
//   'sept',
//   'okt',
//   'nov',
//   'dez',
// ];
// // init region
// const region = new Region('de', 'Deutschland');
// months.forEach((month: string) => {
//   region.months[month] = new Month(month);
// });
// const translation: ITranslationDict = {};
// const locale: { [id: string]: string } = {};
// const localeReversed: { [id: string]: string } = {};
// for (let a = 0; a < 13; a++) {
//   let key = dayjs('2020-01-01', 'YYYY-MM-DD')
//     .add(a, 'month')
//     .format('MMM')
//     .toLowerCase();
//   let value = dayjs('2020-01-01', 'YYYY-MM-DD')
//     .add(a, 'month')
//     .format('MMMM')
//     .toLowerCase();
//   locale[key] = value;
//   localeReversed[value] = key;
// }
// translation['de'] = { toLong: {}, toShort: {} };
// translation['de']['toLong'] = locale;
// translation['de']['toShort'] = localeReversed;
