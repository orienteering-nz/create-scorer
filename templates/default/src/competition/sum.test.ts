import { describe, expect, test } from 'bun:test';
import type { CompetitionScoreRequestLoose } from '@o-zone/scorer-core/competition';
import SumScorer from './sum';

type CompetitionScoreResponse = {
  success: boolean;
  entries: { competition_entry_id: number; score: number }[];
};

const baseCompetition = {
  competition_races: [
    { race_id: 101, scorer_role: 'score' as const },
    { race_id: 102, scorer_role: 'score' as const },
  ],
  id: 1,
  name: 'Test Competition',
};

const createRequest = (body: unknown) =>
  new Request('http://test.com/competition', {
    body: JSON.stringify(body),
    method: 'POST',
  });

describe('SumScorer', () => {
  test('sums all scores by default', async () => {
    const data = {
      classes: [
        {
          entries: [
            {
              id: 1,
              organization: null,
              race_runs: [
                { race_id: 101, score: 100 },
                { race_id: 102, score: 95 },
                { race_id: 101, score: 90 },
                { race_id: 102, score: 85 },
                { race_id: 101, score: 80 },
                { race_id: 102, score: 75 },
                { race_id: 101, score: 70 },
              ],
            },
            {
              id: 2,
              organization: null,
              race_runs: [
                { race_id: 101, score: 60 },
                { race_id: 102, score: null },
                { race_id: 101 },
                { race_id: 102, score: 50 },
                { race_id: 101, score: 40 },
              ],
            },
          ],
          id: 10,
          name: 'M21 Elite',
          short_name: 'M21E',
        },
      ],
      competition: baseCompetition,
      config: {},
    } satisfies CompetitionScoreRequestLoose;
    const req = createRequest(data);

    const res = await SumScorer.handler(data, req);
    expect(res.status).toBe(200);

    const body = (await res.json()) as CompetitionScoreResponse;
    expect(body.success).toBe(true);
    expect(body.entries).toHaveLength(2);
    expect(body.entries[0]).toEqual({ competition_entry_id: 1, score: 595 });
    expect(body.entries[1]).toEqual({ competition_entry_id: 2, score: 150 });
  });

  test('respects a custom best value from config', async () => {
    const data = {
      classes: [
        {
          entries: [
            {
              id: 3,
              organization: null,
              race_runs: [
                { race_id: 101, score: 40 },
                { race_id: 102, score: 30 },
                { race_id: 101, score: 20 },
                { race_id: 102, score: 10 },
              ],
            },
          ],
          id: 10,
          name: 'M21 Elite',
          short_name: 'M21E',
        },
      ],
      competition: baseCompetition,
      config: { best: 2 },
    } satisfies CompetitionScoreRequestLoose;
    const req = createRequest(data);

    const res = await SumScorer.handler(data, req);
    expect(res.status).toBe(200);

    const body = (await res.json()) as CompetitionScoreResponse;
    expect(body.entries).toEqual([{ competition_entry_id: 3, score: 70 }]);
  });
});
