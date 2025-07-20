import React from "react";
import styles from "@/app/(auth)/sign-in/SignInFormGlass.module.css";
import cn from "classnames";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const GlassButton: React.FC<GlassButtonProps> = ({ children, className, ...props }) => (
  <button className={cn(styles.btnGlass, className)} {...props}>
    {children}
  </button>
);

export default GlassButton;
