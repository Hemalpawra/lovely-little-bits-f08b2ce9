import { createContext, lazy, useCallback, useContext, useMemo, useState, Suspense, type ReactNode } from "react";
import { ClientOnly } from "@tanstack/react-router";

import type { Product } from "@/lib/catalog";

const AiChatDrawer = lazy(() => import("./AiChatDrawer"));

type AiChatContextValue = {
  openChat: (product?: Product) => void;
  closeChat: () => void;
  isOpen: boolean;
};

const AiChatContext = createContext<AiChatContextValue | null>(null);

export function useAiChat(): AiChatContextValue {
  const ctx = useContext(AiChatContext);
  if (!ctx) throw new Error("useAiChat must be used inside AiChatProvider");
  return ctx;
}

export function AiChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<Product | undefined>(undefined);

  const openChat = useCallback((next?: Product) => {
    setProduct(next);
    setIsOpen(true);
  }, []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ openChat, closeChat, isOpen }), [openChat, closeChat, isOpen]);

  return (
    <AiChatContext.Provider value={value}>
      {children}
      <ClientOnly fallback={null}>
        <Suspense fallback={null}>
          <AiChatDrawer isOpen={isOpen} onDismiss={closeChat} product={product} />
        </Suspense>
      </ClientOnly>
    </AiChatContext.Provider>
  );
}
