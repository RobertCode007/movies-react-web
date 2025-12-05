import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button className="theme-toggle" onClick={toggleTheme} title={t('theme.toggleTheme')}>
      {theme === 'light' ? `🌙 ${t('theme.dark')}` : `☀️ ${t('theme.light')}`}
    </button>
  );
};

export default ThemeToggle;

