import * as cheerio from 'cheerio';

import type { GeonetworkRecord, OnlineResource } from '@/types/gnRecord';

export function parseGeocatalogHtml(content: string): GeonetworkRecord {
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

  // Map links to OnlineResource[]
  const onlineResources: OnlineResource[] = links.map(link => {
    let type: 'link' | 'download' | 'service' = 'link';
    if (downloads.find(dl => dl.href === link.href)) type = 'download';
    return {
      name: link.text,
      description: '',
      type,
      url: new URL(link.href, 'https://example.com'), // fallback base
    };
  });

  // Build GeonetworkRecord
  const record: GeonetworkRecord = {
    kind: 'dataset',
    status: '',
    lineage: null,
    recordUpdated: lastUpdated,
    recordPublished: null,
    ownerOrganization: {
      logoUrl: '',
      name: '',
      recordCount: 0,
    },
    licenses: [],
    legalConstraints: [],
    securityConstraints: [],
    otherConstraints: [],
    contacts: [],
    contactsForResource: [],
    keywords: [],
    topics: [],
    spatialExtents: [],
    temporalExtents: [],
    overviews: [],
    defaultLanguage: 'en',
    otherLanguages: [],
    updateFrequency: '',
    title: title || '',
    resourceCreated: '',
    abstract: abstract || '',
    extras: {
      isOpenData: false,
      ownerInfo: '',
      isPublishedToAll: false,
      id: '',
      favoriteCount: 0,
      catalogUuid: '',
      edit: false,
    },
    onlineResources,
    uniqueIdentifier: '',
    landingPage: '',
    recordCreated: '',
  };

  return record;
}
