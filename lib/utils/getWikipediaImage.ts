const imageCache: Record<string, string> = {};

export async function getWikipediaImage(title: string): Promise<string | undefined> {
  if (imageCache[title]) return imageCache[title];
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=500&origin=*`;
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    const pages = data?.query?.pages;
    const page = pages && Object.values(pages)[0];
    const img = page?.thumbnail?.source;
    if (img) imageCache[title] = img;
    return img;
  } catch {
    return undefined;
  }
}
