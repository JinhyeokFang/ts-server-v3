export enum CreateUserResult {
  Success,
  AlreadyExist,
  ServerError
}

export enum LoginUserResult {
  Success,
  NotFound,
  ServerError
}

export enum RemoveUserResult {
  Success,
  NotFound,
  PasswordIncorrect,
  ServerError
}
