import type { NextConfig } from "next";

// Ensure polyfills are loaded before anything else by leveraging a custom webpack entry injection.
interface WebpackEntry {
  app?: string | string[];
  [key: string]: any;
}

interface WebpackConfig {
  entry: (() => Promise<WebpackEntry>) | WebpackEntry;
  [key: string]: any;
}

const nextConfig: NextConfig = {
  webpack: (config: WebpackConfig) => {
    // prepend the polyfill to main entry
    const originalEntry = config.entry;
    config.entry = async (): Promise<WebpackEntry> => {
      const entries: WebpackEntry = await (typeof originalEntry === 'function' ? originalEntry() : originalEntry);
      if (entries && typeof entries === 'object' && 'app' in entries) {
        const appEntry = entries.app;
        if (Array.isArray(appEntry) && !appEntry.includes('./src/polyfills/streams.ts')) {
          entries.app = ['./src/polyfills/streams.ts', ...appEntry];
        }
      }
      return entries;
    };
    return config;
  }
};

export default nextConfig;
