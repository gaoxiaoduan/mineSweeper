import { ThemeContext } from '@/layouts/index';
import React, { memo, useContext } from 'react';

const Footer = memo(() => {
  const { dark, toggleDark } = useContext(ThemeContext);

  return (
    <div>
      <button onClick={toggleDark}>button</button>
    </div>
  );
});

export default Footer;
