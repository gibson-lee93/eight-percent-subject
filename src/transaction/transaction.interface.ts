import { User } from '../users/entities/user.entity';

export interface ListQueryOptions {
  account_id?: string;
  page: string;
  trans_type: string;
  startDate?: string;
  endDate?: string;
}

export interface PagingOptions extends ListQueryOptions {
  user?: User;
  limit: number;
  offset: number;
}
