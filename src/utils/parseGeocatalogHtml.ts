import * as cheerio from 'cheerio';

export function parseGeocatalogHtml(content: string) {
  const $ = cheerio.load(content);

  // Extract title
  const title = $('.legend-header .bod-title span').text().trim();

  // Extract abstract
  const abstract = $('.legend-header .legend-abstract').text().trim();

  // Extract links from the legend-footer table
  const links: { text: string; href: string }[] = [];
  $('.legend-footer a').each((_, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr('href') || '';
    links.push({ text, href });
  });

  // Extract data status (last updated)
  let lastUpdated = '';
  $('.legend-footer table tr').each((_, el) => {
    const tds = $(el).find('td');
    if (tds.length === 2 && $(tds[0]).text().toLowerCase().includes('data status')) {
      lastUpdated = $(tds[1]).text().trim();
    }
  });

  // Extract downloads from links (if text or href suggests download)
  const downloads = links.filter(link => {
    const text = link.text.toLowerCase();
    const href = link.href.toLowerCase();
    return text.includes('download') || href.includes('download') || href.includes('publicdata');
  });

  return { title, abstract, links, lastUpdated, downloads };
}
