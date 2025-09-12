export interface Route {
  href: string;
  label: string;
}

export const MainRoutes: Route[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];