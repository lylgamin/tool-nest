"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdUnit() {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  return (
    <div style={{ margin: "0 0 3rem", overflow: "hidden" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9891812277341685"
        data-ad-layout-key="-gw-3+1f-3d+2z"
        data-ad-slot="7819897491"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
