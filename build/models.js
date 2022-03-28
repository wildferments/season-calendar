"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FruitStateMappingReverse = exports.FruitStateMapping = void 0;
exports.FruitStateMapping = {
    3: 'FRESH_BEST',
    2: 'FRESH',
    1: 'STORAGE',
    '-1': 'IMPORT',
};
exports.FruitStateMappingReverse = {
    FRESH_BEST: 3,
    FRESH: 2,
    STORAGE: 1,
    IMPORT: -1,
};
// old
// interface ITranslationDict {
//   [index: string]: {
//     toLong: ITranslationDirection;
//     toShort: ITranslationDirection;
//   };
// }
// interface ITranslationDirection {
//   [index: string]: string;
// }
// class Region {
//   shortCode: string;
//   name: string;
//   months: { [id: string]: Month } = {};
//   constructor(shortCode: string, name: string) {
//     this.shortCode = shortCode;
//     this.name = name;
//   }
// }
// class Month {
//   month: string;
//   private _fruits: Array<Fruit> = [];
//   constructor(month: string) {
//     this.month = month;
//   }
//   public get fruits(): Array<Fruit> {
//     return this._fruits;
//   }
//   public sortFruits() {
//     this._fruits = this._fruits.sort((a, b) => Number(b.state - a.state));
//   }
//   public addFruit(fruit: Fruit) {
//     this._fruits.push(fruit);
//   }
// }
