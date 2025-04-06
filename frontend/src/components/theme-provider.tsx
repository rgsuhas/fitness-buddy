'use client'

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface CustomThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<CustomThemeProviderProps> = ({ children }) => {
  return (
    <NextThemesProvider defaultTheme="light" enableSystem>
      {children}
    </NextThemesProvider>
  );
};

export default ThemeProvider;