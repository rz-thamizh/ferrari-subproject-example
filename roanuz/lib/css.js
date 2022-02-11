import { useEffect, useState } from 'react';
//
// *** IMPORTANT
// *** Please repeat all the content of this file in roanuz/style/lib
//

export const BASE_FONT_SIZE = 16;

export function asRem(size) {
  return `${size / BASE_FONT_SIZE}rem`;
}

export function asEm(size) {
  return `${size / BASE_FONT_SIZE}em`;
}

export const Breakpoint = {
  xs: asEm(320),
  sm: asEm(768),
  md: asEm(992),
  lg: asEm(1194),
};

export const useMediaQuery = (query) => {
  const [mounted, setMounted] = useState(false);

  const [matches, setMatches] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const handler = (e) => setMatches(e.matches);

    if (!mounted) {
      setMounted(true);

      const mediaMatch = window.matchMedia(query);
      if (mediaMatch.addEventListener) {
        mediaMatch.addEventListener('change', handler);
      } else if (mediaMatch.addListener) {
        mediaMatch.addListener(handler);
      }
      setMatches(mediaMatch.matches);
    }
  });

  return matches;
};

export const useBreakpoint = (breakpoint) => {
  return useMediaQuery(`screen and (min-width: ${Breakpoint[breakpoint]})`);
};

export const useMediaMatchedConfig = (defaultConfig, config) => {
  const isXS = useBreakpoint('xs');
  const isSM = useBreakpoint('sm');
  const isMD = useBreakpoint('md');
  const isLG = useBreakpoint('lg');

  let resolved = {
    ...(defaultConfig || {}),
    breakpoint: 'default',
  };

  if (isXS) {
    resolved = {
      ...resolved,
      ...(config.xs || {}),
      breakpoint: 'xs',
    };
  }

  if (isSM) {
    resolved = {
      ...resolved,
      ...(config.sm || {}),
      breakpoint: 'sm',
    };
  }

  if (isMD) {
    resolved = {
      ...resolved,
      ...(config.md || {}),
      breakpoint: 'md',
    };
  }

  if (isLG) {
    resolved = {
      ...resolved,
      ...(config.lg || {}),
      breakpoint: 'lg',
    };
  }
  return resolved;
};

export const createBreakpointConfig = (defaultConfig, config) => {
  const merged = {
    default: { ...defaultConfig },
  };

  merged.xs = {
    ...merged.default,
    ...(config.xs || {}),
  };

  merged.sm = {
    ...merged.xs,
    ...(config.sm || {}),
  };

  merged.md = {
    ...merged.sm,
    ...(config.md || {}),
  };

  merged.lg = {
    ...merged.md,
    ...(config.lg || {}),
  };

  return merged;
};
