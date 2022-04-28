import { useDark } from '@/hooks';
import React, { memo } from 'react';

const Footer = memo(() => {
  const { dark, toggleDark } = useDark();
  return (
    <div>
      <button onClick={toggleDark}>button</button>
    </div>
  );
});

export default Footer;
