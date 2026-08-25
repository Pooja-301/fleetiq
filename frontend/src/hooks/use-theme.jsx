import * as React from "react";
const ThemeContext = React.createContext({ theme: "light", toggleTheme: () => {
} });
function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState("light");
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);
  const toggleTheme = React.useCallback(() => {
    setTheme((t) => t === "light" ? "dark" : "light");
  }, []);
  const value = React.useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
function useTheme() {
  return React.useContext(ThemeContext);
}
export {
  ThemeProvider,
  useTheme
};
