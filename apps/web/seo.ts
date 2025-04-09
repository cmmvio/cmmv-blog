/**
 * @description Inject the SEO metadata into the page
 * @param {string} type - The type of the page
 * @param {any} data - The data of the page
 */
export const injectSEO = async (type: string, data: any = null) => {
    const blogAPI = useBlog();
    const settings = ref<any>(await blogAPI.getAllSettings());
    let keywords = data.keywords || settings.value['blog.keywords'];
    let description = data.description || data.excerpt;
    let metadata = [
        `<meta property="og:locale" content="${settings.value['blog.language']}" />`,
        `<meta property="og:site_name" content="${settings.value['blog.title']}" />`,
    ];

    switch(type){
        case "index":
            metadata.push(
                `<meta property="og:type" content="website" />`,
                `<meta property="og:title" content="${settings.value['blog.title']}" />`,
                `<meta property="og:description" content="${settings.value['blog.metaDescription'] || settings.value['blog.description'] || ""}" />`,
                `<meta property="og:keywords" content="${settings.value['blog.metaKeywords'] || settings.value['blog.keywords'] || ""}" />`,
                `<meta property="og:image" content="${settings.value['blog.defaultFeaturedImage']}" />`,
                `<meta property="og:url" content="${import.meta.env.VITE_WEBSITE_URL}" />`,
                `<meta property="og:image:type" content="image/webp" />`,
                `<meta property="og:image:alt" content="${settings.value['blog.title']}" />`,
                `<meta property="og:image:secure_url" content="${settings.value['blog.defaultFeaturedImage']}" />`,
                `<meta property="og:image:width" content="1440" />`,
                `<meta property="og:image:height" content="1440" />`,
                `<meta property="og:image:type" content="image/webp" />`
            )

            globalThis.__SSR_METADATA__ = {
                title: settings.value['blog.title'] + ' - ' + settings.value['blog.description'],
                description: settings.value['blog.metaDescription'] || settings.value['blog.description'] || "",
                keywords: settings.value['blog.metaKeywords'] || settings.value['blog.keywords'] || "",
                canonicalUrl: `${import.meta.env.VITE_WEBSITE_URL}`,
                analytics: settings.value['blog.analyticsCode'] || "",
                customJS: settings.value['blog.customJs'] || "",
                customCSS: settings.value['blog.customCss'] || "",
                metadata: metadata.join('\n\t\t')
            }
            break;
        case "post":
            if(!keywords && data.tags && data.tags.length > 0)
                keywords = data.tags.map((tag: any) => tag.name).join(', ').toLowerCase();

            if(!keywords)
                keywords = settings.value['blog.keywords'];

            if(!description)
                description = data.content.substring(0, 150) + '...';

            if(description.length > 150)
                description = description.substring(0, 150) + '...';

            for(let keyword of keywords.split(', ')){
                metadata.push(
                    `<meta property="article:tag" content="${keyword}" />`
                );
            }

            metadata.push(
                `<meta property="og:type" content="website" />`,
                `<meta property="og:title" content="${data.title}" />`,
                `<meta property="og:description" content="${description || ""}" />`,
                `<meta property="og:keywords" content="${keywords || ""}" />`,
                `<meta property="og:image" content="${data.featureImage || settings.value['blog.image']}" />`,
                `<meta property="og:url" content="${import.meta.env.VITE_WEBSITE_URL}" />`,
                `<meta property="og:image:type" content="image/webp" />`,
                `<meta property="og:image:alt" content="${settings.value['blog.title']}" />`,
                `<meta property="og:image:secure_url" content="${data.featureImage || settings.value['blog.image']}" />`,
                `<meta property="og:image:width" content="1200" />`,
                `<meta property="og:image:height" content="675" />`,
                `<meta property="og:image:type" content="image/webp" />`,
                `<meta property="og:updated_time" content="${new Date(data.updatedAt).toISOString()}" />`,
                `<meta property="article:published_time" content="${data.status === 'published' ? new Date(data.publishedAt).toISOString() : new Date(data.createdAt).toISOString()}" />`,
                `<meta property="article:modified_time" content="${new Date(data.updatedAt).toISOString()}" />`,
                `<meta name="twitter:card" content="summary_large_image" />`,
                `<meta name="twitter:title" content="${data.title}" />`,
                `<meta name="twitter:description" content="${description || ""}" />`,
                `<meta name="twitter:image" content="${data.featureImage || settings.value['blog.image']}" />`,
                `<meta name="twitter:url" content="${import.meta.env.VITE_WEBSITE_URL}/post/${data.slug}" />`,
                `<meta name="twitter:label1" content="Written by" />`,
                `<meta name="twitter:data1" content="${data.author.name || settings.value['blog.author']}" />`,
                `<meta name="twitter:label2" content="Published" />`,
                `<meta name="twitter:data2" content="${new Date(data.publishedAt).toISOString()}" />`,
                `<script type="application/ld+json">${JSON.stringify(createLdJSON('post', data, settings))}</script>`,
                `<link rel="alternate" type="application/rss+xml" title="Feed para ${settings.value['blog.title']} &raquo;" href="${import.meta.env.VITE_WEBSITE_URL}/feed" />`,
                `<link rel="alternate" type="application/rss+xml" title="Feed de comentários para ${settings.value['blog.title']} &raquo;" href="${import.meta.env.VITE_WEBSITE_URL}/comments/feed" />`,
                `<link rel="alternate" type="application/rss+xml" title="Feed de comentários para ${settings.value['blog.title']} &raquo; ${data.title} " href="${import.meta.env.VITE_WEBSITE_URL}/post/${data.slug}/feed" />`
            );

            globalThis.__SSR_METADATA__ = {
                title: data.title + ' - ' + settings.value['blog.title'],
                description,
                keywords,
                image: data.featureImage || settings.value['blog.image'],
                canonicalUrl: `${import.meta.env.VITE_WEBSITE_URL}/post/${data.slug}`,
                author: data.author.name || settings.value['blog.author'],
                date: data.status === 'published' ?
                    new Date(data.publishedAt).toISOString() :
                    new Date(data.updatedAt).toISOString(),
                analytics: settings.value['blog.analyticsCode'] || "",
                customJS: settings.value['blog.customJs'] || "",
                customCSS: settings.value['blog.customCss'] || "",
                metadata: metadata.join('\n\t\t')
            }
            break;
        case "page":
            if(!keywords)
                keywords = settings.value['blog.keywords'];

            if(!description)
                description = data.content.substring(0, 150) + '...';

            if(description.length > 150)
                description = description.substring(0, 150) + '...';

            metadata.push(
                `<meta property="og:type" content="website" />`,
                `<meta property="og:title" content="${data.title}" />`,
                `<meta property="og:description" content="${description || ""}" />`,
                `<meta property="og:keywords" content="${keywords || ""}" />`,
                `<meta property="og:image" content="${data.featureImage || settings.value['blog.image']}" />`,
                `<meta property="og:url" content="${import.meta.env.VITE_WEBSITE_URL}" />`,
                `<meta property="og:image:type" content="image/webp" />`,
                `<meta property="og:image:alt" content="${settings.value['blog.title']}" />`,
                `<meta property="og:image:secure_url" content="${data.featureImage || settings.value['blog.image']}" />`,
                `<meta property="og:image:width" content="1200" />`,
                `<meta property="og:image:height" content="675" />`,
                `<meta property="og:image:type" content="image/webp" />`
            )

            globalThis.__SSR_METADATA__ = {
                title: data.title + ' - ' + settings.value['blog.title'],
                description,
                keywords,
                image: data.featureImage || settings.value['blog.image'],
                canonicalUrl: `${import.meta.env.VITE_WEBSITE_URL}/page/${data.slug}`,
                author: data.author.name || settings.value['blog.author'],
                date: data.status === 'published' ?
                    new Date(data.publishedAt).toISOString() :
                    new Date(data.updatedAt).toISOString(),
                analytics: settings.value['blog.analyticsCode'] || "",
                customJS: settings.value['blog.customJs'] || "",
                customCSS: settings.value['blog.customCss'] || "",
                metadata: metadata.join('\n\t\t')
            }
        break;
        case "category":
            globalThis.__SSR_METADATA__ = {
                title: data.category.name + ' - ' + settings.value['blog.description'],
                description: data.category.description || settings.value['blog.description'],
                canonicalUrl: `${import.meta.env.VITE_WEBSITE_URL}/category/${data.category.slug}`,
                analytics: settings.value['blog.analyticsCode'] || "",
                customJS: settings.value['blog.customJs'] || "",
                customCSS: settings.value['blog.customCss'] || "",
                metadata: metadata.join('\n\t\t')
            }
            break;
        case "tag":
            break;
        case "author":
            globalThis.__SSR_METADATA__ = {
                title: data.author.name,
                description: data.author.bio || settings.value['blog.description'],
                canonicalUrl: `${import.meta.env.VITE_WEBSITE_URL}/author/${data.author.slug}`,
                analytics: settings.value['blog.analyticsCode'] || "",
                customJS: settings.value['blog.customJs'] || "",
                customCSS: settings.value['blog.customCss'] || "",
                metadata: metadata.join('\n\t\t')
            }
            break;
        case "settings":
            break;
    }
};
