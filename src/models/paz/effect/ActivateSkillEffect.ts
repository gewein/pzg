import { Skill } from '@/json/master';
import { EracedCellsSet } from '@/models/paz/EracedCells';

export default class {
  public readonly skill: Skill;
  public readonly eraced: EracedCellsSet;

  constructor(skill: Skill, cells: EracedCellsSet) {
    this.skill = skill;
    this.eraced = cells;
  }
}
