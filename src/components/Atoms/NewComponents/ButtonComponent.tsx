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
      borderColor = "",
      bgColor = "transparent",
      textColor = "#000000",
      type = "button",
      font = "",
      fw = "500",
      fontSize = "",
      throttleMs = 1000, // default 1 second throttle
      style = {}, // Default empty object for custom inline styles
    },
    ref
  ) => {
    const isStringChild = typeof children === "string";

    const throttledOnClick = useMemo(() => {
      if (!onClick) return undefined;

      // Create a throttled wrapper only once per component lifetime
      const throttled = throttle(() => {
        onClick();
      }, throttleMs, { trailing: false });

      // Cleanup on unmount
      return throttled;
      // Note: DO NOT include `onClick` in dependencies
    }, [onClick, throttleMs]);

    useEffect(() => {
      return () => {
        throttledOnClick?.cancel();
      };
    }, [throttledOnClick]);

    return (
      <Button
        ref={ref} // ← critical for positioning
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
            backgroundColor: variant === "filled" ? bgColor : "transparent",
            borderColor: borderColor ? borderColor : bgColor,
            margin: "3px",
            "&:hover": {
              backgroundColor: variant === "filled" ? "#A30002" : "transparent",
              opacity: 0.8,
            },
            color: textColor,
            opacity: disabled ? 0.6 : 1,
            width: fullWidth ? "100%" : "fit-content",
            ...style, // Apply custom styles passed from the parent component
          },
        }}
      >
        {isStringChild ? (
          <span
            style={{
              color: textColor,
              fontFamily: font,
              fontSize: `${fontSize}px`,
              fontWeight: fw,
            }}
            className="font-open text-sm xl:text-lg 2xl:text-xl 3xl:text-2xl font-semibold text-white"
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
