import { User } from '../users/entities/user.entity';

export interface ListQueryOptions {
  account_id: string;
  page: string;
  trans_type?: 'in' | 'out';
  startDate?: string;
  endDate?: string;
}

export interface ListWithPageAndUserOptions extends ListQueryOptions {
  user?: User;
  limit: number;
  offset: number;
}
