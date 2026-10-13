// Client-only helpers: read at event time or in effects, never during render.

export const cssMs = (name: string) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = parseFloat(v);
  return Number.isNaN(n) ? 0 : v.endsWith('ms') ? n : n * 1000;
};

// ?static=1 (the boot script adds html.static) turns animations off, for screenshots and previews.
export const isStatic = () => document.documentElement.classList.contains('static');
