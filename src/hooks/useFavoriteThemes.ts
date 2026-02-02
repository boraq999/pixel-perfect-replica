import { useThemeStore } from '@/store/themeStore';

export function useFavoriteThemes() {
  const { favoriteThemes, toggleFavorite, isFavorite } = useThemeStore();

  return {
    favoriteThemes,
    toggleFavorite,
    isFavorite,
  };
}
