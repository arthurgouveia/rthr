// Fetches a Google Fonts file for the OG image at build time, subset to just the text it draws
// (a few hundred bytes instead of a whole family). The image renderer reads TTF, not WOFF2, and
// Google serves TTF when no browser User-Agent is sent.
export async function loadGoogleFont(family: string, text: string): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}&text=${encodeURIComponent(text)}`,
  ).then((r) => r.text());
  const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error(`no font file found for ${family}`);
  return fetch(url).then((r) => r.arrayBuffer());
}
