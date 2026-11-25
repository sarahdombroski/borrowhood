import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Borrowhood",
    short_name: "BH",
    description: "The neighborhood hub for lending and borrowing.",
    start_url: "/",
    display: "standalone",
    background_color: "#efe8f4",
    theme_color: "#746D75",
    icons: [
      {
        src: '/192bhicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/512bhicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/512bhicon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ]
  }
}