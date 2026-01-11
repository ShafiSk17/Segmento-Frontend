import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment,
    onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'pulse_article_views';

export interface ArticleViewData {
    url: string;
    viewCount: number;
    lastUpdated: Date;
}

/**
 * Increment view count for an article
 */
export async function incrementArticleView(articleUrl: string): Promise<void> {
    try {
        // Use article URL as document ID (sanitized)
        const docId = btoa(articleUrl).replace(/[^a-zA-Z0-9]/g, '');
        const docRef = doc(db, COLLECTION_NAME, docId);

        // Check if document exists
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Increment existing count
            await updateDoc(docRef, {
                viewCount: increment(1),
                lastUpdated: new Date(),
            });
        } else {
            // Create new document
            await setDoc(docRef, {
                url: articleUrl,
                viewCount: 1,
                lastUpdated: new Date(),
            });
        }
    } catch (error) {
        console.error('Failed to increment view count:', error);
    }
}

/**
 * Get current view count for an article
 */
export async function getArticleViewCount(articleUrl: string): Promise<number> {
    try {
        const docId = btoa(articleUrl).replace(/[^a-zA-Z0-9]/g, '');
        const docRef = doc(db, COLLECTION_NAME, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().viewCount || 0;
        }
        return 0;
    } catch (error) {
        console.error('Failed to get view count:', error);
        return 0;
    }
}

/**
 * Subscribe to real-time view count updates
 */
export function subscribeToViewCount(
    articleUrl: string,
    callback: (count: number) => void
): () => void {
    const docId = btoa(articleUrl).replace(/[^a-zA-Z0-9]/g, '');
    const docRef = doc(db, COLLECTION_NAME, docId);

    const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data().viewCount || 0);
        } else {
            callback(0);
        }
    });

    return unsubscribe;
}

/**
 * Track article views in batch (for homepage category boxes)
 */
export async function trackMultipleArticleViews(articleUrls: string[]): Promise<void> {
    const promises = articleUrls.map(url => incrementArticleView(url));
    await Promise.all(promises);
}
