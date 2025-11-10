import path from 'node:path'
import { fileURLToPath } from 'node:url'

import bundleAnalyzer from '@next/bundle-analyzer'
import withPWA from 'next-pwa'

const withBundleAnalyzer = bundleAnalyzer({
  // eslint-disable-next-line no-process-env
  enabled: process.env.ANALYZE === 'true'
})

const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  sw: 'service-worker.js',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
        }
      }
    },
    {
      urlPattern: /^https:\/\/www\.notion\.so\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'notion-api',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60 // 5 minutes
        }
      }
    }
  ]
}

export default withBundleAnalyzer(
  withPWA(pwaConfig)({
    staticPageGenerationTimeout: 300,
    images: {
      remotePatterns: [
        { protocol: 'https', hostname: 'www.notion.so' },
        { protocol: 'https', hostname: 'notion.so' },
        { protocol: 'https', hostname: 'images.unsplash.com' },
        { protocol: 'https', hostname: 'abs.twimg.com' },
        { protocol: 'https', hostname: 'pbs.twimg.com' },
        { protocol: 'https', hostname: 's3.us-west-2.amazonaws.com' },
        // Additional domains for better image support
        { protocol: 'https', hostname: 'i.imgur.com' },
        { protocol: 'https', hostname: 'cdn.discordapp.com' },
        { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
        { protocol: 'https', hostname: 'github.com' },
        { protocol: 'https', hostname: 'user-images.githubusercontent.com' }
      ],
      formats: ['image/avif', 'image/webp'],
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
    },

    webpack: (config) => {
      // Workaround for ensuring that `react` and `react-dom` resolve correctly
      // when using a locally-linked version of `react-notion-x`.
      // @see https://github.com/vercel/next.js/issues/50391
      const dirname = path.dirname(fileURLToPath(import.meta.url))
      config.resolve.alias.react = path.resolve(dirname, 'node_modules/react')
      config.resolve.alias['react-dom'] = path.resolve(
        dirname,
        'node_modules/react-dom'
      )
      return config
    },

    // See https://react-tweet.vercel.app/next#troubleshooting
    transpilePackages: ['react-tweet']
  })
)
