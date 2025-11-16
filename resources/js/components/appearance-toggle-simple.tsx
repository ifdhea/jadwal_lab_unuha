import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceToggleSimple({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const toggleTheme = () => {
        const currentTheme = appearance === 'system'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : appearance;

        updateAppearance(currentTheme === 'dark' ? 'light' : 'dark');
    };

    const isDark = appearance === 'dark' ||
        (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <div className={className} {...props}>
            <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-md text-foreground hover:bg-transparent dark:hover:bg-transparent hover:text-[rgb(154,239,93)] dark:hover:text-primary transition-colors" onClick={toggleTheme}
            >
                {isDark ? (
                    <Sun className="h-5 w-5" />
                ) : (
                    <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
            </Button>
        </div>
    );
}
