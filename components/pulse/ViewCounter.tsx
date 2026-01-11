'use client';

import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { getArticleViewCount, incrementArticleView } from '@/lib/pulse/analytics';

interface ViewCounterProps {
    articleUrl: string;
    className?: string;
}

export default function ViewCounter({ articleUrl, className = '' }: ViewCounterProps) {
    const [viewCount, setViewCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch initial view count
        getArticleViewCount(articleUrl).then((count) => {
            setViewCount(count);
            setLoading(false);
        });
    }, [articleUrl]);

    const handleClick = async (e: React.MouseEvent) => {
        // Increment view count when article is clicked
        await incrementArticleView(articleUrl);
    };

    if (loading) {
        return (
            <div className={`flex items-center gap-1 text-xs text-gray-400 ${className}`}>
                <Eye className="w-3 h-3" />
                <span>...</span>
            </div>
        );
    }

    return (
        <div
            className={`flex items-center gap-1 text-xs text-gray-500 ${className}`}
            onClick={handleClick}
        >
            <Eye className="w-3 h-3" />
            <span>{viewCount.toLocaleString()}</span>
        </div>
    );
}
