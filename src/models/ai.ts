import Cells from '@/models/cells';
import cellsEvaluation from '@/models/cellsEvaluation';
import Enumerable, { IEnumerable } from 'linq';

class AI {
  public selectAt(cells: Cells) {
    Enumerable.from(cells.items).select(c => {
      const clone = cells.clone();
      clone.resolve1_erace(c);
      clone.resolve4_dropDamage();

      return { cells: clone, eval: new cellsEvaluation(clone) };
    });
  }
}
