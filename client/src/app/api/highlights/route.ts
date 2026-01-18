import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export const revalidate = 120; // Revalidate every 2 minutes

interface Headline {
  title: string;
  url: string;
  publishedAt: string;
  source: string;
}

const FEEDS = [
  { url: "https://feeds.bbci.co.uk/news/rss.xml", source: "BBC News" },
  { url: "https://www.ycombinator.com/blog/rss", source: "Y Combinator" },
  { url: "https://hnrss.org/frontpage", source: "Hacker News" },
  { url: "https://cointelegraph.com/rss", source: "CoinTelegraph" }
];

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  }
});

export async function GET() {
  try {
    const feedPromises = FEEDS.map(async (feed) => {
      try {
        const data = await parser.parseURL(feed.url);
        return data.items.map((item) => ({
          title: item.title || "No Title",
          url: item.link || "#",
          publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
          source: feed.source,
        }));
      } catch (err) {
        console.error(`Failed to fetch feed ${feed.source}:`, err);
        return [];
      }
    });

    const results = await Promise.all(feedPromises);
    
    // Flatten, Deduplicate, Sort
    const allHeadlines: Headline[] = results.flat();
    
    // Dedupe by URL
    const seenUrls = new Set();
    const uniqueHeadlines = allHeadlines.filter(item => {
      if (seenUrls.has(item.url)) return false;
      seenUrls.add(item.url);
      return true;
    });

    // Sort by date (newest first)
    uniqueHeadlines.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    // Limit to top 20 to keep payload small
    const topHeadlines = uniqueHeadlines.slice(0, 20);

    return NextResponse.json(topHeadlines);
  } catch (error) {
    console.error("Global API Error:", error);
    return NextResponse.json({ error: "Failed to fetch highlights" }, { status: 500 });
  }
}
