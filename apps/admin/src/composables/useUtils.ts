export const useUtils = () => {
    /**
     * Converts a string to a URL-friendly slug
     * - Converts accented characters to their non-accented versions
     * - Converts spaces to hyphens
     * - Removes special characters
     * - Handles ampersands and other special cases
     * - Ensures no consecutive hyphens
     * - Trims hyphens from start and end
     * - Limits to 120 characters maximum
     *
     * @param text The string to convert to a slug
     * @returns A URL-friendly slug limited to 120 characters
     */
    const slugify = (text: string): string => {
        if (!text) return '';

        const slug = text
            .toString()
            .toLowerCase()
            .normalize('NFD')                // Normalize to decomposed form (separate letters from diacritics)
            .replace(/[\u0300-\u036f]/g, '') // Remove all diacritical marks
            .trim()
            .replace(/\s+/g, '-')            // Replace spaces with -
            .replace(/&/g, '-and-')          // Replace & with 'and'
            .replace(/[^\w\-]+/g, '')        // Remove all non-word characters except hyphens
            .replace(/\-\-+/g, '-')          // Replace multiple - with single -
            .replace(/^-+/, '')              // Trim - from start of text
            .replace(/-+$/, '');             // Trim - from end of text

        // Limit to 120 characters and ensure no trailing hyphens after truncation
        return slug.substring(0, 120).replace(/-+$/, '');
    }

    return {
        slugify
    }
}
