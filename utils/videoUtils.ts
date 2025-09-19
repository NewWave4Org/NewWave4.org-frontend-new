export function convertYoutubeUrlToEmbed(url: string): string | null {
    try {
        const parsedUrl = new URL(url);

        if (
            parsedUrl.hostname.includes('youtube.com') &&
            parsedUrl.pathname.startsWith('/embed/')
        ) {
            return url;
        }

        if (parsedUrl.hostname.includes('youtube.com')) {
            const videoId = parsedUrl.searchParams.get('v');
            if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        }

        if (parsedUrl.hostname === 'youtu.be') {
            const videoId = parsedUrl.pathname.slice(1);
            if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        }

        return null;
    } catch {
        return null;
    }
}
