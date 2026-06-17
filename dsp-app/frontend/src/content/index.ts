import type { WeekContent } from './weeks1to5';
export type { WeekContent, ConceptBlock } from './weeks1to5';

// These will be populated by the content writer subagents
// For now, provide a re-export barrel

let _allWeeks: WeekContent[] | null = null;

export async function getAllWeeks(): Promise<WeekContent[]> {
  if (_allWeeks) return _allWeeks;

  const [{ weeks1to5 }, { weeks6to9 }, { weeks10to13 }] = await Promise.all([
    import('./weeks1to5'),
    import('./weeks6to9'),
    import('./weeks10to13'),
  ]);

  _allWeeks = [...weeks1to5, ...weeks6to9, ...weeks10to13];
  return _allWeeks;
}
