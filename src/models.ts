export type FruitState = 'FRESH_BEST' | 'FRESH' | 'STORAGE' | 'IMPORT';

export const FruitStateMapping: { [key: string]: FruitState } = {
  3: 'FRESH_BEST',
  2: 'FRESH',
  1: 'STORAGE',
  '-1': 'IMPORT',
};

export const FruitStateMappingReverse: { [key in FruitState]: Number } = {
  FRESH_BEST: 3,
  FRESH: 2,
  STORAGE: 1,
  IMPORT: -1,
};

export interface Fruit {
  name: string;
  nameEN: string;
  months: FruitState[];
}

export interface FruitView {
  name: string;
  state: FruitState;
  months: FruitState[];
}

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
