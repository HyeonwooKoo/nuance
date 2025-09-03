import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-background p-4">
      <Button variant="ghost" size="icon">
        <Menu className="h-6 w-6" />
      </Button>
      <h1 className="text-xl font-bold">Nuance</h1>
      <ThemeToggle />
    </header>
  );
}