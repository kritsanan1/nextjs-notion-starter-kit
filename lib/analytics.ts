import { useEffect } from 'react'

interface AnalyticsConfig {
  googleAnalytics?: string
  posthog?: string
  fathom?: string
  plausible?: string
}

export const initAnalytics = (config: AnalyticsConfig) => {
  // Google Analytics 4
  if (config.googleAnalytics \u0026\u0026 typeof window !== 'undefined') {
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.googleAnalytics}`
    script.async = true
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    function gtag() {
      // @ts-ignore
      window.dataLayer.push(arguments)
    }
    // @ts-ignore
    gtag('js', new Date())
    // @ts-ignore
    gtag('config', config.googleAnalytics)
  }

  // PostHog Analytics
  if (config.posthog \u0026\u0026 typeof window !== 'undefined') {
    const script = document.createElement('script')
    script.innerHTML = `
      !function(t,e){var o,n,p,s;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,t,a){function g(e,t){var a=t.split(".");2==a.length\u0026\u0026(e=e[a[0]],t=a[1]),e[t]=function(){e.push([t].concat(Array.prototype.slice.call(arguments,0)))}}(p=e.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(s=e.getElementsByTagName("script")[0]).parentNode.insertBefore(p,s);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a\u0026\u0026(e+="."+a),t||(e+=" [stub]"),e},u.people.toString=function(){return u.toString(1)+".people [stub]"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags".split(" "),n=0;n\u003co.length;n++)g(u,o[n]);e._i.push([i,t,a])},e.__SV=1)}(document,window.posthog||[]);
      posthog.init(\u0027${config.posthog}\u0027,{api_host:\u0027https://app.posthog.com\u0027})
    `
    document.head.appendChild(script)
  }

  // Fathom Analytics
  if (config.fathom \u0026\u0026 typeof window !== 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://cdn.usefathom.com/script.js'
    script.setAttribute('data-site', config.fathom)
    script.defer = true
    document.head.appendChild(script)
  }

  // Plausible Analytics
  if (config.plausible \u0026\u0026 typeof window !== 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://plausible.io/js/script.js'
    script.setAttribute('data-domain', window.location.hostname)
    script.defer = true
    document.head.appendChild(script)
  }
}

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', eventName, properties)
    }

    // PostHog
    if (window.posthog) {
      window.posthog.capture(eventName, properties)
    }

    // Fathom
    if (window.fathom) {
      window.fathom.trackEvent(eventName, properties)
    }
  }
}

// TypeScript declarations for global variables
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
    posthog: any
    fathom: any
  }
}