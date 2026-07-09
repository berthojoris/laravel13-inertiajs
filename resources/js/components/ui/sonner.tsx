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
                    toast: 'border border-solid',
                    success:
                        '!border-emerald-400/80 !shadow-[0_0_8px_rgba(52,211,153,0.45),0_0_18px_rgba(52,211,153,0.2)]',
                    error: '!border-red-400/80 !shadow-[0_0_8px_rgba(248,113,113,0.45),0_0_18px_rgba(248,113,113,0.2)]',
                    warning:
                        '!border-amber-400/80 !shadow-[0_0_8px_rgba(251,191,36,0.45),0_0_18px_rgba(251,191,36,0.2)]',
                    info: '!border-sky-400/80 !shadow-[0_0_8px_rgba(56,189,248,0.45),0_0_18px_rgba(56,189,248,0.2)]',
                },
            }}
            {...props}
        />
    );
}

export { Toaster };
