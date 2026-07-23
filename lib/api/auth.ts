import { apiFetch } from "./client";
import { EnvelopeResponse } from "./practice";

export interface LogoutResponse {
  message: string;
}

export function logoutApi(token: string) {
  return apiFetch<EnvelopeResponse<LogoutResponse>>(
    "/api/v1/auth/logout",
    {
      method: "POST",
      token
    }
  );
}
