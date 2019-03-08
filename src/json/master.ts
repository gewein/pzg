export interface Skill {
  type: number;
  name: string;
  effect: string;
  count: number;
}

export interface UnitMaster {
  id: number;
  name: string;
  life: number;
  skills: Skill[];
}
