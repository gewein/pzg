import Cells from '@/models/paz/Cells';
import Team from '@/models/paz/Team';
import Unit from '@/models/paz/Unit';

export default class {
  public cells = new Cells();
  public unit = new Unit();

  public start(size: number) {
    this.cells.initialize(size, size);
  }
}
