import Cell, { CellType } from '@/models/paz/Cell';
import unitJson from '@/json/unit.json';
import EracedCells, { EracedCellsSet } from '@/models/paz/EracedCells';
import { Skill } from '@/json/master';
import UnitEffect from '@/models/paz/effect/UnitEffect';
import ActivateSkillEffect from '@/models/paz/effect/ActivateSkillEffect';
import { ResolveEffectParameters } from '@/models/paz/effect/EffectResolver';

enum UnitClass {
  Fighter,
  Knight,
  Magician,
  Archer
}

export default class Unit {
  public activateSkillEffect: ActivateSkillEffect | null;
  public givenEffect: UnitEffect | null;

  public life = 0;
  public skillCharge = [0, 0];

  private readonly id: number;
  private readonly isPlayer: boolean;

  constructor(id: number, isPlayer: boolean) {
    this.id = id;
    this.isPlayer = isPlayer;
    this.life = this.lifeMax;
  }

  // prettier-ignore
  public get lifeMax() { return this.master.life; }
  // prettier-ignore
  public get s1Max() { return this.master.skills[0].count; }
  // prettier-ignore
  public get s2Max() { return this.master.skills[1].count; }
  // prettier-ignore
  private get master() { return unitJson[this.id]; }

  public activateSkill(eraced: EracedCells) {
    const ownedCells = this.isPlayer ? eraced.mine : eraced.enemy;

    this.master.skills.forEach((s, i) => {
      if (s.type === ownedCells.type) {
        this.activateSkillEffect = new ActivateSkillEffect(s, ownedCells);
        this.skillCharge[i]++;
      }
    });
  }

  public effectSkillToUnit(targetList: Unit[]): ResolveEffectParameters | null {
    if (this.activateSkillEffect === null) {
      return null;
    } else {
      return {
        target: targetList[0],
        eraced: this.activateSkillEffect.eraced,
        skill: this.activateSkillEffect.skill,
        source: this
      };
    }
  }

  public async takeEffect() {}
}
