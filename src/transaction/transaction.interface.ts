export interface ListQueryOptions {
  acc_num?: string;
  page: string;
  trans_type: string;
  startDate: string;
  endDate: string;
}

export interface PagingOptions extends ListQueryOptions {
  limit: number;
  offset: number;
}
