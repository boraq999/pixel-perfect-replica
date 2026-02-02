import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
    favoriteThemes: string[];
    toggleFavorite: (themeId: string) => { success: boolean; message?: string };
    isFavorite: (themeId: string) => boolean;
}

const DEFAULT_FAVORITES = ['aurora', 'ocean', 'sunset'];

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            favoriteThemes: DEFAULT_FAVORITES,

            toggleFavorite: (themeId: string) => {
                const { favoriteThemes } = get();
                if (favoriteThemes.includes(themeId)) {
                    set({ favoriteThemes: favoriteThemes.filter(id => id !== themeId) });
                    return { success: true };
                } else {
                    if (favoriteThemes.length >= 3) {
                        return {
                            success: false,
                            message: 'يجب إزالة أحد الثيمات أولاً. الحد الأقصى 3 ثيمات.'
                        };
                    }
                    set({ favoriteThemes: [...favoriteThemes, themeId] });
                    return { success: true };
                }
            },

            isFavorite: (themeId: string) => {
                return get().favoriteThemes.includes(themeId);
            },
        }),
        {
            name: 'favorite-themes-storage',
        }
    )
);
