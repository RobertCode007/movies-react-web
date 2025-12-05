import { useTranslation } from 'react-i18next';

type Language = 'en' | 'zh-TW';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: Language) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage: Language = (i18n.language as Language) || 'en';

  return {
    currentLanguage,
    changeLanguage,
    t: i18n.t.bind(i18n),
  };
};

