import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import './LanguageToggle.scss';

const LanguageToggle: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'en' ? 'zh-TW' : 'en';
    changeLanguage(newLang);
  };

  return (
    <button className="language-toggle" onClick={toggleLanguage} title={t('language.switchLanguage')}>
      {currentLanguage === 'en' ? '🇺🇸 EN' : '🇹🇼 繁'}
    </button>
  );
};

export default LanguageToggle;

