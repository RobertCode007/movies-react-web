import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { useLanguage } from '../../hooks/useLanguage';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBox from '../SearchBox';
import Drawer from '../Drawer';
import { getRouteByPath, getRouteByName, NavRouteName } from '../../config/routes';
import styles from './index.module.scss';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // 根据当前路径确定激活的导航项
  const getActiveNav = (): NavRouteName | null => {
    const currentRoute = getRouteByPath(location.pathname);
    if (!currentRoute) return null;

    // 只对导航栏中的路由项进行高亮
    if (currentRoute.name === 'nowPlaying' || currentRoute.name === 'topRated') {
      return currentRoute.name as NavRouteName;
    }
    return null; // 其他路径（如 /search）不选中任何导航项
  };

  const activeNav = getActiveNav();

  const handleNavClick = (nav: NavRouteName) => {
    const route = getRouteByName(nav);
    if (route) {
      navigate(route.path);
    }
  };

  const handleLanguageToggle = () => {
    const newLang = currentLanguage === 'en' ? 'zh-TW' : 'en';
    changeLanguage(newLang);
  };

  const handleSearchClick = () => {
    setIsSearchOpen((prev) => !prev);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const handleDrawerToggle = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.header_container}>
          {/* 左侧导航栏 - 桌面端显示 */}
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
            {/* 搜索区域 */}
            <div className={styles.search_wrapper}>
              {!isSearchOpen && (
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
              )}
              {/* 搜索框 */}
              <SearchBox isOpen={isSearchOpen} onClose={handleSearchClose}/>
            </div>

            {/* 语言切换 - 桌面端显示 */}
            <button
              className={`${styles.action_button} ${styles.desktop_only}`}
              onClick={handleLanguageToggle}
              title={t('language.switchLanguage')}
              aria-label={t('language.switchLanguage')}
            >
              {currentLanguage === 'en' ? 'EN' : '繁'}
            </button>

            {/* 主题切换 - 桌面端显示 */}
            <button
              className={`${styles.action_button} ${styles.desktop_only}`}
              onClick={toggleTheme}
              title={t('theme.toggleTheme')}
              aria-label={t('theme.toggleTheme')}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* 侧拉栏按钮 - 手机端显示 */}
            <button
              className={`${styles.action_button} ${styles.menu_button}`}
              onClick={handleDrawerToggle}
              title={t('common.menu') || 'Menu'}
              aria-label={t('common.menu') || 'Menu'}
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
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 侧拉栏 */}
      <Drawer isOpen={isDrawerOpen} onClose={handleDrawerClose}/>
    </>
  );
};

export default Header;

