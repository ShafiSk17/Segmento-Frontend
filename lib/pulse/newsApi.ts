// News API for Pulse - uses server-side routes to avoid CORS/426 errors

export interface Article {
    title: string;
    description: string;
    url: string;
    image: string;
    publishedAt: string;
    source?: string;
    author?: string;
}

export const fetchNewsByCategory = async (category: string): Promise<Article[]> => {
    try {
        // Use RSS feeds for all cloud-related categories (real-time updates from providers)
        if (category === 'cloud-computing' || category.startsWith('cloud-')) {
            const res = await fetch(`/api/pulse/rss?category=${category}`);
            if (!res.ok) {
                console.error('Failed to fetch RSS:', await res.text());
                // Fallback to NewsAPI if RSS fails
                const fallback = await fetch(`/api/pulse/news?category=${category}`);
                if (!fallback.ok) return [];
                const data = await fallback.json();
                return data.articles || [];
            }
            const data = await res.json();
            return data.articles || [];
        }

        // Use NewsAPI for other categories
        const res = await fetch(`/api/pulse/news?category=${category}`);
        if (!res.ok) {
            console.error('Failed to fetch news:', await res.text());
            return [];
        }
        const data = await res.json();
        return data.articles || [];
    } catch (error) {
        console.error('Failed to fetch API:', error);
        return [];
    }
};

export const searchNews = async (query: string): Promise<Article[]> => {
    if (!query) return [];

    try {
        const res = await fetch(`/api/pulse/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) {
            console.error('Failed to search news:', await res.text());
            return [];
        }
        const data = await res.json();
        return data.articles || [];
    } catch (error) {
        console.error('Search failed:', error);
        return [];
    }
};
