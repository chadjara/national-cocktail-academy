import { Home } from "lucide-react";

import type { NavItem } from "~/design-system";

/**
 * Primary destinations. Only routes that ship get an entry; the tab bar
 * appears once there are two or more.
 */
export const primaryNav: readonly NavItem[] = [{ to: "/", label: "Today", icon: Home, end: true }];
