import Cell, { CellType } from '@/models/paz/Cell';

enum UnitClass {
  Fighter,
  Knight,
  Magician,
  Archer
}

export default class {
  public type1: CellType;
  public type2: CellType;

  public maxLife: number = 100;
  public life: number = 100;

  public resolveCells(cells: Cell[]) {
    this.life = Math.max(0, this.life - cells.length);
  }
}
