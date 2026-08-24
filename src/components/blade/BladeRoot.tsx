import type { ReactNode } from "react";
import { BladeProvider } from "@razorpay/blade/components";
import { bladeTheme } from "@razorpay/blade/tokens";

/**
 * Blade renders through styled-components, which cannot run in this project's
 * SSR runtime. Everything Blade is therefore mounted client-side only
 * (see the <ClientOnly> wrappers in the routes).
 */
export function BladeRoot({ children }: { children: ReactNode }) {
  return (
    <BladeProvider themeTokens={bladeTheme} colorScheme="light">
      {children}
    </BladeProvider>
  );
}
