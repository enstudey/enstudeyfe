export const ErrorCode = {
  // COMMON
  SUCCESS: 0,
  UNKNOWN_ERROR: 1,
  PERMISSION_DENIED: 2,
  TOKEN_INVALID: 3,
  TOKEN_EXPIRED: 4,

  // User
  USER_NOT_FOUND: 5,
  STREAK_NOT_FOUND: 6,
  AUTH_SYNC_FAILED: 7,
} as const;

export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode];
