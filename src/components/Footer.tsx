import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-200 text-base-content/60 py-8 mt-16 border-t border-base-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <p className="text-sm">
            © {currentYear} Fantasy Trade AI. All rights reserved.
          </p>
          <ThemeSwitcher />
        </div>
      </div>
    </footer>
  );
};