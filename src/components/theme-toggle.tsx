import { useTheme } from "next-themes"
import { Sun, Moon, Sparkles, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-accent group relative overflow-hidden">
                    {theme === "light" ? (
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all text-orange-500" />
                    ) : theme === "dark" ? (
                        <Moon className="h-5 w-5 rotate-0 scale-100 transition-all text-cyan-400" />
                    ) : (
                        <Sparkles className="h-5 w-5 rotate-0 scale-100 transition-all text-primary animate-pulse" />
                    )}
                    <span className="sr-only">تبديل الثيم</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-white/20 min-w-[180px]">
                <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-2">
                    <Palette className="w-3 h-3" />
                    اختر الوضع
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-3 cursor-pointer py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                        <Sun className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium">الشروق</span>
                        <span className="text-[10px] text-muted-foreground">دافئ ومشرق</span>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-3 cursor-pointer py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                        <Moon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium">النيون</span>
                        <span className="text-[10px] text-muted-foreground">فضاء مظلم</span>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme("best")} className="flex items-center gap-3 cursor-pointer py-2.5 bg-accent/30">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold">Best ⭐</span>
                        <span className="text-[10px] text-muted-foreground">الافتراضي المميز</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
