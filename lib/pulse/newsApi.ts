// News API for Pulse - uses News API and Crypto API
// Environment variables: NEXT_PUBLIC_NEWS_API_KEY and NEXT_PUBLIC_CRYPTO_API_KEY

const API_KEY_NEWS = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const API_KEY_CRYPTO = process.env.NEXT_PUBLIC_CRYPTO_API_KEY;

export interface Article {
    title: string;
    description: string;
    url: string;
    image: string;
    publishedAt: string;
    source?: string;
    author?: string;
}

// Map categories to URLs
const NEWS_CATEGORIES: Record<string, string[]> = {
    ai: [
        `https://newsapi.org/v2/everything?q=artificial+intelligence&sortBy=publishedAt&apiKey=${API_KEY_NEWS}`,
    ],
    "data-security": [
        `https://newsapi.org/v2/everything?q=data+science&sortBy=publishedAt&apiKey=${API_KEY_NEWS}`,
    ],
    "cyber-security": [
        `https://newsapi.org/v2/everything?q=cybersecurity&sortBy=publishedAt&apiKey=${API_KEY_NEWS}`,
    ],
    blockchain: [
        `https://newsapi.org/v2/everything?q=blockchain&sortBy=publishedAt&apiKey=${API_KEY_NEWS}`,
    ],
    "cloud-computing": [
        `https://newsapi.org/v2/everything?q=cloud+computing&sortBy=publishedAt&apiKey=${API_KEY_NEWS}`,
    ],
    magazines: [
        `https://newsapi.org/v2/everything?q=technology+magazine&sortBy=publishedAt&apiKey=${API_KEY_NEWS}`,
    ],
};

export const fetchNewsByCategory = async (category: string): Promise<Article[]> => {
    const urls = NEWS_CATEGORIES[category];
    if (!urls) return [];

    let allArticles: Article[] = [];

    for (const url of urls) {
        try {
            const res = await fetch(url, { cache: 'no-store' });
            const data = await res.json();

            // Normalize response
            const rawArticles = data.articles || data.news || data.data || [];

            const normalized: Article[] = rawArticles.map((article: any) => ({
                title: article.title || "No title",
                description: article.description || "",
                url: article.url,
                image:
                    article.urlToImage ||
                    article.image ||
                    article.image_url ||
                    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop",
                publishedAt:
                    article.publishedAt ||
                    article.published_at ||
                    article.date ||
                    new Date().toISOString(),
                source: article.source?.name || article.source || "",
                author: article.author || "",
            }));

            allArticles = allArticles.concat(normalized);
        } catch (error) {
            console.error("Failed to fetch API:", url, error);
        }
    }

    // Sort latest first
    return allArticles.sort(
        (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
    );
};

export const searchNews = async (query: string): Promise<Article[]> => {
    if (!API_KEY_NEWS || !query) return [];

    try {
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=${API_KEY_NEWS}`;
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();

        const rawArticles = data.articles || [];

        return rawArticles.map((article: any) => ({
            title: article.title || "No title",
            description: article.description || "",
            url: article.url,
            image: article.urlToImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop",
            publishedAt: article.publishedAt || new Date().toISOString(),
            source: article.source?.name || "",
            author: article.author || "",
        }));
    } catch (error) {
        console.error("Search failed:", error);
        return [];
    }
};
