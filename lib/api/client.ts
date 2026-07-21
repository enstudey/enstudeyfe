const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const getGoogleLoginConfig = (): { url: string; isBEAvailable: boolean } => {
  const oauthUrl = process.env.NEXT_PUBLIC_BE_OAUTH2_GOOGLE_URL;
  const isLocalhost = !oauthUrl || oauthUrl.includes("localhost") || oauthUrl.includes("127.0.0.1");

  return {
    url: oauthUrl || "",
    isBEAvailable: !isLocalhost
  };
};

export const getGoogleLoginUrl = (): string | null => {
  const config = getGoogleLoginConfig();
  return config.isBEAvailable ? config.url : null;
};



export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string }
): Promise<T> {
  const { token, headers, ...rest } = options;
  const requestHeaders = new Headers(headers);

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }
  
  if (!(rest.body instanceof FormData) && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  if (res.status === 204) {
    return {} as T;
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json() as Promise<T>;
  }

  return {} as T;
}
