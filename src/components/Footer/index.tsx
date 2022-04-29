import { useDark } from '@/hooks';
import React, { memo } from 'react';

const Footer = memo(() => {
  const { dark, toggleDark } = useDark();
  return (
    <div className="flex justify-center">
      <button className=" btn" onClick={toggleDark}>
        切换主题
      </button>
    </div>
  );
});

export default Footer;
