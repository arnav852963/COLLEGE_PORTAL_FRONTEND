import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

const THEME_KEY = "theme";

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored === "dark" || stored === "light") {
            setTheme(stored);
        }
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    const value = useMemo(
        () => ({
            theme,
            setTheme,
            toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
        }),
        [theme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
}

