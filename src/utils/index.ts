export function createPageUrl(pageName: string) {
    if (pageName.startsWith('/')) return pageName;
    // Strict lowercase to match pages.config.js keys
    return '/' + pageName.replace(/ /g, '').toLowerCase(); // Removing spaces to match "SavedPosts" -> "savedposts"
}