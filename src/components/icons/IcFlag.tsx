import React, { SVGProps } from 'react';
//flag icon
export function IcFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.36 6H7v6h7.24l.4 2H18V8h-5.24z"
        opacity=".3"
      ></path>
      <path
        fill="currentColor"
        d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6zm3.6 8h-3.36l-.4-2H7V6h5.36l.4 2H18v6z"
      ></path>
    </svg>
  );
}
