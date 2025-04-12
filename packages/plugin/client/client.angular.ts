//@ts-nocheck

/**
 * Check if Angular is installed
 */
let Angular;
let HttpClient;

let Injectable = () => {};
let BehaviorSubject;
let Observable;
let from;
let of;
let map;
let catchError;
let tap;

try {
  Angular = require('@angular/core');
  HttpClient = require('@angular/common/http');
  Injectable = Angular.Injectable;
  BehaviorSubject = require('rxjs').BehaviorSubject;
  Observable = require('rxjs').Observable;
  from = require('rxjs').from;
  of = require('rxjs').of;
  map = require('rxjs').map;
  catchError = require('rxjs').catchError;
} catch (e) {}

/**
 * @description Get the environment variable
 * @param {string} key - The key of the environment variable
 * @returns {string | undefined} The environment variable
 */
export const getEnv = (key: string): string | undefined => {
    if (typeof process !== 'undefined' && process.env) {
        return process.env[key];
    }
    return undefined;
};

/**
 * @description API Service for making HTTP requests
 */
@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = getEnv('VITE_API_URL') || 'http://localhost:5000';
    private baseUrlFrontend = getEnv('VITE_API_URL_FRONT') || 'http://localhost:5000';
    private isSSR = typeof window === 'undefined';

    constructor(private http: HttpClient.HttpClient) {}

    get<T>(path: string, key?: string): Observable<T> {
        return this.http.get<any>(`${this.baseUrlFrontend}/${path}`).pipe(
            map(response => response?.result || response),
            catchError(error => {
                console.error(`Error fetching ${path}:`, error);
                return of(null);
            })
        );
    }

    post<T>(path: string, payload: any, key?: string): Observable<T> {
        return this.http.post<any>(`${this.baseUrl}/api/${path}`, payload).pipe(
            map(response => response?.result || response),
            catchError(error => {
                console.error(`Error posting to ${path}:`, error);
                return of(null);
            })
        );
    }

    put<T>(path: string, payload: any, key?: string): Observable<T> {
        return this.http.put<any>(`${this.baseUrl}/api/${path}`, payload).pipe(
            map(response => response?.result || response),
            catchError(error => {
                console.error(`Error updating ${path}:`, error);
                return of(null);
            })
        );
    }
}

/**
 * @description Blog Service for interacting with the blog API
 */
@Injectable({
    providedIn: 'root'
})
export class BlogService {
    private categoriesSubject = new BehaviorSubject<any[]>([]);
    private tagsSubject = new BehaviorSubject<any[]>([]);
    private settingsSubject = new BehaviorSubject<any[]>([]);

    // Public observables
    categoriesData$ = this.categoriesSubject.asObservable();
    tagsData$ = this.tagsSubject.asObservable();
    settingsData$ = this.settingsSubject.asObservable();

    constructor(private api: ApiService) {}

    // Categories
    getAllCategories(): Observable<any[]> {
        return this.api.get<any[]>('blog/categories').pipe(
            tap(data => {
                if (data) {
                    this.categoriesSubject.next(data);
                }
            })
        );
    }

    getCategoryById(id: string): Observable<any> {
        return this.api.get<any>(`blog/categories/${id}`);
    }

    getCategoryBySlug(slug: string): Observable<any> {
        return this.api.get<any>(`blog/categories/slug/${slug}`);
    }

    // Tags
    getAllTags(): Observable<any[]> {
        return this.api.get<any[]>('blog/posts/tags').pipe(
            tap(data => {
                if (data) {
                    this.tagsSubject.next(data);
                }
            })
        );
    }

    getPostsByTagSlug(tagSlug: string): Observable<any[]> {
        return this.api.get<any[]>(`/blog/posts/tags/${tagSlug}`);
    }

    // Settings
    getAllSettings(): Observable<any[]> {
        return this.api.get<any[]>('settings').pipe(
            tap(data => {
                if (data) {
                    this.settingsSubject.next(data);
                }
            })
        );
    }

