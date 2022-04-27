import React, { createContext } from 'react';
//@ts-ignore
import { Outlet } from 'umi';
import { useDark } from '../hooks';

export const ThemeContext = createContext({
  dark: false,
  toggleDark: () => {},
});

export default function Layout() {
  const { dark, toggleDark } = useDark();
  return (
    <ThemeContext.Provider value={{ dark, toggleDark }}>
      <div className={dark ? 'dark' : ''}>
        {/* 渲染子路由 */}
        <Outlet />
      </div>
    </ThemeContext.Provider>
  );
}
