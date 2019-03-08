import Cell, { CellType } from '@/models/paz/Cell';
import Unit from '@/models/paz/Unit';

export interface EracedCellsSet {
  type: CellType;
  eraced: Cell[];
  count: number;
}

export default class {
  public mine: EracedCellsSet;
  public enemy: EracedCellsSet;
  public isSameGroup: boolean;

  constructor(eraced: Cell[], enemyEraced: Cell[]) {
    this.isSameGroup = eraced[0].group === enemyEraced[0].group;
    this.mine = {
      type: eraced[0].type,
      eraced,
      count: eraced.length
    };
    this.enemy = {
      type: enemyEraced[0].type,
      eraced: enemyEraced,
      count: enemyEraced.length
    };
  }
}
