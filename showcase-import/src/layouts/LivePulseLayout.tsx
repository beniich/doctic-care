import React, { useState, useEffect, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  Lightbulb,
  Target,
  Users,
  Heart,
  Settings,
  Plus,
  ChevronDown,
  Activity,
  Menu,
  X,
  Sun,
  Moon,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLivePulse, SpaceType, PeriodType } from '@/contexts/LivePulseContext';
import { cn } from '@/lib/utils';

interface LivePulseLayoutProps {
  children: ReactNode;
  onNewSignal?: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/livepulse' },
  { icon: Radio, label: 'Signaux', path: '/livepulse/signals' },
  { icon: Lightbulb, label: 'Insights', path: '/livepulse/insights' },
  { icon: Target, label: 'Actions', path: '/livepulse/actions' },
  { icon: Users, label: 'Intelligence collective', path: '/livepulse/collective' },
  { icon: Heart, label: 'Culture & Confiance', path: '/livepulse/culture' },
  { icon: Settings, label: 'Paramètres', path: '/livepulse/settings' },
];

export default function LivePulseLayout({ children, onNewSignal }: LivePulseLayoutProps) {
  const location = useLocation();
  const { currentSpace, currentPeriod, setCurrentSpace, setCurrentPeriod } = useLivePulse();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border backdrop-blur-xl bg-background/80">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/livepulse" className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground">Live Pulse</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Space Selector */}
            <Select value={currentSpace} onValueChange={(v: SpaceType) => setCurrentSpace(v)}>
              <SelectTrigger className="w-[140px] bg-card border-border">
                <SelectValue placeholder="Espace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personnel</SelectItem>
                <SelectItem value="team">Équipe</SelectItem>
                <SelectItem value="organization">Organisation</SelectItem>
              </SelectContent>
            </Select>

            {/* Period Selector */}
            <Select value={currentPeriod} onValueChange={(v: PeriodType) => setCurrentPeriod(v)}>
              <SelectTrigger className="w-[120px] bg-card border-border">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 jours</SelectItem>
                <SelectItem value="30d">30 jours</SelectItem>
                <SelectItem value="90d">90 jours</SelectItem>
              </SelectContent>
            </Select>

            {/* New Signal */}
            <Button
              onClick={onNewSignal}
              className="hidden sm:flex bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau signal
            </Button>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-600 text-white text-sm">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Mon profil</DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/">Retour à Doctic Pro</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Déconnexion</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card/50 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="flex flex-col h-full p-4">
            <div className="flex-1 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path ||
                  (item.path !== '/livepulse' && location.pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium",
                      isActive
                        ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Help Card */}
            <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-blue-500/10 border border-border">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground font-medium mb-2">
                    Besoin d'aide pour utiliser Live Pulse ?
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Guide de démarrage
                  </Button>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] lg:ml-0">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
