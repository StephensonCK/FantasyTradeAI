import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const ThemeSwitcher: React.FC = () => {
  const { theme, changeTheme } = useTheme();

  const themes = [
    { key: 'light' as const, label: 'Light', icon: Sun },
    { key: 'dark' as const, label: 'Dark', icon: Moon },
    { key: 'system' as const, label: 'System', icon: Monitor }
  ];

  return (
    <div className="flex items-center space-x-1 bg-base-200 rounded p-1">
      {themes.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => changeTheme(key)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded text-sm font-medium transition-all ${
            theme === key
              ? 'bg-base-100 text-base-content shadow-sm'
              : 'text-base-content/60 hover:text-base-content hover:bg-base-100/50'
          }`}
          title={`Switch to ${label.toLowerCase()} mode`}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};