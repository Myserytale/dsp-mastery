import type { WeekContent } from './weeks1to5';
export type { WeekContent, ConceptBlock } from './weeks1to5';

let _allWeeks: WeekContent[] | null = null;

export async function getAllWeeks(): Promise<WeekContent[]> {
  if (_allWeeks) return _allWeeks;

  const [{ weeks1to5 }, { weeks6to9 }, { weeks10to13 }, { pythonWalkthrough }] = await Promise.all([
    import('./weeks1to5'),
    import('./weeks6to9'),
    import('./weeks10to13'),
    import('./pythonWalkthrough'),
  ]);

  _allWeeks = [...weeks1to5, ...weeks6to9, ...weeks10to13, ...pythonWalkthrough];
  return _allWeeks;
}
