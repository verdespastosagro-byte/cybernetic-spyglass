import { ChevronDown } from 'lucide-react';

interface TerminalSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

const TerminalSelect = ({ label, value, onChange, options }: TerminalSelectProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-wider text-muted-foreground">
        {`> ${label}`}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-glow">
          #
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full bg-background border-2 border-primary px-8 py-3
            text-primary text-glow font-mono text-sm
            appearance-none cursor-pointer
            focus:outline-none focus:border-secondary
            transition-all duration-300
            pixelated-border
          "
        >
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-background text-primary"
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
      </div>
    </div>
  );
};

export default TerminalSelect;
