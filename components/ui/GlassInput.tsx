import React from "react";
import styles from "@/app/(auth)/sign-in/SignInFormGlass.module.css";
import cn from "classnames";

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, className, ...props }, ref) => (
    <div className={cn(styles.inputGlass, className)}>
      {label && <label className="block mb-1">{label}</label>}
      <input ref={ref} {...props} />
    </div>
  )
);
GlassInput.displayName = "GlassInput";

export default GlassInput;
