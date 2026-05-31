const LATAM_COUNTRIES = new Set([
  "MX",
  "GT",
  "BZ",
  "SV",
  "HN",
  "NI",
  "CR",
  "PA",
  "CU",
  "DO",
  "PR",
  "CO",
  "VE",
  "EC",
  "PE",
  "BO",
  "CL",
  "AR",
  "PY",
  "UY",
  "BR",
]);

const MANUAL_COOKIE = "bl_locale";
const GEO_COOKIE = "bl_geo_locale";

const readCookie = (cookieHeader: string, name: string) => {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : "";
};

const isSupportedLocale = (value: string) => value === "en" || value === "es";

export const onRequest = async (context) => {
  const request = context.request;
  const cookieHeader = request.headers.get("Cookie") || "";
  const manualLocale = readCookie(cookieHeader, MANUAL_COOKIE);
  const response = await context.next();

  if (isSupportedLocale(manualLocale)) {
    return response;
  }

  const cfCountry =
    (request.cf?.country as string | undefined) ||
    request.headers.get("CF-IPCountry") ||
    request.headers.get("x-vercel-ip-country") ||
    "";
  const country = cfCountry.toUpperCase();

  if (!country) {
    return response;
  }

  const locale = LATAM_COUNTRIES.has(country) ? "es" : "en";
  const headers = new Headers(response.headers);
  headers.append("Set-Cookie", `${GEO_COOKIE}=${locale}; Path=/; Max-Age=86400; SameSite=Lax`);
  headers.set("Vary", [headers.get("Vary"), "CF-IPCountry"].filter(Boolean).join(", "));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
