import React, { forwardRef, useEffect, useMemo } from "react";
import { Button } from "@mantine/core";
import throttle from "lodash.throttle";

interface ButtonComponentProps {
  onClick?: () => void;
  variant?: "filled" | "outline" | "light" | "gradient" | "default";
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  radius?: number;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  type?: "button" | "submit" | "reset";
  children: React.ReactNode; // Only this instead of `title`
  style?: React.CSSProperties; // Add this line for custom inline styles
  font?: string;
  fontSize?: string;
  throttleMs?: number; // Add optional throttle delay (ms)
  fw?: string;
}


const ButtonComponent = forwardRef<HTMLButtonElement, ButtonComponentProps>(
  (
    {
      children,
      onClick,
      variant = "filled",
      className,
      leftIcon,
      rightIcon,
      disabled = false,
      loading = false,
      size = "sm",
      fullWidth = false,
      radius,
      borderColor,
      bgColor,
      textColor,
      type = "button",
      font = "",
      fw = "500",
      fontSize = "",
      throttleMs = 1000,
      style = {},
    },
    ref
  ) => {
    const isStringChild = typeof children === "string";

    // ... (throttledOnClick logic same as before)
    const throttledOnClick = useMemo(() => {
      if (!onClick) return undefined;
      const throttled = throttle(() => {
        onClick();
      }, throttleMs, { trailing: false });
      return throttled;
    }, [onClick, throttleMs]);

    useEffect(() => {
      return () => {
        throttledOnClick?.cancel();
      };
    }, [throttledOnClick]);

    return (
      <Button
        ref={ref}
        type={type}
        onClick={throttledOnClick}
        variant={variant}
        leftSection={leftIcon}
        rightSection={rightIcon}
        disabled={disabled}
        fullWidth={fullWidth}
        loading={loading}
        radius={radius || 16}
        size={size}
        className={className || ""}
        styles={{
          root: {
            backgroundColor: bgColor || (variant === "filled" ? "var(--primary-main)" : undefined),
            borderColor: borderColor || undefined,
            margin: "3px",
            color: textColor || (variant === "filled" ? "#ffffff" : undefined),
            opacity: disabled ? 0.6 : 1,
            width: fullWidth ? "100%" : "fit-content",
            ...style,
          },
        }}
      >
        {isStringChild ? (
          <span
            style={{
              color: textColor,
              fontFamily: font,
              fontSize: fontSize ? `${fontSize}px` : undefined,
              fontWeight: fw,
            }}
          >
            {children}
          </span>
        ) : (
          children
        )}
      </Button>
    );
  }
);

export default ButtonComponent;