    // Posts
    getPosts(offset: number = 0): Observable<any[]> {
        const urlQueries = new URLSearchParams({
            limit: '10',
            status: 'published',
            sort: 'ASC',
            sortBy: 'publishedAt',
            offset: offset.toString()
        }).toString();

        return this.api.get<any[]>(`blog/posts?${urlQueries}`);
    }

    searchPosts(query: string): Observable<any[]> {
        const urlQueries = new URLSearchParams({
            limit: '10',
            status: 'published',
            sort: 'ASC',
            sortBy: 'publishedAt',
            search: query,
            searchField: 'title'
        }).toString();

        return this.api.get<any[]>(`blog/posts?${urlQueries}`);
    }

    getPostById(id: string): Observable<any> {
        return this.api.get<any>(`blog/posts/${id}`);
    }

    getPostBySlug(slug: string): Observable<any> {
        return this.api.get<any>(`blog/posts/slug/${slug}`);
    }

    getPostByAuthor(author: string): Observable<any[]> {
        const urlQueries = new URLSearchParams({
            author: author,
            limit: '5',
            status: 'published',
            sort: 'DESC',
            sortBy: 'publishedAt'
        }).toString();

        return this.api.get<any[]>(`blog/posts?${urlQueries}`);
    }

    // Pages
    getPageById(id: string): Observable<any> {
        return this.api.get<any>(`blog/pages/${id}`);
    }

    getPageBySlug(slug: string): Observable<any> {
        return this.api.get<any>(`blog/pages/slug/${slug}`);
    }

    // Authors
    getAuthorById(id: string): Observable<any> {
        return this.api.get<any>(`authors/${id}`);
    }

    getAuthorBySlug(slug: string): Observable<any> {
        return this.api.get<any>(`authors/slug/${slug}`);
    }

    // Members
    createMember(payload: any): Observable<any> {
        return this.api.post<any>('members', payload);
    }

    getMemberProfile(id: string): Observable<any> {
        return this.api.get<any>(`blog/members/profile/${id}`);
    }

    getMyProfile(): Observable<any> {
        return this.api.get<any>('blog/members/me');
    }

    updateMemberProfile(id: string, payload: any): Observable<any> {
        return this.api.put<any>(`blog/members/profile/${id}`, payload);
    }

    // Analytics
    registerAnalyticsAccess(path?: string): void {
        if (typeof window !== 'undefined') {
            window.addEventListener('load', () => {
                const url = new URL(window.location.href);
                const data = new URLSearchParams({
                    path: path || url.pathname,
                    t: Date.now().toString(),
                    r: Math.random().toString()
                });

                navigator.sendBeacon('/api/analytics/access', data);
            });
        }
    }

    registerAnalyticsUnload(path?: string): void {
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', () => {
                const url = new URL(window.location.href);
                const data = new URLSearchParams({
                    path: path || url.pathname,
                    t: Date.now().toString(),
                    r: Math.random().toString()
                });

                navigator.sendBeacon('/api/analytics/unload', data);
            });
        }
    }
}

/**
 * @description Create the LD+JSON for the page
 * @param {string} type - The type of the page
 * @param {any} data - The data of the page
 * @param {any} settings - The settings of the blog
 * @returns {string} The LD+JSON
 */
