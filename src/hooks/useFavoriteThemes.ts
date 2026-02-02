import { useState, useEffect } from 'react';

const FAVORITE_THEMES_KEY = 'favorite-themes';
const DEFAULT_FAVORITES = ['aurora', 'ocean', 'sunset'];

export function useFavoriteThemes() {
  const [favoriteThemes, setFavoriteThemes] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITE_THEMES_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_FAVORITES;
    } catch {
      return DEFAULT_FAVORITES;
    }
  });

  useEffect(() => {
    localStorage.setItem(FAVORITE_THEMES_KEY, JSON.stringify(favoriteThemes));
  }, [favoriteThemes]);

  const toggleFavorite = (themeId: string): { success: boolean; message?: string } => {
    if (favoriteThemes.includes(themeId)) {
      // Remove from favorites
      setFavoriteThemes(prev => prev.filter(id => id !== themeId));
      return { success: true };
    } else {
      // Add to favorites (max 3)
      if (favoriteThemes.length >= 3) {
        return { 
          success: false, 
          message: 'يجب إزالة أحد الثيمات أولاً. الحد الأقصى 3 ثيمات.' 
        };
      }
      setFavoriteThemes(prev => [...prev, themeId]);
      return { success: true };
    }
  };

  const isFavorite = (themeId: string): boolean => {
    return favoriteThemes.includes(themeId);
  };

  return {
    favoriteThemes,
    toggleFavorite,
    isFavorite,
  };
}
