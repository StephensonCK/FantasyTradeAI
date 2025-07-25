import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || 'light';
  });

  useEffect(() => {
    const html = document.documentElement;
    
    // Use standard DaisyUI theme names
    html.setAttribute('data-theme', theme);
    
    console.log('DaisyUI theme set to:', theme);
    console.log('HTML data-theme attribute:', html.getAttribute('data-theme'));
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return { theme, changeTheme };
};