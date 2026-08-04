export interface ApiSuccessResponse<T> {
  success: true
  message: string
  data: T
}

export interface ApiErrorResponse {
  success: false
  statusCode: number
  message: string | string[]
  error: string
}
