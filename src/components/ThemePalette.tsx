import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Check, Sparkles, Waves, Sunset, Trees, Heart } from 'lucide-react';

interface ThemeOption {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
  };
  isGlow?: boolean;
}

const themes: ThemeOption[] = [
  {
    id: 'aurora',
    name: 'الأضواء المتوهجة',
    nameEn: 'Aurora Glow',
    description: 'تأثيرات نيون متوهجة مع حدود مضيئة',
    icon: Sparkles,
    colors: {
      primary: 'hsl(280, 90%, 60%)',
      secondary: 'hsl(180, 90%, 50%)',
      background: 'hsl(240, 20%, 8%)',
      accent: 'hsl(280, 50%, 20%)',
    },
    isGlow: true,
  },
  {
    id: 'ocean',
    name: 'أعماق المحيط',
    nameEn: 'Ocean Depths',
    description: 'ألوان زرقاء هادئة ومريحة للعين',
    icon: Waves,
    colors: {
      primary: 'hsl(200, 90%, 50%)',
      secondary: 'hsl(170, 80%, 45%)',
      background: 'hsl(210, 50%, 8%)',
      accent: 'hsl(200, 40%, 20%)',
    },
  },
  {
    id: 'sunset',
    name: 'دفء الغروب',
    nameEn: 'Sunset Warmth',
    description: 'درجات دافئة من البرتقالي والمرجاني',
    icon: Sunset,
    colors: {
      primary: 'hsl(15, 90%, 55%)',
      secondary: 'hsl(340, 80%, 55%)',
      background: 'hsl(20, 30%, 6%)',
      accent: 'hsl(15, 40%, 18%)',
    },
  },
  {
    id: 'forest',
    name: 'هدوء الغابة',
    nameEn: 'Forest Calm',
    description: 'ألوان طبيعية خضراء مهدئة',
    icon: Trees,
    colors: {
      primary: 'hsl(150, 70%, 40%)',
      secondary: 'hsl(90, 60%, 45%)',
      background: 'hsl(160, 30%, 7%)',
      accent: 'hsl(150, 30%, 18%)',
    },
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
      background: 'hsl(350, 20%, 8%)',
      accent: 'hsl(350, 25%, 18%)',
    },
  },
];

export const ThemePalette = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((themeOption, index) => {
          const isSelected = theme === themeOption.id;
          const Icon = themeOption.icon;

          return (
            <motion.button
              key={themeOption.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setTheme(themeOption.id)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-right ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-border hover:border-primary/50'
              }`}
              style={{
                background: themeOption.colors.background,
              }}
            >
              {/* Glow Effect for Aurora Theme */}
              {themeOption.isGlow && (
                <div 
                  className="absolute inset-0 rounded-xl opacity-50 pointer-events-none"
                  style={{
                    boxShadow: `0 0 30px ${themeOption.colors.primary}, 0 0 60px ${themeOption.colors.secondary}`,
                  }}
                />
              )}

              {/* Selected Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: themeOption.colors.primary }}
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}

              {/* Theme Preview */}
              <div className="relative z-10">
                {/* Header with icon */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${themeOption.colors.primary}, ${themeOption.colors.secondary})`,
                      boxShadow: themeOption.isGlow 
                        ? `0 0 20px ${themeOption.colors.primary}` 
                        : undefined,
                    }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{themeOption.name}</h3>
                    <p className="text-xs text-white/60">{themeOption.nameEn}</p>
                  </div>
                </div>

                {/* Color Palette Preview */}
                <div className="flex gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg"
                    style={{ 
                      background: themeOption.colors.primary,
                      boxShadow: themeOption.isGlow 
                        ? `0 0 10px ${themeOption.colors.primary}` 
                        : undefined,
                    }}
                  />
                  <div
                    className="w-8 h-8 rounded-lg"
                    style={{ 
                      background: themeOption.colors.secondary,
                      boxShadow: themeOption.isGlow 
                        ? `0 0 10px ${themeOption.colors.secondary}` 
                        : undefined,
                    }}
                  />
                  <div
                    className="w-8 h-8 rounded-lg border border-white/20"
                    style={{ background: themeOption.colors.accent }}
                  />
                  <div
                    className="flex-1 h-8 rounded-lg border border-white/20"
                    style={{ background: themeOption.colors.background }}
                  />
                </div>

                {/* Description */}
                <p className="text-xs text-white/70">{themeOption.description}</p>

                {/* Glow Badge */}
                {themeOption.isGlow && (
                  <div 
                    className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: `linear-gradient(135deg, ${themeOption.colors.primary}, ${themeOption.colors.secondary})`,
                      boxShadow: `0 0 15px ${themeOption.colors.primary}`,
                    }}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>تأثير التوهج</span>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
