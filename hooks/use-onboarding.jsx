"use client";

import { usePathname, useRouter } from "next/navigation";
import { useConvexQuery } from "./use-convex-query";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";

const ATTENDEE_PAGES = ["/explore", "/events", "/my-tickets"];

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: currentUser, isLoading } = useConvexQuery(
    api.users.getCurrentUser
  );

  useEffect(() => {
    if (isLoading || !currentUser) return;

    if (!currentUser.hasCompletedOnboarding) {
      // Check if current page requires onboarding
      const requiresOnboarding = ATTENDEE_PAGES.some((page) =>
        pathname.startsWith(page)
      );

      if (requiresOnboarding) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShowOnboarding(true);
      }
    }
  }, [currentUser, pathname, isLoading]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Refresh to get updated user data
    router.refresh();
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    // Redirect back to homepage if they skip
    router.push("/");
  };

  return {
    showOnboarding,
    handleOnboardingComplete,
    handleOnboardingSkip,
    setShowOnboarding,
    needsOnboarding: currentUser && !currentUser.hasCompletedOnboarding,
  };
}
