import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

// Cloud provider RSS feed URLs
const cloudProviderFeeds = {
    aws: 'https://aws.amazon.com/blogs/aws/feed/',
    azure: 'https://azure.microsoft.com/en-us/blog/feed/',
    gcp: 'https://cloudblog.withgoogle.com/rss/',
    ibm: 'https://www.ibm.com/blogs/cloud-computing/feed/',
    oracle: 'https://blogs.oracle.com/cloud-infrastructure/rss',
    digitalocean: 'https://www.digitalocean.com/blog/rss.xml',
};

interface Article {
    title: string;
    description: string;
    url: string;
    image: string;
    publishedAt: string;
    source: string;
    author: string;
}

async function parseRSSFeed(url: string, source: string): Promise<Article[]> {
    try {
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const feed = await parser.parseURL(url);
        clearTimeout(timeoutId);

        return feed.items.slice(0, 20).map((item) => ({
            title: item.title || 'No title',
            description: item.contentSnippet || item.content?.substring(0, 200) || item.summary || '',
            url: item.link || '',
            image: item.enclosure?.url ||
                (item.content?.match(/src="([^"]+)"/)?.[1]) ||
                (item['media:thumbnail']?.$ as any)?.url ||
                'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop',
            publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
            source: source,
            author: item.creator || item.author || source,
        }));
    } catch (error) {
        console.error(`Failed to parse RSS feed from ${source}:`, error);
        // Return empty array instead of throwing - allows other feeds to work
        return [];
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    if (!category) {
        return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    // Map of cloud provider categories to their RSS feed keys
    const providerMap: Record<string, string[]> = {
        'cloud-computing': ['aws', 'azure', 'gcp', 'ibm', 'oracle', 'digitalocean'], // All providers
        'cloud-aws': ['aws'],
        'cloud-gcp': ['gcp'],
        'cloud-azure': ['azure'],
        'cloud-ibm': ['ibm'],
        'cloud-oracle': ['oracle'],
        'cloud-digitalocean': ['digitalocean'],
    };

    const providers = providerMap[category];

    // Only use RSS for cloud-related categories
    if (!providers) {
        return NextResponse.json({ error: 'RSS only available for cloud categories' }, { status: 400 });
    }

    try {
        // Fetch selected cloud provider feeds in parallel
        const feedPromises = providers.map(provider =>
            parseRSSFeed(cloudProviderFeeds[provider as keyof typeof cloudProviderFeeds], provider.toUpperCase())
        );

        const feedResults = await Promise.all(feedPromises);

        // Flatten and combine all articles
        const allArticles = feedResults.flat();

        // Sort by publish date (newest first)
        allArticles.sort((a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );

        return NextResponse.json({
            articles: allArticles,
            count: allArticles.length,
            sources: providers
        });
    } catch (error) {
        console.error('RSS aggregation error:', error);
        return NextResponse.json({
            error: 'Failed to fetch RSS feeds',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
