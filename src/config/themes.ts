import { Sparkles, Waves, Sunset, Trees, Heart, Sun, Cloud, Zap, Leaf, Sprout } from 'lucide-react';

export interface ThemeConfig {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  colors: {
    primary: string;
    secondary: string;
    from: string;
    to: string;
  };
  category: 'dark' | 'light' | 'nature';
}

export const themeCategories = {
  dark: 'الثيمات الداكنة',
  light: 'الثيمات الفاتحة',
  nature: 'ثيمات الطبيعة',
};

export const themes: ThemeConfig[] = [
  // Dark Themes
  {
    id: 'aurora',
    name: 'الأضواء المتوهجة',
    nameEn: 'Aurora',
    description: 'أضواء شمالية متوهجة بتدرجات البنفسجي والسيان',
    icon: Sparkles,
    colors: {
      primary: 'hsl(270, 80%, 60%)',
      secondary: 'hsl(180, 75%, 55%)',
      from: 'from-violet-500',
      to: 'to-cyan-500',
    },
    category: 'dark',
  },
  {
    id: 'ocean',
    name: 'أعماق المحيط',
    nameEn: 'Ocean Depths',
    description: 'غموض المحيط بدرجات الأزرق الداكن',
    icon: Waves,
    colors: {
      primary: 'hsl(200, 85%, 50%)',
      secondary: 'hsl(180, 80%, 50%)',
      from: 'from-blue-500',
      to: 'to-teal-500',
    },
    category: 'dark',
  },
  {
    id: 'sunset',
    name: 'دفء الغروب',
    nameEn: 'Sunset Warmth',
    description: 'دفء الغروب بدرجات البرتقالي والوردي',
    icon: Sunset,
    colors: {
      primary: 'hsl(25, 85%, 55%)',
      secondary: 'hsl(340, 80%, 60%)',
      from: 'from-orange-500',
      to: 'to-pink-500',
    },
    category: 'dark',
  },
  {
    id: 'rose',
    name: 'الذهب الوردي',
    nameEn: 'Rose Gold',
    description: 'أناقة فاخرة بدرجات الوردي والذهبي',
    icon: Heart,
    colors: {
      primary: 'hsl(350, 75%, 55%)',
      secondary: 'hsl(40, 80%, 55%)',
      from: 'from-rose-500',
      to: 'to-amber-500',
    },
    category: 'dark',
  },
  
  // Light Themes
  {
    id: 'sunshine',
    name: 'ضوء النهار',
    nameEn: 'Sunshine',
    description: 'ثيم فاتح مشرق ومريح للعين',
    icon: Sun,
    colors: {
      primary: 'hsl(45, 85%, 50%)',
      secondary: 'hsl(35, 90%, 55%)',
      from: 'from-yellow-400',
      to: 'to-orange-400',
    },
    category: 'light',
  },
  {
    id: 'cloud',
    name: 'السحاب الهادئ',
    nameEn: 'Cloud Calm',
    description: 'درجات رمادية وزرقاء فاتحة ناعمة',
    icon: Cloud,
    colors: {
      primary: 'hsl(200, 50%, 50%)',
      secondary: 'hsl(220, 45%, 60%)',
      from: 'from-blue-300',
      to: 'to-gray-300',
    },
    category: 'light',
  },
  {
    id: 'pearl',
    name: 'اللؤلؤ الفاخر',
    nameEn: 'Pearl Luxury',
    description: 'أبيض كريمي مع لمسات ذهبية',
    icon: Zap,
    colors: {
      primary: 'hsl(280, 60%, 55%)',
      secondary: 'hsl(340, 65%, 60%)',
      from: 'from-purple-400',
      to: 'to-pink-400',
    },
    category: 'light',
  },
  
  // Nature Themes
  {
    id: 'forest',
    name: 'هدوء الغابة',
    nameEn: 'Forest Calm',
    description: 'هدوء الغابة بدرجات الأخضر الداكن',
    icon: Trees,
    colors: {
      primary: 'hsl(145, 70%, 45%)',
      secondary: 'hsl(90, 65%, 50%)',
      from: 'from-green-500',
      to: 'to-lime-500',
    },
    category: 'nature',
  },
  {
    id: 'mint',
    name: 'النعناع المنعش',
    nameEn: 'Fresh Mint',
    description: 'أخضر نعناعي منعش وهادئ',
    icon: Leaf,
    colors: {
      primary: 'hsl(160, 65%, 45%)',
      secondary: 'hsl(175, 60%, 50%)',
      from: 'from-teal-500',
      to: 'to-cyan-500',
    },
    category: 'nature',
  },
  {
    id: 'meadow',
    name: 'المروج الخضراء',
    nameEn: 'Green Meadow',
    description: 'أخضر طبيعي كالحقول والمروج',
    icon: Sprout,
    colors: {
      primary: 'hsl(120, 60%, 50%)',
      secondary: 'hsl(140, 55%, 45%)',
      from: 'from-green-500',
      to: 'to-emerald-500',
    },
    category: 'nature',
  },
];

export const getThemeById = (id: string): ThemeConfig | undefined => {
  return themes.find(theme => theme.id === id);
};

export const getThemesByCategory = (category: 'dark' | 'light' | 'nature'): ThemeConfig[] => {
  return themes.filter(theme => theme.category === category);
};
