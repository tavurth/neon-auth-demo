import { createNeonAuth } from "@neondatabase/auth/next/server";
import { getAuthBaseUrl, getAuthCookieSecret } from "../env";

export const auth = createNeonAuth({
  baseUrl: getAuthBaseUrl(),
  cookies: {
    secret: getAuthCookieSecret(),
  },
});
