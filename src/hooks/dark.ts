import { useEffect, useState } from 'react';

/**
 * 切换主题hook
 * @returns {boolean, () => void}
 */
export const useDark = () => {
  const body = document.querySelector('body');
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const localDark = localStorage.getItem('dark');
    if (localDark) {
      setDark(JSON.parse(localDark));
      body?.setAttribute('class', localDark === 'true' ? 'dark' : '');
    }
  }, []);

  const toggleDark = () => {
    setDark(!dark);
    localStorage.setItem('dark', String(!dark));
    body?.setAttribute('class', !dark ? 'dark' : '');
  };

  return {
    dark,
    toggleDark,
  };
};
