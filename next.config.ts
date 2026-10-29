import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/predictions/football/betway-premiershipsouth-africa',
        destination: '/predictions/football/south-africa',
        permanent: true,
      },
      {
        source: '/predictions/football/copa-betano-do-brasilbrazil',
        destination: '/predictions/football/brazil',
        permanent: true,
      },
      {
        source: '/predictions/football/liga-futve-aperturavenezuela',
        destination: '/predictions/football/venezuela',
        permanent: true,
      },
      {
        source: '/predictions/football/uefa-youth-league-play-offseurope',
        destination: '/predictions/football/europe',
        permanent: true,
      },
      {
        source: '/predictions/football/v-league-1vietnam',
        destination: '/predictions/football/vietnam',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/sitemaps/index',
      },
      {
        source: '/sitemap_index.xml',
        destination: '/sitemaps/index',
      },
      {
        source: '/sitemap-static.xml',
        destination: '/sitemaps/static',
      },
      {
        source: '/sitemap-countries.xml',
        destination: '/sitemaps/countries',
      },
      {
        source: '/sitemap-news.xml',
        destination: '/sitemaps/news',
      },
      {
        source: '/sitemap-predictions-:page(\\d+).xml',
        destination: '/sitemaps/predictions-page/:page',
      },
      {
        source: '/sitemap-predictions-:sport.xml',
        destination: '/sitemaps/predictions/:sport',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'static.flashscore.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'a.espncdn.com',
      },
      {
        protocol: 'https',
        hostname: 'tmssl.akamaized.net',
      },
    ],
  },
};

export default nextConfig;
