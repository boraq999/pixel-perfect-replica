import { useTheme } from "next-themes"
import { Palette, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate, useLocation } from "react-router-dom"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useFavoriteThemes } from "@/hooks/useFavoriteThemes"
import { getThemeById } from "@/config/themes"

export function ThemeToggle() {
    const { setTheme, theme = 'aurora' } = useTheme()
    const { favoriteThemes } = useFavoriteThemes()
    const navigate = useNavigate()
    const location = useLocation()
    
    const currentTheme = getThemeById(theme)
    const CurrentIcon = currentTheme?.icon

    const handleSettingsClick = () => {
        // Navigate to settings based on current route
        if (location.pathname.startsWith('/keeper')) {
            navigate('/keeper/settings')
        } else if (location.pathname.startsWith('/dashboard')) {
            navigate('/dashboard/settings')
        } else if (location.pathname.startsWith('/admin')) {
            navigate('/admin/settings')
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-accent group relative overflow-hidden">
                    {CurrentIcon && <CurrentIcon className={`h-5 w-5 transition-all text-primary ${theme === 'aurora' ? 'animate-pulse' : ''}`} />}
                    <span className="sr-only">تبديل الثيم</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border min-w-[200px]">
                <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-2">
                    <Palette className="w-3 h-3" />
                    الثيمات المفضلة (3)
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {favoriteThemes.map((themeId) => {
                    const themeConfig = getThemeById(themeId)
                    if (!themeConfig) return null
                    
                    const Icon = themeConfig.icon
                    const isActive = theme === themeId
                    
                    return (
                        <DropdownMenuItem 
                            key={themeId}
                            onClick={() => setTheme(themeId)} 
                            className={`flex items-center gap-3 cursor-pointer py-2.5 ${isActive ? 'bg-accent' : ''}`}
                        >
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${themeConfig.colors.from} ${themeConfig.colors.to} flex items-center justify-center ${themeId === 'aurora' ? 'animate-pulse' : ''}`}>
                                <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className={`font-medium ${isActive ? 'text-primary' : ''}`}>{themeConfig.name}</span>
                                {themeId === 'aurora' && (
                                    <span className="text-[10px] text-muted-foreground">✨ تأثير التوهج</span>
                                )}
                            </div>
                        </DropdownMenuItem>
                    )
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    onClick={handleSettingsClick}
                    className="flex items-center gap-3 cursor-pointer py-2.5"
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
                        <Settings className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium">تخصيص الثيمات</span>
                        <span className="text-[10px] text-muted-foreground">اختر المفضلة</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
