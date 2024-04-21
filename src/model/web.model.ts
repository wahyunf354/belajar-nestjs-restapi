export class WebResponse<T> {
  code: number;
  status: string;
  data?: T;
  paging?: Paging;
}

export class Paging {
  size: number;
  current_page: number;
  total_page: number;
}
