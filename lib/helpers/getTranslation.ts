export function getTranslation<T extends { language: string }>(
  translations: T[] = [],
  language: string,
  fallbackLocale = "en"
): T | undefined {
  return (
    translations.find((item) => item.language === language) ||
    translations.find((item) => item.language === fallbackLocale)
  );
}