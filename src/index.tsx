import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n/config'; // 初始化国际化
import './global.css';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 初始化主题（在应用渲染前设置）
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
};

initTheme();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);

reportWebVitals();
