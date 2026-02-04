import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'بحث...',
  className = ''
}: SearchBarProps) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pr-10 h-11 border border-border bg-background shadow-none rounded-xl text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