export const createLdJSON = (type: string, data: any, settings: any) => {
    switch(type){
        case "post":
            let authorLinks = [];

            if(data.author.facebook)
                authorLinks.push(`https://www.facebook.com/${data.author.facebook}`);

            if(data.author.twitter)
                authorLinks.push(`https://twitter.com/${data.author.twitter}`);

            if(data.author.linkedin)
                authorLinks.push(`https://www.linkedin.com/in/${data.author.linkedin}`);

            if(data.author.instagram)
                authorLinks.push(`https://www.instagram.com/${data.author.instagram}`);

            if(data.author.youtube)
                authorLinks.push(`https://www.youtube.com/${data.author.youtube}`);

            if(data.author.github)
                authorLinks.push(`https://github.com/${data.author.github}`);

            if(data.author.website)
                authorLinks.push(data.author.website);

            return {
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": [
                            "Person",
                            "Organization"
                        ],
                        "@id": `${getEnv('VITE_WEBSITE_URL')}/#person`,
                        "name": data.author.name,
                        "logo": {
                            "@type": "ImageObject",
                            "@id": `${getEnv('VITE_WEBSITE_URL')}/#logo`,
                            "url": settings['blog.image'] || settings['blog.defaultFeaturedImage'],
                            "caption": data.author.name,
                            "inLanguage": settings['blog.language'],
                            "width": "1440",
                            "height": "1440"
                        },
                        "image": {
                            "@type": "ImageObject",
                            "@id": `${getEnv('VITE_WEBSITE_URL')}/#logo`,
                            "url": settings['blog.logo'],
                            "caption": data.author.name,
                            "inLanguage": settings['blog.language'],
                            "width": "1440",
                            "height": "1440"
                        }
                    },
                    {
                        "@type": "WebSite",
                        "@id": `${getEnv('VITE_WEBSITE_URL')}/#website`,
                        "url": getEnv('VITE_WEBSITE_URL'),
                        "name": settings['blog.title'],
                        "publisher": {
                            "@id": `${getEnv('VITE_WEBSITE_URL')}/#person`
                        },
                        "inLanguage": settings['blog.language']
                    },
                    {
                        "@type": "ImageObject",
                        "@id": data.featureImage || settings['blog.image'],
                        "url": data.featureImage || settings['blog.image'],
                        "width": "1200",
                        "height": "630",
                        "inLanguage": "pt-BR"
                    },
                    {
                        "@type": "WebPage",
                        "@id": `${getEnv('VITE_WEBSITE_URL')}/post/${data.slug}/#webpage`,
                        "url": `${getEnv('VITE_WEBSITE_URL')}/post/${data.slug}`,
                        "name": data.title,
                        "datePublished": data.status === 'published' ?
                            new Date(data.publishedAt).toISOString() :
                            new Date(data.updatedAt).toISOString(),
                        "dateModified": data.status === 'published' ?
                            new Date(data.publishedAt).toISOString() :
                            new Date(data.updatedAt).toISOString(),
                        "isPartOf": {
                          "@id": `${getEnv('VITE_WEBSITE_URL')}/#website`
                        },
                        "primaryImageOfPage": {
                          "@id": data.featureImage || settings['blog.image']
                        },
                        "inLanguage": settings['blog.language']
                    },
                    {
                        "@type": "Person",
                        "@id": `${getEnv('VITE_WEBSITE_URL')}/author/${data.author.slug}`,
                        "name": data.author.name,
                        "url": `${getEnv('VITE_WEBSITE_URL')}/author/${data.author.slug}`,
                        "image": {
                          "@type": "ImageObject",
                          "@id": data.author.avatar,
                          "url": data.author.avatar,
                          "caption": data.author.name,
                          "inLanguage": settings['blog.language']
                        },
                        "sameAs": authorLinks
                      },
                    {
                        "@type": "BlogPosting",
                        "headline": data.title,
                        "keywords": data.tags.map((tag: any) => tag.name).join(', ').toLowerCase(),
                        "description": data.excerpt,
                        "datePublished": data.status === 'published' ?
                            new Date(data.publishedAt).toISOString() :
                            new Date(data.updatedAt).toISOString(),
                        "dateModified": data.status === 'published' ?
                            new Date(data.publishedAt).toISOString() :
                            new Date(data.updatedAt).toISOString(),
                        "author": {
                            "@type": "Person",
                            "@id": `${getEnv('VITE_WEBSITE_URL')}/author/${data.author.slug}`
                        },
                        "publisher": {
                            "@id": `${getEnv('VITE_WEBSITE_URL')}/#person`
                        },
                        "name": data.title + " -" +settings['blog.title'],
                        "@id": `${getEnv('VITE_WEBSITE_URL')}/post/${data.slug}/#richSnippet`,
                        "isPartOf": {
                            "@id": `${getEnv('VITE_WEBSITE_URL')}/#website`
                        },
                        "image": {
                            "@id": data.featureImage || settings['blog.image']
                        },
                        "inLanguage": "pt-BR",
                        "mainEntityOfPage": {
                            "@id": `${getEnv('VITE_WEBSITE_URL')}/post/${data.slug}/#webpage`
                        }
                    }
                ]
            }
            break;
    }
}
