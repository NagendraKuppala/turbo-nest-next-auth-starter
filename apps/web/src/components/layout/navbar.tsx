"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import { Search, Menu, SquarePlus } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // Handle hydration mismatch by only rendering auth-dependent components after mount
  useEffect(() => {
    setMounted(true);
    // Force a re-render when auth state changes
    const unsubscribe = useAuthStore.subscribe(
      (state) => state.isAuthenticated
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const showAuthUI = mounted && !isLoading;

  const logoSrc = mounted
    ? resolvedTheme === "dark"
      ? "/logo-dark.svg"
      : "/logo-light.svg"
    : "/logo-light.svg";

  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    {
      href: "/",
      label: "Deals",
      hasSubmenu: true,
      submenuItems: [
        { href: "/community-picks", label: "Community Picks" },
        { href: "/featured-deals", label: "Featured Deals" },
        { href: "/trending-deals", label: "Trending Deals" },
      ],
    },
    {
      href: "/posts/new",
      label: "Post",
      icon: <SquarePlus className="h-4 w-4 ml-1" />,
    },
    { href: "/flyers", label: "Flyers" },
    { href: "/deal-alerts", label: "Deal Alerts" },
    { href: "/news", label: "News" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Left - Logo & Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logoSrc}
              alt="KwikDeals"
              width={188}
              height={40}
              unoptimized
              priority
            />
          </Link>
        </div>

        {/* Middle - Search (Visible on tablet and desktop) */}
        <form className="hidden md:flex w-full max-w-sm items-center space-x-2 px-4">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="desktop-search-bar"
              type="search"
              placeholder="Search deals..."
              className="pl-8"
            />
          </div>
        </form>

        {/* Right - Navigation Items */}
        <nav className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => {
                  if (item.hasSubmenu) {
                    return (
                      <NavigationMenuItem key={item.href}>
                        <NavigationMenuTrigger className="text-sm font-medium transition-colors hover:text-primary">
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid min-w-[180px] w-max max-w-[300px] gap-2 p-2 grid-cols-1">
                            {item.submenuItems.map((subItem) => (
                              <ListItem
                                key={subItem.href}
                                title={subItem.label}
                                href={subItem.href}
                              >
                                {/* description property */}
                              </ListItem>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    );
                  } else {
                    return (
                      <NavigationMenuItem key={item.href}>
                        <Link href={item.href} legacyBehavior passHref>
                          <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                          >
                            <span className="flex items-center">
                              {item.label}
                              {item.icon && item.icon}
                            </span>
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    );
                  }
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Sign In Button - Always Visible */}
          {showAuthUI && (
            <>
              {isAuthenticated && user ? (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.username} />
                        ) : (
                          <AvatarFallback>
                            {user.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleProfileClick}>
                      My Account
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleProfileClick}>
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}

          <ModeToggle />

          {/* Tablet/Mobile Navigation */}
          <div className="flex lg:hidden items-center gap-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80">
                <SheetHeader className="mb-4">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Navigation menu for mobile devices
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 p-4">
                  {/* Search (Visible only on mobile) */}
                  <div className="relative w-full md:hidden">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mobile-search-bar"
                      type="search"
                      placeholder="Search deals..."
                      className="pl-8"
                    />
                  </div>

                  {/* Navigation Items */}
                  <div className="flex flex-col gap-4 py-2">
                    {navItems.map((item) => {
                      if (item.hasSubmenu) {
                        return (
                          <div key={item.href} className="flex flex-col gap-2">
                            <p className="font-medium text-sm">{item.label}</p>
                            <div className="border-l-2 border-muted pl-4 flex flex-col gap-2">
                              {item.submenuItems.map((subItem) => (
                                <SheetClose asChild key={subItem.href}>
                                  <Link
                                    href={subItem.href}
                                    className="text-sm font-medium hover:bg-secondary rounded-md py-2 px-3 transition-all duration-300 flex items-center"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {subItem.label}
                                  </Link>
                                </SheetClose>
                              ))}
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <SheetClose asChild key={item.href}>
                            <Link
                              href={item.href}
                              className="text-sm font-medium hover:bg-secondary rounded-md py-2 px-3 transition-all flex items-center"
                              onClick={() => setIsOpen(false)}
                            >
                              <span>{item.label}</span>
                              {item.icon && item.icon}
                            </Link>
                          </SheetClose>
                        );
                      }
                    })}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children && (
            <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          )}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
