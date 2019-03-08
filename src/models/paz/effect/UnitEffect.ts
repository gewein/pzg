export default interface UnitEffect {
  type: EffectType;
  resolver: () => void;
}

export enum EffectType {
  Damage
}
