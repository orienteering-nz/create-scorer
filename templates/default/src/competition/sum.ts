import type {
  CompetitionClassLoose,
  CompetitionEntryScore,
} from '@o-zone/scorer-core/competition';
import { competitionScorer, done } from '@o-zone/scorer-core/server';
import { z } from 'zod';

const CompetitionScorerConfig = z
  .object({
    best: z.number().optional(),
  })
  .loose();

type HandlerProps = {
  classes: CompetitionClassLoose[];
  best?: number;
};

const handler = async ({ classes, best }: HandlerProps) => {
  console.log('Scoring competition...');
  console.log(`Using ${best ? `best ${best}` : 'all'} scores for each entry`);

  // for each entry, add up numeric scores (all, or top N when best is set)
  const entryScores: CompetitionEntryScore[] = classes
    .flatMap((c) => c.entries)
    .map((entry) => {
      const sortedScores = entry.race_runs
        .map((s) => s.score)
        .filter((s): s is number => typeof s === 'number')
        .sort((a, b) => b - a);
      const totalScore = sortedScores
        .slice(0, best ?? sortedScores.length)
        .reduce((a, b) => a + b, 0);
      return {
        competition_entry_id: entry.id,
        score: totalScore,
      };
    });

  console.log('Scoring competition complete.');

  return done({ entries: entryScores, success: true });
};

export default competitionScorer(
  ({ classes, config: { best } }) => handler({ best, classes }),
  CompetitionScorerConfig,
);
