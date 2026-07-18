import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Personal photo gallery — not indexed.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    "max-image-preview": "none" as "none",
    "max-snippet": 0,
  },
  // noai / noimageai are emerging directives respected by well-behaved AI crawlers
  other: {
    robots: "noindex, nofollow, noai, noimageai, noarchive, noimageindex",
  },
};

export default function PicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Explicit noai meta for AI crawlers that check the HTML */}
      <meta name="robots" content="noindex, nofollow, noai, noimageai, noarchive, noimageindex" />
      {children}
    </>
  );
}
