export interface ResponseSuccessBody {
  data?: Record<string, unknown>,
  message?: string
}

export interface ResponseFailedBody {
  errorMessage?: string,
  errorCode?: number
}