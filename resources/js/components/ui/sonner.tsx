import { useFlashToast } from '@/hooks/use-flash-toast';
import { useAppearance } from '@/hooks/use-appearance';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster({ ...props }: ToasterProps) {
    const { appearance } = useAppearance();

    useFlashToast();

    return (
        <Sonner
            theme={appearance}
            className="toaster group"
            position="bottom-center"
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                } as React.CSSProperties
            }
            toastOptions={{
                classNames: {
                    toast: 'relative overflow-hidden !rounded-none !border !bg-card !text-card-foreground !shadow-sm before:absolute before:inset-x-0 before:top-0 before:h-1 before:content-[""]',
                    success: 'before:bg-emerald-500',
                    error: 'before:bg-red-500',
                    warning: 'before:bg-amber-500',
                    info: 'before:bg-sky-500',
                },
            }}
            {...props}
        />
    );
}

export { Toaster };
