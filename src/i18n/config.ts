import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../locales/en.json';
import zhTWTranslations from '../locales/zh-TW.json';

// 检测浏览器语言
const getBrowserLanguage = (): string => {
  // 从 localStorage 读取保存的语言
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage === 'en' || savedLanguage === 'zh-TW') {
    return savedLanguage;
  }

  // 检测浏览器语言
  const browserLang = navigator.language || (navigator as any).userLanguage;
  
  // 支持的语言列表
  const supportedLanguages = ['en', 'zh-TW'];
  
  // 精确匹配
  if (supportedLanguages.includes(browserLang)) {
    return browserLang;
  }
  
  // 匹配语言代码（例如：zh-CN -> zh-TW）
  const langCode = browserLang.split('-')[0];
  if (langCode === 'zh') {
    return 'zh-TW'; // 中文默认使用繁体中文
  }
  
  // 默认返回英文
  return 'en';
};

const resources = {
  en: {
    translation: enTranslations,
  },
  'zh-TW': {
    translation: zhTWTranslations,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getBrowserLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React 已经转义了
    },
    react: {
      useSuspense: false, // 避免 Suspense 警告
    },
  });

// 监听语言变化，保存到 localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
  // 更新 HTML lang 属性
  document.documentElement.lang = lng;
});

// 初始化时设置 HTML lang 属性
document.documentElement.lang = i18n.language;

export default i18n;

