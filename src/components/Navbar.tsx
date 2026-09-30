import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { siteConfig } from "../data/siteConfig";

const links = [
  ["Work", "work"],
  ["Skills", "skills"],
  ["Experience", "experience"],
  ["Contact", "contact"],
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, toggle] = useTheme();
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <nav
      aria-label="Main"
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${scrolled || open ? "border-b border-white/10 bg-bg/80 backdrop-blur" : ""}`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <a href="/" className="font-extrabold tracking-tight">
          Omkar Yelsange
        </a>
        <ul className="ml-auto mr-3 hidden items-center gap-8 text-sm text-fg2 md:flex">
          {links.map(([l, id]) => (
            <li key={id}>
              <a className="hover:text-fg" href={`/#${id}`}>
                {l}
              </a>
            </li>
          ))}
          <li>
            <a
              href={siteConfig.resume}
              className="rounded-lg border border-white/15 px-4 py-2 text-fg hover:border-accent/60"
            >
              Resume
            </a>
          </li>
        </ul>
        <div className="flex items-center gap-1">
          <button
            className="rounded-lg p-2 text-fg2 hover:text-fg"
            onClick={toggle}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="p-2 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <ul className="border-t border-white/10 px-6 pb-4 md:hidden">
          {[...links, ["Resume", ""]].map(([l, id]) => (
            <li key={l}>
              <a
                onClick={() => setOpen(false)}
                className="block py-4 text-lg"
                href={l === "Resume" ? siteConfig.resume : `/#${id}`}
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
