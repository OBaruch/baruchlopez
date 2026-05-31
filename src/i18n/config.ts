export const supportedLocales = ["en", "es"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const defaultLocale: SupportedLocale = "en";

export const latamCountryCodes = [
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
] as const;

export const manualLocaleCookie = "bl_locale";
export const geoLocaleCookie = "bl_geo_locale";
export const localeStorageKey = "baruch_locale";
