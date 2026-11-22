import { useCallback } from "react";

import { useLiveQuery, type LiveQueryState } from "~/lib/db/use-live-query";

import { favoritesRepository } from "../repositories/favorites-repository";

export function useFavorites(): {
  favorites: LiveQueryState<string[]>;
  toggle: (cocktailId: string, isFavorite: boolean) => void;
} {
  const favorites = useLiveQuery(() => favoritesRepository.listIds(), []);
  const toggle = useCallback((cocktailId: string, isFavorite: boolean) => {
    void (isFavorite
      ? favoritesRepository.remove(cocktailId)
      : favoritesRepository.add(cocktailId));
  }, []);
  return { favorites, toggle };
}
