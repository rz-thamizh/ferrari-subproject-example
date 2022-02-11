export const Utils = {
  mergePaths(items) {
    const skipPrefix = items[0].startsWith('http') || items[0].startsWith('/');
    let parts = skipPrefix ? [] : ['/'];
    let endedWithSlash = false;

    items.forEach((item) => {
      let part = item;

      if (part.startsWith('/')) {
        part = part.split('').splice(1).join('');
      }

      if (part.endsWith('/')) {
        endedWithSlash = true;
        part = part.split('').slice(0, -1).join('');
      } else {
        endedWithSlash = false;
      }

      parts.push(part);
    });

    if (endedWithSlash) {
      parts.push('/');
    }

    parts = parts.filter((x) => x.length > 0);
    return parts.join('/');
  },
};
