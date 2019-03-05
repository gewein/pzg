import Cell, { CellType } from '@/models/cell';
import Enumerable, { IEnumerable } from 'linq';

export default class Cells {
  public rows: number = 0;
  public cols: number = 0;
  public items: Cell[] = [];

  private findCellMap = new Map<number, Cell>();

  public initialize(rows: number, cols: number) {
    this.items = [];
    this.findCellMap.clear();
    this.rows = rows;
    this.cols = cols;

    for (let r = 0; r < this.rows; r++) {
      let isMine = r % 2 === 0;
      for (let c = 0; c < this.cols; c++) {
        const cell = new Cell(
          r,
          c,
          Math.floor(Math.random() * 4),
          (isMine = !isMine)
        );
        this.items.push(cell);
      }
    }
    this.setupMap();
    this.setGroup();
  }

  public resolve1_erace(eraceFrom: Cell) {
    const eraced = this.items.filter(c => c.group === eraceFrom.group);

    eraced.forEach(r => {
      this.findCellMap.forEach(cell => {
        if (cell.col === r.col && cell.row < r.row) {
          cell.dropRows += 1;
        }
      });
      r.type = CellType.EracedTemp;
    });

    return eraced;
  }

  public resolve2_drop() {
    this.findCellMap.forEach(x => {
      x.row += x.dropRows;
      x.dropRows = 0;
    });

    this.setupMap();
  }

  public resolve3_generateDamage(eracedByMe: boolean) {
    const eraced = this.items.filter(i => i.isEraced);

    let index = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.findCellMap.has(r * 1000 + c) === false) {
          eraced[index].row = r - this.rows;
          eraced[index].col = c;
          eraced[index].type = Math.floor(Math.random() * 4) as CellType;
          eraced[index].isMine = eracedByMe;
          index++;
        }
      }
    }

    this.setupMap();
  }

  public resolve4_dropDamage() {
    const rows = this.rows;
    this.items.forEach(cell => {
      if (cell.row < 0) {
        cell.row = rows + cell.row;
      }
    });

    this.setupMap();
    this.setGroup();
  }

  public setGroup() {
    this.items.forEach(c => (c.group = undefined));

    let group = 0;

    this.findCellMap.forEach(c => {
      const t = this.topCell(c);
      const l = this.leftCell(c);

      if (c.group) {
        // 何もしない
      } else if (l && l.group !== undefined && l.type === c.type) {
        // 未付与で左と同じ
        c.group = l.group;
        c.reason = '左から';
      } else if (t && t.group !== undefined && t.type === c.type) {
        // 未付与で上と同じ
        c.group = t.group;
        c.reason = '上から';
      } else {
        // 隣接にグループが無いので、新しいグループにして右と下に先につけておく
        c.group = group++;
        c.reason = '新規';
      }
    });

    this.findCellMap.forEach(c => {
      const t = this.topCell(c);
      const l = this.leftCell(c);

      // 上と左をチェックして伝播させる
      if (l && l.type === c.type && l.group !== c.group) {
        const replaceGroup = l.group;
        this.findCellMap.forEach(_ => {
          if (_.group === replaceGroup) {
            _.group = c.group;
            _.reason = c.type + '-' + replaceGroup + '伝播';
          }
        });
      }
      if (t && t.type === c.type && t.group !== c.group) {
        const replaceGroup = t.group;
        this.findCellMap.forEach(_ => {
          if (_.group === replaceGroup) {
            _.group = c.group;
            _.reason = c.type + '-' + replaceGroup + '後伝播';
          }
        });
      }
    });
  }

  public leftCell(c: Cell): Cell | undefined {
    return c.col > 0 ? this.findCellMap.get(c.key - 1) : undefined;
  }
  public rightCell(c: Cell): Cell | undefined {
    return c.col < this.cols - 1 ? this.findCellMap.get(c.key + 1) : undefined;
  }
  public topCell(c: Cell): Cell | undefined {
    return c.row > 0 ? this.findCellMap.get(c.key - 1000) : undefined;
  }
  public bottomCell(c: Cell): Cell | undefined {
    return c.row < this.cols - 1
      ? this.findCellMap.get(c.key + 1000)
      : undefined;
  }

  public clone() {
    const result = new Cells();
    this.items.forEach(c => result.items.push(c.clone()));
    result.setupMap();
    return result;
  }

  private setupMap() {
    this.findCellMap.clear();
    this.items.forEach(cell => {
      if (cell.isEraced === false) {
        this.findCellMap.set(cell.key, cell);
      }
    });
  }
}
