import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon: LucideIcon;
    onBack?: () => void;
    action?: {
        label: string;
        icon: LucideIcon;
        onClick: () => void;
    };
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon: Icon, onBack, action }) => {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/95 to-primary p-6 text-white shadow-2xl md:p-8">
            <div className="absolute top-0 right-0 h-full w-1/2 bg-[url('/pattern.svg')] opacity-10 mix-blend-overlay" />
            <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-4"
                >
                    {onBack && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onBack}
                            className="rounded-full h-11 w-11 bg-white/10 hover:bg-white/20 text-white shrink-0"
                        >
                            <ArrowRight className="w-6 h-6" />
                        </Button>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-white/20 p-2 backdrop-blur-md md:p-3">
                            <Icon className="h-6 w-6 md:h-8 md:w-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold tracking-tight md:text-4xl text-white">{title}</h1>
                            {subtitle && <p className="mt-0.5 text-xs md:mt-1 md:text-base text-white/80">{subtitle}</p>}
                        </div>
                    </div>
                </motion.div>

                {action && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="hidden md:block"
                    >
                        <Button
                            onClick={action.onClick}
                            size="lg"
                            className="h-14 gap-2 rounded-2xl bg-white px-8 font-bold text-primary shadow-xl hover:bg-white/90"
                        >
                            <action.icon className="h-5 w-5" />
                            {action.label}
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
