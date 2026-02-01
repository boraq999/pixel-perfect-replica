import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  themes?: string[];
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ 
  children, 
  defaultTheme = "aurora",
  themes = ["aurora", "ocean", "sunset", "forest", "rose"],
  ...props 
}: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      defaultTheme={defaultTheme}
      themes={themes}
      attribute="class"
      enableSystem={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
