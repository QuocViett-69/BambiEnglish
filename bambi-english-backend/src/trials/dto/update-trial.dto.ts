import { TrialStatus } from '../trial.schema';

export class UpdateTrialDto {
  status?: TrialStatus;
  note?: string;
}
