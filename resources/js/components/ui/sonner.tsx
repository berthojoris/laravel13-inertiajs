import { useFlashToast } from '@/hooks/use-flash-toast';
import { useAppearance } from '@/hooks/use-appearance';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster({ ...props }: ToasterProps) {
    const { appearance, resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    useFlashToast();

    return (
        <Sonner
            theme={appearance}
            className="toaster group"
            position="bottom-center"
            style={
                isDark
                    ? ({
                          '--normal-bg': '#ffffff',
                          '--normal-text': '#18181b',
                          '--normal-border': 'rgba(0,0,0,0.10)',
                      } as React.CSSProperties)
                    : ({
                          '--normal-bg': '#1c1c1e',
                          '--normal-text': '#f4f4f5',
                          '--normal-border': 'rgba(255,255,255,0.10)',
                      } as React.CSSProperties)
            }
            toastOptions={{
                classNames: {
                    toast: isDark
                        ? 'flex items-center gap-3 !rounded-xl !border !border-black/10 !bg-white !px-4 !py-3 !text-zinc-900 !shadow-lg'
                        : 'flex items-center gap-3 !rounded-xl !border !border-white/10 !bg-[#1c1c1e] !px-4 !py-3 !text-zinc-100 !shadow-lg',
                    title: isDark
                        ? '!text-sm !font-medium !text-zinc-900'
                        : '!text-sm !font-medium !text-zinc-100',
                    description: isDark
                        ? '!text-sm !text-zinc-500'
                        : '!text-sm !text-zinc-400',
                    success: '[&_[data-icon]]:!text-emerald-500',
                    error: '[&_[data-icon]]:!text-red-500',
                    warning: '[&_[data-icon]]:!text-amber-500',
                    info: '[&_[data-icon]]:!text-sky-500',
                    icon: '!size-5',
                    actionButton: isDark
                        ? '!ml-auto !shrink-0 !rounded-md !border !border-black/10 !bg-zinc-100 !px-3 !py-1.5 !text-xs !font-medium !text-zinc-900 !shadow-sm transition-colors hover:!bg-zinc-200'
                        : '!ml-auto !shrink-0 !rounded-md !border !border-white/10 !bg-[#3f3f46] !px-3 !py-1.5 !text-xs !font-medium !text-zinc-100 !shadow-sm transition-colors hover:!bg-[#52525b]',
                    cancelButton: isDark
                        ? '!ml-auto !shrink-0 !rounded-md !border !border-black/10 !bg-transparent !px-3 !py-1.5 !text-xs !font-medium !text-zinc-500 transition-colors hover:!bg-black/5'
                        : '!ml-auto !shrink-0 !rounded-md !border !border-white/10 !bg-transparent !px-3 !py-1.5 !text-xs !font-medium !text-zinc-400 transition-colors hover:!bg-white/10',
                },
            }}
            {...props}
        />
    );
}

export { Toaster };
