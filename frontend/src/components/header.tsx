import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect,useState } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";

import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { UserNav } from "./user-nav";

const DEV_MODE = import.meta.env.VITE_DEV_MODE;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (isDesktop) {
      setIsMenuOpen(false);
    }
  }, [isDesktop]);

  const handleMenuClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const test = () => {
    console.log("Test button clicked");
  }

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background p-4">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={handleMenuClick}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          <div className="hidden md:flex w-4" />
          <Link to="/" onClick={handleLinkClick}>
            <h1 className="text-xl font-bold">Nuance</h1>
          </Link>

          {DEV_MODE && <Button variant="outline" size="sm" onClick={test}>Test</Button>}

          <nav className="hidden md:flex items-center gap-8 ml-10">
            <Link to="/upload" className="text-sm font-medium hover:underline">Upload</Link>
            <Link to="/stats" className="text-sm font-medium hover:underline">Stats</Link>
            <Link to="/settings" className="text-sm font-medium hover:underline">Settings</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </header>
      <MobileMenu open={isMenuOpen} onLinkClick={handleLinkClick} />
    </>
  );
}
