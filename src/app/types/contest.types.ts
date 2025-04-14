export interface Contest {
  id: number;
  contestId: number;
  name: string;
  type: string;
  phase: string;
  frozen: string;
  durationSeconds: number;
  startTimeSeconds: number;
  relativeTimeSeconds: number;
}

export interface UserContest {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}
