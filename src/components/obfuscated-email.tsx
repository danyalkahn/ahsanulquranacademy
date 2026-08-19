"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

// Renders "user [at] domain" in the server-rendered HTML (no literal "@",
// unreadable to plain-text scrapers) and upgrades to a real mailto link
// once hydrated on the client.
export default function ObfuscatedEmail({
  user,
  domain,
  className,
}: {
  user: string;
  domain: string;
  className?: string;
}) {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  if (!isClient) {
    return (
      <span className={className}>
        {user} [at] {domain}
      </span>
    );
  }

  const email = `${user}@${domain}`;
  return (
    <a href={`mailto:${email}`} className={className}>
      {email}
    </a>
  );
}
