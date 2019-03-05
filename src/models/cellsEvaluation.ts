import Cells from '@/models/cells';
import Cell, { CellType } from '@/models/cell';
import Enumerable, { IEnumerable } from 'linq';

export default class {
  private maxCountSet: IEnumerable<{
    type: CellType;
    max: { group: number | undefined; count: number };
  }>;

  constructor(cells: Cells) {
    this.maxCountSet = Enumerable.from(cells.items)
      .groupBy(i => i.type)
      .select(types => {
        return {
          type: types.key(),
          max: types
            .groupBy(cell => cell.group) // 各グループごとに数を集計して一番大きいグループをとってくる
            .select(groups => {
              return { group: groups.key(), count: groups.count() };
            })
            .orderByDescending(g => g.count)
            .first()
        };
      });
  }

  public getMaxGroup(cellType: CellType) {
    return this.maxCountSet.singleOrDefault(set => set.type === cellType);
  }
}
