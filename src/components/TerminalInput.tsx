import { forwardRef } from 'react';
import { playKeystroke } from '@/lib/sounds';

interface TerminalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  ({ label, className, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      playKeystroke();
      onChange?.(e);
    };

    return (
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-wider text-muted-foreground">
          {`> ${label}`}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-glow">
            $
          </span>
          <input
            ref={ref}
            className={`
              w-full bg-background border-2 border-primary px-8 py-3
              text-primary text-glow font-mono text-sm
              placeholder:text-muted-foreground placeholder:text-glow-none
              focus:outline-none focus:border-secondary focus:text-glow-secondary
              transition-all duration-300
              pixelated-border
              ${className}
            `}
            onChange={handleChange}
            {...props}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary animate-blink">
            _
          </span>
        </div>
      </div>
    );
  }
);

TerminalInput.displayName = 'TerminalInput';

export default TerminalInput;