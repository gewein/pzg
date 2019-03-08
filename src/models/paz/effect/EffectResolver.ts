import UnitEffect, { EffectType } from '@/models/paz/effect/UnitEffect';
import Unit from '@/models/paz/Unit';
import { Skill } from '@/json/master';
import { EracedCellsSet } from '@/models/paz/EracedCells';
import { CellType } from '@/models/paz/Cell';

export interface ResolveEffectParameters {
  source: Unit;
  skill: Skill;
  eraced: EracedCellsSet;
  target: Unit;
}

const ratemap = [
  [1, 1, 1, 1], // Melee
  [1, 1, 1, 1], // Range
  [1, 1, 1, 1], // Counter
  [1, 1, 1, 1] // Defence
];

export default class {
  public static resolve(
    myEffect: ResolveEffectParameters | null,
    enemyEffect: ResolveEffectParameters | null
  ): {
    mine: UnitEffect;
    enemy: UnitEffect;
  } {
    const myRate =
      ratemap[myEffect ? myEffect.eraced.type : 4][
        enemyEffect ? enemyEffect.eraced.type : 4
      ];
    const enemyRate =
      ratemap[enemyEffect ? enemyEffect.eraced.type : 4][
        myEffect ? myEffect.eraced.type : 4
      ];

    return {
      mine: myEffect ? new CellUnitEffect(myEffect) : NoEffect,
      enemy: enemyEffect ? new CellUnitEffect(enemyEffect) : NoEffect
    };
  }
}

// enum SkillType {
//   Damage
// }

// const map = new Map<
//   SkillType,
//   (params: ResolveEffectParameters) => UnitEffect
// >();

// map.set(SkillType.Damage, p => {
//   return {
//     type: EffectType.Damage,
//     resolver: () => (p.target.life -= p.eraced.count)
//   };
// });
