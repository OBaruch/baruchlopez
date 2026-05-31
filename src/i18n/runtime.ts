import en from "@/i18n/en.json";
import es from "@/i18n/es.json";
import {
  defaultLocale,
  geoLocaleCookie,
  latamCountryCodes,
  localeStorageKey,
  manualLocaleCookie,
  supportedLocales,
} from "@/i18n/config";

export const i18nRuntime = {
  defaultLocale,
  supportedLocales,
  latinAmericaCountries: latamCountryCodes,
  storageKey: localeStorageKey,
  manualCookie: manualLocaleCookie,
  geoCookie: geoLocaleCookie,
  dictionaries: {
    en,
    es,
  },
};
