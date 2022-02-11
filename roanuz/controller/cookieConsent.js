import React, { useContext } from 'react';
import Config from '@/config';
import { onClient } from '@/roanuz/clientSide';
import { ClientCookieConsent } from '@/roanuz/view/cookieConsent';
import { UserContext, CookieConsentState } from '@/store/core/context';
import { useDelayedState } from '@/roanuz/lib/utils';
import { withDependencySupport } from '@/roanuz/lib/dep';

export const BaseCookieConsentController = () => {
  const learnMoreLink = Config.CookieConsentLink;
  const {
    cookieConsent,
    cookieConsentInit,
    cookieConsentSetLoaded,
    cookieConsentAcceptAll,
    cookieConsentDenyAll,
  } = useContext(UserContext);
  const [showState, setShowState] = useDelayedState(false, 1000);
  if (!cookieConsent.loaded) {
    const prevStateRaw = window.localStorage.getItem('rzCC');
    if (prevStateRaw) {
      const newContext = JSON.parse(prevStateRaw);
      newContext.loaded = true;
      cookieConsentInit(newContext);
    } else {
      cookieConsentSetLoaded();
    }
  }

  let show = cookieConsent.state === CookieConsentState.UNKNOWN;
  const now = new Date().getTime();

  show = show || (
    cookieConsent.state === CookieConsentState.DENY_ALL
    && cookieConsent.expires < now
  );

  show = show || cookieConsent.version !== Config.CookieConsentVersion;
  setShowState(show);

  return (
    <ClientCookieConsent
      learnMoreLink={learnMoreLink}
      show={showState}
      onAcceptAll={cookieConsentAcceptAll}
      onDenyAll={cookieConsentDenyAll}
    />
  );
};

BaseCookieConsentController.propTypes = {
};

export const ClientCookieConsentController = onClient(BaseCookieConsentController);
export const CookieConsentController = withDependencySupport(ClientCookieConsentController, 'CookieConsentController');
