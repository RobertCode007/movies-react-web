import 'react-i18next';

// 导入翻译资源类型
import enTranslations from '../locales/en.json';
import zhTWTranslations from '../locales/zh-TW.json';

// 定义资源类型
type Resources = {
  translation: typeof enTranslations;
};

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof enTranslations;
    };
  }
}

