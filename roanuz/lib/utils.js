import { useEffect, useState } from 'react';
import Config from '@/config';

export function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

export function useDelayedState(initValue, delay = 500, { instantFalse = true } = {}) {
  const [timerId, setTimerId] = useState(null);
  const [requestedState, setRequestedState] = useState(initValue);
  const [state, setState] = useState(initValue);

  const updateState = (newValue) => {
    if (requestedState !== newValue) {
      setRequestedState(newValue);
    }
  };

  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
    }

    if (requestedState === state) return;
    if (instantFalse && requestedState === false) {
      setState(requestedState);
    } else {
      const newTimerId = setTimeout(() => {
        setState(requestedState);
      }, delay);
      setTimerId(newTimerId);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedState, delay]);

  return [state, updateState, requestedState];
}

export function translate(defaultValue, label) {
  const key = label || defaultValue;
  const newValue = Config.translation[key];
  if (newValue !== undefined) {
    return newValue;
  }

  return defaultValue;
}

export function fixMediaUrl(url) {
  if (
    Config.ReplaceMediaUrl
    && Config.ReplaceMediaUrl.length === 2
    && url && url.startsWith(Config.ReplaceMediaUrl[0])
  ) {
    let newUrl = url.substring(Config.ReplaceMediaUrl[0].length);
    newUrl = `${Config.ReplaceMediaUrl[1]}${newUrl}`;
    return newUrl;
  }

  return url;
}
