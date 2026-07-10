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
                    '--normal-bg': '#1c1c1e',
                    '--normal-text': '#f4f4f5',
                    '--normal-border': 'rgba(255,255,255,0.10)',
                } as React.CSSProperties
            }
            toastOptions={{
                classNames: {
                    toast: 'flex items-center gap-3 !rounded-xl !border !border-white/10 !bg-[#1c1c1e] !px-4 !py-3 !text-zinc-100 !shadow-lg',
                    title: '!text-sm !font-medium !text-zinc-100',
                    description: '!text-sm !text-zinc-400',
                    success: '[&_[data-icon]]:!text-emerald-500',
                    error: '[&_[data-icon]]:!text-red-500',
                    warning: '[&_[data-icon]]:!text-amber-500',
                    info: '[&_[data-icon]]:!text-sky-500',
                    icon: '!size-5',
                    actionButton:
                        '!ml-auto !shrink-0 !rounded-md !border !border-white/10 !bg-[#3f3f46] !px-3 !py-1.5 !text-xs !font-medium !text-zinc-100 !shadow-sm transition-colors hover:!bg-[#52525b]',
                    cancelButton:
                        '!ml-auto !shrink-0 !rounded-md !border !border-white/10 !bg-transparent !px-3 !py-1.5 !text-xs !font-medium !text-zinc-400 transition-colors hover:!bg-white/10',
                },
            }}
            {...props}
        />
    );
}

export { Toaster };
