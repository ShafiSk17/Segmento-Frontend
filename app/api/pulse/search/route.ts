import { NextRequest, NextResponse } from 'next/server';

const API_KEY_NEWS = process.env.NEXT_PUBLIC_NEWS_API_KEY;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    if (!API_KEY_NEWS) {
        return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=${API_KEY_NEWS}`;

    try {
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: data.message || 'Failed to search news' }, { status: res.status });
        }

        const rawArticles = data.articles || [];
        const normalized = rawArticles.map((article: any) => ({
            title: article.title || "No title",
            description: article.description || "",
            url: article.url,
            image: article.urlToImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop",
            publishedAt: article.publishedAt || new Date().toISOString(),
            source: article.source?.name || "",
            author: article.author || "",
        }));

        return NextResponse.json({ articles: normalized });
    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json({ error: 'Failed to search news' }, { status: 500 });
    }
}
