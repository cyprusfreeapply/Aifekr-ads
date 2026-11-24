import React from 'react';

const paths: Record<string, React.ReactNode> = {
  cap: <><path d="M3 9l9-4 9 4-9 4-9-4z" /><path d="M7 11v4c0 1.5 2.5 3 5 3s5-1.5 5-3v-4" /><path d="M21 9v5" /></>,
  plane: <path d="M10.5 21l1.5-1v-5.5l8 3v-2l-8-5V4.5a1.5 1.5 0 0 0-3 0V10.5l-8 5v2l8-3V20l1.5 1z" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  hash: <><path d="M5 9h14M5 15h14M10 4L8 20M16 4l-2 16" /></>,
  chat: <><path d="M4 5h16v11H9l-5 4V5z" /><path d="M8 10h8M8 13h5" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-9 9" /></>,
  audio: <><path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" /></>,
  plus: <><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /><path d="M8 14h3v3H8z" /></>,
  doc: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /><path d="M9 12h6M9 15h6M9 18h4" /></>,
  spark: <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" />,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  suitcase: <><rect x="3" y="7" width="18" height="13" rx="2.5" /><path d="M9 7V5h6v2M3 12h18" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  gift: <><rect x="3.5" y="9" width="17" height="11" rx="1.5" /><path d="M2.5 9h19M12 9v11M12 9c-1.5-4-6-4-6-1.5S10 9 12 9zm0 0c1.5-4 6-4 6-1.5S14 9 12 9z" /></>,
};

export const Icon: React.FC<{ name: string; size?: number; color?: string; stroke?: number; fill?: boolean }> = ({ name, size = 40, color = '#fff', stroke = 2, fill }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? color : 'none'} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {paths[name] ?? paths.spark}
  </svg>
);

export const Cursor: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M5 3l14 8.2-6.3 1.4 3.6 6.6-2.6 1.4-3.6-6.6L5 18.5z" fill="#fff" stroke="#17191D" strokeWidth={1.3} strokeLinejoin="round" />
  </svg>
);
