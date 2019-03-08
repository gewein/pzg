import Cell from '@/models/paz/Cell';
import Game from '@/models/paz/Game';

export default class {
  // prettier-ignore
  public get select1() { return this._select1; }
  // prettier-ignore
  public get select2() { return this._select2; }
  // prettier-ignore
  public get enemySelect1() { return this._enemySelect1; }
  // prettier-ignore
  public get enemySelect2() { return this._enemySelect2; }

  private _select1: Cell | null = null;
  private _select2: Cell | null = null;
  private _enemySelect1: Cell | null = null;
  private _enemySelect2: Cell | null = null;

  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  public initialize() {
    this._select1 = this._select2 = this._enemySelect1 = this._enemySelect2 = null;
  }

  public select(cell: Cell) {
    if (this.select1 === null) {
      this._select1 = cell;
    } else if (this.select1 === cell) {
      this._select1 = null;
    } else {
      this._select2 = cell;

      this.game.beginEracePhase();
    }
  }

  public enemySelect(cell1: Cell, cell2: Cell) {
    this._enemySelect1 = cell1;
    this._enemySelect2 = cell2;
  }

  public release1() {
    this._select1 = this._enemySelect1 = null;
  }

  public release2() {
    this._select2 = this._enemySelect2 = null;
  }
}
