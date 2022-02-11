export const SimpleCookie = (givenDoc) => {
  let doc = {};
  if (givenDoc) {
    doc = givenDoc;
  } else if (typeof document !== 'undefined') {
    doc = document;
  }

  if (typeof doc === 'string') doc = { cookie: doc };
  if (doc.cookie === undefined) doc.cookie = '';

  const get = (key) => {
    const splat = doc.cookie.split(/;\s*/);
    for (let i = 0; i < splat.length; i += 1) {
      const ps = splat[i].split('=');
      const k = unescape(ps[0]);
      if (k === key) return unescape(ps[1]);
    }
    return undefined;
  };

  const set = (key, value, options) => {
    const opts = options || {};
    let s = `${escape(key)}=${escape(value)}`;
    if (opts.expires) s += `; expires=${opts.expires}`;
    if (opts.path) s += `; path=${escape(opts.path)}`;
    if (opts.domain) s += `; domain=${escape(opts.domain)}`;
    if (opts.secure) s += '; secure';
    if (opts.sameSite) s += `; SameSite=${escape(opts.sameSite)}`;
    doc.cookie = s;
    return s;
  };
  return { get, set };
};

export const CookieManager = SimpleCookie();
