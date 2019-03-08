export default class Cell {
  public row: number;
  public col: number;

  public isMine: boolean;

  public type: CellType;

  public group: number | undefined;
  public dropRows: number = 0;

  public reason = '';

  constructor(row: number, col: number, type: CellType, isMine: boolean) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.isMine = isMine;
  }

  public get isEraced() {
    return this.type === CellType.EracedTemp;
  }

  public get key() {
    return this.row * 1000 + this.col;
  }

  public get stat() {
    return (
      '(' +
      this.row +
      ',' +
      this.col +
      ')=' +
      this.type +
      ' is group' +
      this.group +
      ' ... ' +
      this.reason
    );
  }

  public clone() {
    const result = new Cell(this.row, this.col, this.type, this.isMine);
    Object.assign(result, this);
    return result;
  }
}

export enum CellType {
  Melee,
  Range,
  Counter,
  Defence,
  Special,
  Effect,
  EracedTemp
}
