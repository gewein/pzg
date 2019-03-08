// import Cells from '@/models/paz/Cells';
// import cellsEvaluation from '@/models/paz/ai/CellsEvaluation';
// import Enumerable, { IEnumerable } from 'linq';

// class AI {
//   public selectAt(cells: Cells) {
//     Enumerable.from(cells.items).select(c => {
//       const clone = cells.clone();
//       clone.resolve1_erace(c);
//       clone.resolve4_dropDamage();

//       return { cells: clone, eval: new cellsEvaluation(clone) };
//     });
//   }

//   // CellTypeを0～1で評価する
//   public EvaluateType() {}

//   public EvaluateCount() {}
// }
