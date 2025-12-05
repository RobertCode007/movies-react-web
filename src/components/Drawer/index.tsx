import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRouteByPath, getRouteByName, NavRouteName } from '../../config/routes';
import styles from './index.module.scss';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // 根据当前路径确定激活的导航项
  const getActiveNav = (): NavRouteName | null => {
    const currentRoute = getRouteByPath(location.pathname);
    if (!currentRoute) return null;
    
    if (currentRoute.name === 'nowPlaying' || currentRoute.name === 'topRated') {
      return currentRoute.name as NavRouteName;
    }
    return null;
  };
  
  const activeNav = getActiveNav();

  const handleNavClick = (nav: NavRouteName) => {
    const route = getRouteByName(nav);
    if (route) {
      navigate(route.path);
      onClose(); // 导航后关闭侧拉栏
    }
  };

  const handleLanguageToggle = () => {
    const newLang = currentLanguage === 'en' ? 'zh-TW' : 'en';
    changeLanguage(newLang);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  // 阻止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* 遮罩层 */}
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} />
      )}

      {/* 侧拉栏 */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawer_open : ''}`}>
        <div className={styles.drawer_header}>
          <h2 className={styles.drawer_title}>{t('common.menu') || 'Menu'}</h2>
          <button
            className={styles.close_button}
            onClick={onClose}
            aria-label={t('common.close')}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className={styles.drawer_content}>
          {/* 导航栏 */}
          <nav className={styles.drawer_nav}>
            <button
              className={`${styles.drawer_nav_item} ${activeNav === 'nowPlaying' ? styles.drawer_nav_item_active : ''}`}
              onClick={() => handleNavClick('nowPlaying')}
            >
              {t('navigation.nowPlaying')}
            </button>
            <button
              className={`${styles.drawer_nav_item} ${activeNav === 'topRated' ? styles.drawer_nav_item_active : ''}`}
              onClick={() => handleNavClick('topRated')}
            >
              {t('navigation.topRated')}
            </button>
          </nav>

          {/* 分隔线 */}
          <div className={styles.divider}></div>

          {/* 语言切换 */}
          <div className={styles.drawer_item}>
            <span className={styles.drawer_item_label}>
              {t('language.switchLanguage') || 'Language'}
            </span>
            <button
              className={styles.drawer_item_button}
              onClick={handleLanguageToggle}
            >
              <span>{currentLanguage === 'en' ? 'EN' : '繁'}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
          </div>

          {/* 主题切换 */}
          <div className={styles.drawer_item}>
            <span className={styles.drawer_item_label}>
              {t('theme.toggleTheme') || 'Theme'}
            </span>
            <button
              className={styles.drawer_item_button}
              onClick={handleThemeToggle}
            >
              <span>{theme === 'light' ? '🌙' : '☀️'}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {theme === 'light' ? (
                  <>
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </>
                ) : (
                  <>
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;

