// The playground's own light or dark chrome: the side panel and the frame
// headers. The frames keep their own views; this only sets data-theme on
// the document, which tokens.css follows. With no choice made it follows
// the system, and a choice is remembered in this browser.
import { useEffect, useState } from "react";

export type ChromeTheme = "light" | "dark";

const KEY = "stoa-playground-theme";

function stored(): ChromeTheme | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

const systemTheme = (): ChromeTheme =>
  typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export function useChromeTheme(): [ChromeTheme, (theme: ChromeTheme) => void] {
  const [chosen, setChosen] = useState<ChromeTheme | null>(stored);
  const [system, setSystem] = useState<ChromeTheme>(systemTheme);

  useEffect(() => {
    if (typeof matchMedia !== "function") return;
    const query = matchMedia("(prefers-color-scheme: dark)");
    const follow = () => setSystem(query.matches ? "dark" : "light");
    query.addEventListener("change", follow);
    return () => query.removeEventListener("change", follow);
  }, []);

  useEffect(() => {
    if (chosen) document.documentElement.dataset.theme = chosen;
    else delete document.documentElement.dataset.theme;
  }, [chosen]);

  const choose = (theme: ChromeTheme) => {
    setChosen(theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      // Storage blocked: the choice lasts for this page only.
    }
  };
  return [chosen ?? system, choose];
}
