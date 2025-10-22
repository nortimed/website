import * as React from "react";
import { cn } from "@components/lib/utils";

export interface EmailInputProps
  extends Omit<React.ComponentProps<"input">, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

export const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [touched, setTouched] = React.useState(false);
    const [error, setError] = React.useState("");
    const [focused, setFocused] = React.useState(false);

    function validate(val: string) {
      if (!val) return "";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
        ? ""
        : "Please enter a valid email address.";
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const val = e.target.value;
      onChange(val);
      if (touched && !focused) {
        setError(validate(val));
      }
    }

    function handleBlur() {
      setTouched(true);
      setFocused(false);
      setError(validate(value));
    }

    function handleFocus() {
      setFocused(true);
    }

    return (
      <div>
        <input
          type="email"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          ref={ref}
          className={cn(
            "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            error && touched && !focused
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-input",
            className,
          )}
          {...props}
        />
        {error && touched && !focused && (
          <div className="text-xs text-red-600 mt-1">{error}</div>
        )}
      </div>
    );
  },
);
EmailInput.displayName = "EmailInput";
