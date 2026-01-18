"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  const processedCode = useRef(false);

  useEffect(() => {
    async function handleAuthCallback() {
      const { searchParams } = new URL(window.location.href);
      const code = searchParams.get("code");
      const next = searchParams.get("next") ?? "/funds"; // Default to /funds

      if (code) {
        if (processedCode.current) return;
        processedCode.current = true;

        try {
            console.log("[AuthCallback] Found code in URL:", code.substring(0, 5) + "...");
            console.log("[AuthCallback] Exchanging code for session...");
            
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
                console.error("[AuthCallback] Exchange error:", error.message, error);
            } else {
                console.log("[AuthCallback] Session established successfully!");
                console.log("[AuthCallback] User ID:", data.session?.user.id);
                console.log("[AuthCallback] Access Token present:", !!data.session?.access_token);
                
                // Verify immediate session retrieval
                const { data: sessionData } = await supabase.auth.getSession();
                console.log("[AuthCallback] Verified Session:", sessionData.session ? "Active" : "Missing");
            }
        } catch (err) {
             console.error("[AuthCallback] Unexpected error:", err);
        }
      }

      // Always redirect to clear the URL code
      router.replace(next);
    }

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background-dark text-white">
      <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="text-gray-400">Completing sign in...</p>
      </div>
    </div>
  );
}
