"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { usePathname } from "next/navigation";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {

  const pathname = usePathname()

  // List of routes where you want to disable color scheme
  const routesWithDisabledColorScheme = [
    '/chatbot',
  ]

  // Check if current path should disable color scheme
  const shouldDisableColorScheme = routesWithDisabledColorScheme.some(
    route => pathname.startsWith(route)
  )

  return <NextThemesProvider {...props} enableColorScheme={!shouldDisableColorScheme}>{children}</NextThemesProvider>;
}
