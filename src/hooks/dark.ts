import { useEffect, useState } from 'react';

/**
 * 切换主题hook
 * @returns {boolean, () => void}
 */
export const useDark = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const localDark = localStorage.getItem('dark');
    if (localDark) {
      setDark(JSON.parse(localDark));
    }
  }, []);

  const toggleDark = () => {
    setDark(!dark);
    localStorage.setItem('dark', String(!dark));
  };

  return {
    dark,
    toggleDark,
  };
};
