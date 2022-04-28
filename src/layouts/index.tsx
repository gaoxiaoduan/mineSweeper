import React from 'react';
//@ts-ignore
import { Outlet } from 'umi';

export default function Layout() {
  return (
    <>
      {/* 渲染子路由 */}
      <Outlet />
    </>
  );
}
