import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="w-10 h-10">
                <Sun className="h-5 w-5" />
            </Button>
        );
    }

    const isDark = theme === "dark";

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="w-10 h-10 relative overflow-hidden group"
        >
            <div className="relative w-5 h-5">
                <Sun
                    className={`h-5 w-5 absolute inset-0 transition-all duration-500 ${isDark
                            ? "rotate-90 scale-0 opacity-0"
                            : "rotate-0 scale-100 opacity-100"
                        }`}
                />
                <Moon
                    className={`h-5 w-5 absolute inset-0 transition-all duration-500 ${isDark
                            ? "rotate-0 scale-100 opacity-100"
                            : "-rotate-90 scale-0 opacity-0"
                        }`}
                />
            </div>
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
