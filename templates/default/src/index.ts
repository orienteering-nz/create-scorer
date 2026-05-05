import { Scorer } from '@o-zone/scorer-core/server';
import sumScorer from './competition/sum';

Scorer.serve({
  '/competition/sum': sumScorer,
});
