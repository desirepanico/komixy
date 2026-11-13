export interface ApiResponse<T> {
  error: ApiError;
  result: T;
}

export interface ApiError {
  code: string;
  message: string;
}
