import { useChargeFlowStore } from "../store/useChargeFlowStore";
import { translations, TranslationStrings } from "./translations";
import { Language } from "../types";

export const useTranslation = (): {
  t: TranslationStrings;
  language: Language;
  setLanguage: (lang: Language) => void;
} => {
  const language = useChargeFlowStore((s) => s.language);
  const setLanguage = useChargeFlowStore((s) => s.setLanguage);

  const t = translations[language] || translations.EN;

  return { t, language, setLanguage };
};
