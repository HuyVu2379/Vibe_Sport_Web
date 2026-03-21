"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  User,
  Bell,
  ChevronDown,
  LayoutDashboard,
  Calendar,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { storage } from "@/data/storage";
import { useAuth } from "@/data/hooks/useAuth";

export function Navbar(props: { notificationCount?: number }) {
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    userRole: "CUSTOMER" | "OWNER" | "STAFF" | "ADMIN" | null;
    userName: string;
  }>({
    isAuthenticated: false,
    userRole: null,
    userName: "",
  });

  const notificationCount = props.notificationCount || 0;

  useEffect(() => {
    setMounted(true);
    const token = storage.getToken();
    const user = storage.getUser();
    if (token && user) {
      setAuthState({
        isAuthenticated: true,
        userRole: user.role,
        userName: user.fullName || "User",
      });
    }
  }, []);

  const { isAuthenticated, userRole, userName } = authState;

  const navLinks = [
    { href: "/venues", label: "Find Venues" },
    { href: "/sports", label: "Sports" },
    { href: "/about", label: "About" },
  ];

  const dashboardLink =
    userRole === "OWNER" || userRole === "ADMIN"
      ? "/dashboard"
      : userRole === "STAFF"
        ? "/staff"
        : null;

  const handleLogout = async () => {
    await logout();
    setAuthState({ isAuthenticated: false, userRole: null, userName: "" });
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">VS</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              VIBE<span className="text-primary">-SPORT</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  asChild
                >
                  <Link href="/notifications">
                    <Bell className="h-5 w-5" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </span>
                    )}
                  </Link>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="hidden lg:inline">
                        {mounted ? userName || "Unknown" : "Unknown"}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 glass">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/bookings" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        My Bookings
                      </Link>
                    </DropdownMenuItem>
                    {dashboardLink && (
                      <DropdownMenuItem asChild>
                        <Link
                          href={dashboardLink}
                          className="flex items-center gap-2"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2 text-destructive cursor-pointer" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="glow-primary">
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 glass border-t border-border/50",
          mobileMenuOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-border/50 space-y-2">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/profile">My Profile</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/bookings">My Bookings</Link>
                </Button>
                {dashboardLink && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={dashboardLink}>Dashboard</Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive cursor-pointer"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button className="w-full glow-primary" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
