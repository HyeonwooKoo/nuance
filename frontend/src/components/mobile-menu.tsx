import { Link } from "@tanstack/react-router";

type MobileMenuProps = {
  open: boolean;
  onLinkClick: () => void;
};

export function MobileMenu({ open, onLinkClick }: MobileMenuProps) {
  return (
    <div
      className={`fixed w-full h-full bg-background z-10 ${
        open ? "block" : "hidden"
      }`}
    >
      <nav className="flex flex-col items-left ml-10 gap-8 mt-10">
        <Link
          to="/upload"
          className="text-2xl font-medium font-normal hover:underline"
          onClick={onLinkClick}
        >
          Upload
        </Link>
        <Link
          to="/stats"
          className="text-2xl font-medium font-normal hover:underline"
          onClick={onLinkClick}
        >
          Stats
        </Link>
        <Link
          to="/settings"
          className="text-2xl font-medium font-normal hover:underline"
          onClick={onLinkClick}
        >
          Settings
        </Link>
      </nav>
    </div>
  );
}
