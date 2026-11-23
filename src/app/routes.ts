import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/today.tsx"),
  route("library", "routes/library.tsx"),
  route("library/:cocktailId", "routes/library-cocktail.tsx"),
  route("my-bar", "routes/my-bar.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("design-system", "routes/design-system.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
