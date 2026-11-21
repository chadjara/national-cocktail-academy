import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/today.tsx"),
  route("design-system", "routes/design-system.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
