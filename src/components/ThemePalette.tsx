import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { themes, themeCategories, getThemesByCategory } from '@/config/themes';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';


export const ThemePalette = () => {
  const { theme: currentTheme, setTheme } = useTheme();

  const renderThemeCard = (themeConfig: typeof themes[0], isSelected: boolean) => {
    const Icon = themeConfig.icon;
    const isLightTheme = themeConfig.category === 'light';

    return (
      <motion.div
        key={themeConfig.id}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setTheme(themeConfig.id);
          toast.success(`تم تفعيل ثيم ${themeConfig.name}`);
        }}
        className={`relative cursor-pointer rounded-xl p-4 transition-all border-2 ${
          isSelected 
            ? 'border-primary bg-primary/10' 
            : 'border-border hover:border-primary/50 bg-card'
        }`}
      >
        {/* Selected Badge */}
        {isSelected && (
          <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
        
        <div className="flex items-center gap-3 mb-3">
          <div 
            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${themeConfig.colors.from} ${themeConfig.colors.to} flex items-center justify-center ${themeConfig.id === 'aurora' ? 'animate-pulse' : ''}`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h5 className={`font-semibold ${isLightTheme ? 'text-gray-900 dark:text-foreground' : 'text-foreground'}`}>
              {themeConfig.name}
            </h5>
            <p className={`text-xs ${isLightTheme ? 'text-gray-700 dark:text-foreground/70' : 'text-muted-foreground'}`}>
              {themeConfig.nameEn}
            </p>
          </div>
        </div>
        
        <p className={`text-sm mb-3 ${isLightTheme ? 'text-gray-800 dark:text-foreground/80' : 'text-muted-foreground'}`}>
          {themeConfig.description}
        </p>
        
        <Button
          size="sm"
          variant={isSelected ? "default" : "outline"}
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            setTheme(themeConfig.id);
            toast.success(`تم تفعيل ثيم ${themeConfig.name}`);
          }}
        >
          {isSelected ? 'الثيم الحالي' : 'تطبيق الثيم'}
        </Button>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Dark Themes */}
      <div className="space-y-3">
        <h4 className="text-base font-semibold flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-800 to-gray-950"></div>
          {themeCategories.dark}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getThemesByCategory('dark').map((theme) => 
            renderThemeCard(theme, currentTheme === theme.id)
          )}
        </div>
      </div>

      {/* Light Themes */}
      <div className="space-y-3">
        <h4 className="text-base font-semibold flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 to-orange-300"></div>
          {themeCategories.light}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getThemesByCategory('light').map((theme) => 
            renderThemeCard(theme, currentTheme === theme.id)
          )}
        </div>
      </div>

      {/* Nature Themes */}
      <div className="space-y-3">
        <h4 className="text-base font-semibold flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-500"></div>
          {themeCategories.nature}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getThemesByCategory('nature').map((theme) => 
            renderThemeCard(theme, currentTheme === theme.id)
          )}
        </div>
      </div>
    </div>
  );
};
