import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewModeToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const ViewModeToggle = ({ viewMode, onViewModeChange }: ViewModeToggleProps) => {
  return (
    <div className="flex bg-background rounded-lg p-1 shadow-sm border">
      <Button
        variant="ghost"
        size="icon"
        className={`h-9 w-9 rounded-md transition-all ${
          viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
        }`}
        onClick={() => onViewModeChange('grid')}
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`h-9 w-9 rounded-md transition-all ${
          viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
        }`}
        onClick={() => onViewModeChange('list')}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
};
