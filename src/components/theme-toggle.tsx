import { useTheme } from "next-themes"
import { Sparkles, Waves, Sunset, Trees, Heart, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

const themeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    aurora: Sparkles,
    ocean: Waves,
    sunset: Sunset,
    forest: Trees,
    rose: Heart,
}

const themeNames: Record<string, string> = {
    aurora: 'الأضواء',
    ocean: 'المحيط',
    sunset: 'الغروب',
    forest: 'الغابة',
    rose: 'الوردي',
}

const themeColors: Record<string, { from: string; to: string }> = {
    aurora: { from: 'from-violet-500', to: 'to-cyan-500' },
    ocean: { from: 'from-blue-500', to: 'to-teal-500' },
    sunset: { from: 'from-orange-500', to: 'to-pink-500' },
    forest: { from: 'from-green-500', to: 'to-lime-500' },
    rose: { from: 'from-rose-500', to: 'to-amber-500' },
}

export function ThemeToggle() {
    const { setTheme, theme = 'aurora' } = useTheme()
    const CurrentIcon = themeIcons[theme] || Sparkles

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-accent group relative overflow-hidden">
                    <CurrentIcon className={`h-5 w-5 transition-all text-primary ${theme === 'aurora' ? 'animate-pulse' : ''}`} />
                    <span className="sr-only">تبديل الثيم</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border min-w-[200px]">
                <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-2">
                    <Palette className="w-3 h-3" />
                    اختر الثيم
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(themeNames).map(([key, name]) => {
                    const Icon = themeIcons[key]
                    const colors = themeColors[key]
                    const isActive = theme === key
                    
                    return (
                        <DropdownMenuItem 
                            key={key}
                            onClick={() => setTheme(key)} 
                            className={`flex items-center gap-3 cursor-pointer py-2.5 ${isActive ? 'bg-accent' : ''}`}
                        >
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center ${key === 'aurora' ? 'animate-pulse' : ''}`}>
                                <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className={`font-medium ${isActive ? 'text-primary' : ''}`}>{name}</span>
                                {key === 'aurora' && (
                                    <span className="text-[10px] text-muted-foreground">✨ تأثير التوهج</span>
                                )}
                            </div>
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
