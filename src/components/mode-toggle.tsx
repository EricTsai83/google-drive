"use client";

import { useTheme } from "next-themes";
import { motion as m } from "motion/react";
import { Button } from "@/components/ui/button";

export default function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const raysVariants = {
    hidden: {
      strokeOpacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    visible: {
      strokeOpacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rayVariant = {
    hidden: {
      pathLength: 0,
      opacity: 0,
      // Start from center of the circle
      scale: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        // Customize timing for each property
        pathLength: { duration: 0.3 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.3 },
      },
    },
  };

  const shineVariant = {
    hidden: {
      opacity: 0,
      scale: 2,
      strokeDasharray: "20, 1000",
      strokeDashoffset: 0,
      filter: "blur(0px)",
    },
    visible: {
      opacity: [0, 1, 0],
      strokeDashoffset: [0, -50, -100],
      filter: ["blur(2px)", "blur(2px)", "blur(0px)"],
      transition: {
        duration: 0.75,
        ease: "linear",
      },
    },
  };

  const sunPath =
    "M70 49.5C70 60.8218 60.8218 70 49.5 70C38.1782 70 29 60.8218 29 49.5C29 38.1782 38.1782 29 49.5 29C60 29 69.5 38 70 49.5Z";
  const moonPath =
    "M70 49.5C70 60.8218 60.8218 70 49.5 70C38.1782 70 29 60.8218 29 49.5C29 38.1782 38.1782 29 49.5 29C39 45 49.5 59.5 70 49.5Z";
  return (
    <div className="flex items-center justify-center">
      <Button
        className="flex h-7 w-7 items-center justify-center p-0 hover:bg-transparent [&_svg]:size-8"
        variant="ghost"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        <m.svg
          strokeWidth="4"
          strokeLinecap="round"
          width={100}
          height={100}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative"
        >
          {/* 月亮的光線 */}
          <m.path
            variants={shineVariant}
            d={moonPath}
            className="absolute left-0 top-0 stroke-blue-100"
            initial="hidden"
            animate={theme === "dark" ? "visible" : "hidden"}
          />

          {/* 陽光射線 */}
          <m.g
            variants={raysVariants}
            initial="hidden"
            animate={theme === "light" ? "visible" : "hidden"}
            className="stroke-6 stroke-yellow-600"
            style={{ strokeLinecap: "round" }}
          >
            <m.path
              className="origin-center"
              variants={rayVariant}
              d="M50 2V11"
            />
            <m.path variants={rayVariant} d="M85 15L78 22" />
            <m.path variants={rayVariant} d="M98 50H89" />
            <m.path variants={rayVariant} d="M85 85L78 78" />
            <m.path variants={rayVariant} d="M50 98V89" />
            <m.path variants={rayVariant} d="M23 78L16 84" />
            <m.path variants={rayVariant} d="M11 50H2" />
            <m.path variants={rayVariant} d="M23 23L16 16" />
          </m.g>
          {/* 太陽和月亮的本體 */}
          <m.path
            d={theme === "dark" ? moonPath : sunPath}
            fill="transparent"
            transition={{ duration: 1, type: "spring" }}
            initial={{ fillOpacity: 0, strokeOpacity: 0 }}
            animate={{
              rotate: theme === "dark" ? -360 : 0,
              scale: theme === "dark" ? 2 : 1,
              stroke:
                theme === "dark"
                  ? "var(--color-blue-400)"
                  : "var(--color-yellow-600)",
              fill:
                theme === "dark"
                  ? "var(--color-blue-400)"
                  : "var(--color-yellow-600)",
              fillOpacity: 0.35,
              strokeOpacity: 1,
              transition: theme === "dark" ? { delay: 0.1 } : undefined,
            }}
          />
        </m.svg>
      </Button>
    </div>
  );
}
