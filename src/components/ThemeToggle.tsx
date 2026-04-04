import { Moon, Sun, Leaf, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

    const getIcon = () => {
        switch (theme) {
            case "agro-dark":
                return <Leaf className="h-5 w-5 text-primary" />;
            case "agro-light":
                return <Sun className="h-5 w-5 text-primary" />;
            case "cyber-dark":
            case "dark":
                return <Monitor className="h-5 w-5 text-primary" />;
            default:
                return <Sun className="h-5 w-5" />;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-10 h-10 relative overflow-hidden group border border-white/10 glass-card">
                    <div className="relative flex items-center justify-center">
                        {getIcon()}
                    </div>
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-white/10 bg-background/95 backdrop-blur-xl">
                <DropdownMenuItem 
                    onClick={() => setTheme("cyber-dark")}
                    className="flex items-center gap-2 cursor-pointer focus:bg-primary/20"
                >
                    <Monitor className="h-4 w-4 text-primary" />
                    <span>Cyber Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => setTheme("agro-dark")}
                    className="flex items-center gap-2 cursor-pointer focus:bg-primary/20"
                >
                    <Leaf className="h-4 w-4 text-[#1abdd6]" />
                    <span>Agro Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => setTheme("agro-light")}
                    className="flex items-center gap-2 cursor-pointer focus:bg-primary/20"
                >
                    <Sun className="h-4 w-4 text-[#e87b2f]" />
                    <span>Agro Light</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
