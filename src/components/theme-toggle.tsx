import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './theme-context';
import { cn } from './ui/utils';

interface ThemeToggleProps {
  variant?: 'default' | 'ghost' | 'outline' | 'icon';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ 
  variant = 'ghost', 
  size = 'icon', 
  className,
  showLabel = false 
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative flex items-center justify-center',
        'h-10 w-10 rounded-xl',
        'transition-all duration-300',
        'hover:scale-105 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-[#006EF7] focus:ring-offset-2',
        'dark:focus:ring-offset-gray-900',
        theme === 'light' 
          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
          : 'bg-gray-800 hover:bg-gray-700 text-gray-200',
        className
      )}
      title={theme === 'light' ? 'Basculer en mode sombre' : 'Basculer en mode clair'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun 
          className={cn(
            'absolute h-5 w-5 transition-all duration-500',
            theme === 'dark' 
              ? 'rotate-90 scale-0 opacity-0' 
              : 'rotate-0 scale-100 opacity-100'
          )} 
        />
        <Moon 
          className={cn(
            'absolute h-5 w-5 transition-all duration-500',
            theme === 'light' 
              ? '-rotate-90 scale-0 opacity-0' 
              : 'rotate-0 scale-100 opacity-100'
          )} 
        />
      </div>
      {showLabel && (
        <span className="text-sm ml-2 whitespace-nowrap">
          {theme === 'light' ? 'Mode sombre' : 'Mode clair'}
        </span>
      )}
    </button>
  );
}

// Version compacte pour les espaces restreints
export function ThemeToggleCompact({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative flex items-center justify-center',
        'h-9 w-9 rounded-lg',
        'transition-all duration-300',
        'hover:scale-105 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-[#006EF7] focus:ring-offset-2',
        'dark:focus:ring-offset-gray-900',
        theme === 'dark' 
          ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
        className
      )}
      title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        <Sun 
          className={cn(
            'absolute h-4 w-4 transition-all duration-500',
            theme === 'dark' 
              ? 'rotate-90 scale-0 opacity-0' 
              : 'rotate-0 scale-100 opacity-100'
          )} 
        />
        <Moon 
          className={cn(
            'absolute h-4 w-4 transition-all duration-500',
            theme === 'light' 
              ? '-rotate-90 scale-0 opacity-0' 
              : 'rotate-0 scale-100 opacity-100'
          )} 
        />
      </div>
    </button>
  );
}

// Version avec menu déroulant pour plus d'options
export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </div>
        <span className="text-sm text-gray-900 dark:text-white">Thème</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setTheme('light')}
          className={cn(
            'h-9 px-4 rounded-lg text-sm transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-[#006EF7] focus:ring-offset-2',
            'dark:focus:ring-offset-gray-800',
            theme === 'light'
              ? 'bg-[#006EF7] text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          )}
        >
          Clair
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={cn(
            'h-9 px-4 rounded-lg text-sm transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-[#006EF7] focus:ring-offset-2',
            'dark:focus:ring-offset-gray-800',
            theme === 'dark'
              ? 'bg-[#006EF7] text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          )}
        >
          Sombre
        </button>
      </div>
    </div>
  );
}

// Version mobile switch (comme iOS)
export function ThemeToggleMobileSwitch({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006EF7] focus-visible:ring-offset-2',
        theme === 'dark' 
          ? 'bg-[#006EF7]' 
          : 'bg-gray-300 dark:bg-gray-600',
        className
      )}
      role="switch"
      aria-checked={theme === 'dark'}
      title={theme === 'light' ? 'Basculer en mode sombre' : 'Basculer en mode clair'}
    >
      <span
        className={cn(
          'inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300',
          theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
        )}
      />
    </button>
  );
}