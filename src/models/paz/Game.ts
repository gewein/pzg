import Cells from '@/models/paz/Cells';
import Unit from '@/models/paz/Unit';
import EracedCells from '@/models/paz/EracedCells';
import Actions from '@/models/paz/Actions';
import Cell from '@/models/paz/Cell';
import UnitEffect from '@/models/paz/effect/UnitEffect';
import EffectResolver from '@/models/paz/effect/EffectResolver';

export default class {
  public readonly cells = new Cells();
  public readonly actions = new Actions(this);

  public unit: Unit;
  public enemy: Unit;
  public eraced: EracedCells | undefined = undefined;
  public freeze: boolean = false;

  constructor() {
    this.start(8);
  }

  public start(size: number) {
    this.cells.initialize(size, size);
    this.actions.initialize();
    this.unit = new Unit(0, true);
    this.enemy = new Unit(1, false);
  }

  public onEracedEffect(eraced: EracedCells) {
    this.eraced = eraced;
  }

  public async beginEracePhase() {
    this.freeze = true;

    this.actions.enemySelect(
      this.cells.items[Math.floor(Math.random() * this.cells.items.length)],
      this.cells.items[Math.floor(Math.random() * this.cells.items.length)]
    );

    if (
      this.actions.select1 &&
      this.actions.select2 &&
      this.actions.enemySelect1 &&
      this.actions.enemySelect2
    ) {
      await this.resolveSelect(this.actions.select1, this.actions.enemySelect1);
      this.actions.release1();

      await this.resolveSelect(this.actions.select2, this.actions.enemySelect2);
      this.actions.release2();

      this.freeze = false;
    }
  }

  private async resolveSelect(selected: Cell, selectedEnemy: Cell) {
    const eraced = new EracedCells(
      this.cells.resolve1_erace(selected),
      this.cells.resolve1_erace(selectedEnemy)
    );

    // PlayAreaで反映
    this.eraced = eraced;
    await this.delay(300);

    // Unitで反映
    this.unit.activateSkill(eraced);
    this.enemy.activateSkill(eraced);

    await this.delay(300);

    const myEffect = this.unit.effectSkillToUnit([this.enemy]);
    const enemyEffect = this.enemy.effectSkillToUnit([this.unit]);

    EffectResolver.resolve(myEffect, enemyEffect);

    this.cells.resolve2_drop();

    await this.delay(300);

    this.cells.resolve3_generateDamage(true);

    await this.delay(300);

    this.cells.resolve4_dropDamage();
  }

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
