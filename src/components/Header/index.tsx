import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import styles from './index.module.scss';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [activeNav, setActiveNav] = useState<'nowPlaying' | 'topRated'>('nowPlaying');

  const handleSearchClick = () => {
    // TODO: 实现搜索功能
    console.log('Search clicked');
  };

  const handleNavClick = (nav: 'nowPlaying' | 'topRated') => {
    setActiveNav(nav);
    // TODO: 实现导航功能
    console.log('Navigate to:', nav);
  };

  const handleLanguageToggle = () => {
    const newLang = currentLanguage === 'en' ? 'zh-TW' : 'en';
    changeLanguage(newLang);
  };

  return (
    <header className={styles.header}>
      <div className={styles.header_container}>
        {/* 左侧导航栏 */}
        <nav className={styles.nav}>
          <button
            className={`${styles.nav_item} ${activeNav === 'nowPlaying' ? styles.nav_item_active : ''}`}
            onClick={() => handleNavClick('nowPlaying')}
          >
            {t('navigation.nowPlaying')}
          </button>
          <button
            className={`${styles.nav_item} ${activeNav === 'topRated' ? styles.nav_item_active : ''}`}
            onClick={() => handleNavClick('topRated')}
          >
            {t('navigation.topRated')}
          </button>
        </nav>

        {/* 右侧功能按钮 */}
        <div className={styles.header_actions}>
          {/* 搜索图标 */}
          <button
            className={styles.action_button}
            onClick={handleSearchClick}
            title={t('common.search')}
            aria-label={t('common.search')}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>

          {/* 语言切换 */}
          <button
            className={styles.action_button}
            onClick={handleLanguageToggle}
            title={t('language.switchLanguage')}
            aria-label={t('language.switchLanguage')}
          >
            {currentLanguage === 'en' ? 'EN' : '繁'}
          </button>

          {/* 主题切换 */}
          <button
            className={styles.action_button}
            onClick={toggleTheme}
            title={t('theme.toggleTheme')}
            aria-label={t('theme.toggleTheme')}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

