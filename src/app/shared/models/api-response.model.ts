export interface ApiResponse<T> {
  error: {
    code: string;
    message: string;
  };
  result: T;
}
