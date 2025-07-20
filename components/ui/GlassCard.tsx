import React from "react";
import styles from "@/app/(auth)/sign-in/SignInGlass.module.css";
import cn from "classnames";

interface GlassCardProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({ className, children, style }) => (
  <div className={cn(styles.glassCard, className)} style={style}>
    {children}
  </div>
);

export default GlassCard;
