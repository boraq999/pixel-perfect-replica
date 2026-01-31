import { useTheme } from "next-themes"
import { Sun, Moon, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-accent group">
                    {theme === "light" ? (
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all text-orange-500" />
                    ) : theme === "dark" ? (
                        <Moon className="h-5 w-5 rotate-0 scale-100 transition-all text-blue-400" />
                    ) : (
                        <Sparkles className="h-5 w-5 rotate-0 scale-100 transition-all text-primary animate-glow" />
                    )}
                    <span className="sr-only">تبديل الثيم</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-white/20">
                <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2 cursor-pointer">
                    <Sun className="h-4 w-4 text-orange-500" />
                    <span>فاتح</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2 cursor-pointer">
                    <Moon className="h-4 w-4 text-blue-400" />
                    <span>داكن</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("best")} className="flex items-center gap-2 cursor-pointer font-bold">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Best (الافتراضي)</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
