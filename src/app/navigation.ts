import { GraduationCap, Home, Martini, Wine } from "lucide-react";

import type { NavItem } from "~/design-system";

/**
 * Primary destinations. Only routes that ship get an entry; the tab bar
 * appears once there are two or more.
 */
export const primaryNav: readonly NavItem[] = [
  { to: "/", label: "Today", icon: Home, end: true },
  { to: "/learn", label: "Learn", icon: GraduationCap },
  { to: "/library", label: "Library", icon: Martini },
  { to: "/my-bar", label: "My Bar", icon: Wine },
];
