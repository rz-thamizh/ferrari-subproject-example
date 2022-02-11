import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { UserContext, CookieConsentState } from '@/store/core/context';
import Config from '@/config';

export const AnalyticsController = () => {
  const [mounted, setMounted] = useState(false);
  const [loggingEnabled, setLoggingEnabled] = useState(false);
  const [init, setInit] = useState(false);
  const userContext = useContext(UserContext);
  const { cookieConsent } = userContext;
  const router = useRouter();

  const pushDataLayer = (payload) => {
    // eslint-disable-next-line no-unused-expressions
    window && window.dataLayer && window.dataLayer.push(payload);
  };

  const gtmPushOptions = (...opts) => {
    // eslint-disable-next-line no-unused-expressions
    window && window.gtag && window.gtag(...opts);
  };

  const logGTM = (url) => {
    const payload = {
      event: 'pageview',
      page: url,
    };
    pushDataLayer(payload);
  };

  const onPageLoaded = () => {
    const shouldLog = loggingEnabled || (cookieConsent.state === CookieConsentState.ACCEPT_ALL);
    if (shouldLog) {
      const url = `${window.location.href}`;
      console.log('👓 ✅ Page is logged', url);
      if (Config.GTM) {
        logGTM(url);
      }
    } else {
      console.log('👓 ❌ Page logging disabled', userContext.cookieConsent.state);
    }
  };

  const enableLoggingIfRequired = () => {
    if ((!loggingEnabled) && cookieConsent.state === CookieConsentState.ACCEPT_ALL) {
      setLoggingEnabled(true);
    }
  };

  const initAnalytics = () => {
    console.log('👓 Init Analytics');
    if (Config.GTM) {
      gtmPushOptions(
        'consent', 'update', {
          ad_storage: 'granted',
          analytics_storage: 'granted',
        },
      );
      // pushDataLayer({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    }
    onPageLoaded();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setMounted(true);
  });

  useEffect(() => {
    enableLoggingIfRequired();
  }, [userContext.cookieConsent]);

  useEffect(() => {
    if (!mounted) return;

    if ((!init) && cookieConsent.state === CookieConsentState.ACCEPT_ALL) {
      setInit(true);
      initAnalytics();
    }
  }, [cookieConsent.state, mounted]);

  useEffect(() => {
    const handle = () => {
      onPageLoaded();
    };

    router.events.on('routeChangeComplete', handle);
    return () => {
      router.events.off('routeChangeComplete', handle);
    };
  });

  return (
    <>
      {Config.GTM && (
        <>
          <Head>
            <script
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html:
                `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  var prevStateRaw = window.localStorage.getItem('rzCC');
  var cookieConsentAllow = false;
  if (prevStateRaw) {
    const newContext = JSON.parse(prevStateRaw);
    cookieConsentAllow = newContext.state === 'ACCEPT_ALL'
  }
  if (!cookieConsentAllow) {
    gtag('consent', 'default', {
      'ad_storage': 'denied',
      'analytics_storage': 'denied',
    });
    dataLayer.push({
      'event': 'default_consent'
    });
  }
  `,
              }}
              key="gtm-init"
            />
            <script
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html:
                `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${Config.GTM}');`,
              }}
              key="gtm-script"
            />
          </Head>
          <noscript>
            <iframe
              title="gtm"
              src={`https://www.googletagmanager.com/ns.html?id=${Config.GTM}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}
    </>
  );
};
