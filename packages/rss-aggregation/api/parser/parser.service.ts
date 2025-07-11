import * as urlParser from "node:url";
import { Worker } from "node:worker_threads";

import {
    Service, Logger
} from "@cmmv/core";

import {
    Repository, Like, In
} from "@cmmv/repository";

//@ts-ignore
import { AIContentService } from "@cmmv/ai-content";

@Service()
export class ParserService {
    private readonly logger = new Logger("ParserService");

    constructor(
        private readonly aiContentService: AIContentService
    ) {}

    /**
     * Parse a URL and extract important content information using Gemini AI
     * @param url The URL to analyze
     * @returns JSON with extracted information and suggested regex patterns
     */
    async parseURL(url: string) {
        try {
            const urlDecoded = decodeURIComponent(url);
            this.logger.log(`Analyzing URL: ${urlDecoded}`);
            const html = await this.fetchHTML(urlDecoded);

            if (!html)
                throw new Error("Failed to fetch HTML content from the URL");

            this.logger.log(`Successfully fetched HTML content (length: ${html.length} chars)`);
            const analysisResult = await this.analyzeWithAI(html, urlDecoded);
            const processedResult = this.processAIResponse(analysisResult);

            return {
                url: urlDecoded,
                ...processedResult
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error parsing URL: ${errorMessage}`);
            throw new Error(`Failed to parse URL: ${errorMessage}`);
        }
    }

    /**
     * Fetch HTML content from a URL
     * @param url URL to fetch
     * @returns HTML content as string
     */
    private async fetchHTML(url: string): Promise<string> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            this.logger.log(`Starting fetch for URL: ${url}`);

            const response = await fetch(url, {
                headers: {
                    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,es;q=0.6',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok)
                throw new Error(`HTTP error! Status: ${response.status}`);

            const contentType = response.headers.get('content-type') || '';
            const charsetMatch = contentType.match(/charset=([^;]+)/i);
            let charset = charsetMatch ? charsetMatch[1].trim().toLowerCase() : 'utf-8';

            this.logger.log(`Detected charset for ${url}: ${charset}`);
            let htmlContent: string;

            try {
                // Se for UTF-8 ou não for possível determinar, podemos usar o método padrão
                if (charset === 'utf-8' || charset === 'utf8') {
                    this.logger.log(`Reading UTF-8 content from ${url}`);
                    const textPromise = response.text();
                    // Utilizar um Promise.race com um timeout para a leitura do texto
                    htmlContent = await Promise.race([
                        textPromise,
                        new Promise<string>((_, reject) => {
                            setTimeout(() => reject(new Error('Timeout reading response body')), 30000);
                        })
                    ]);
                } else {
                    // Para outros charsets, precisamos usar ArrayBuffer e TextDecoder
                    this.logger.log(`Reading non-UTF-8 content (${charset}) from ${url}`);
                    const bufferPromise = response.arrayBuffer();
                    const buffer = await Promise.race([
                        bufferPromise,
                        new Promise<ArrayBuffer>((_, reject) => {
                            setTimeout(() => reject(new Error('Timeout reading response body')), 30000);
                        })
                    ]);

                    try {
                        // Tentar decodificar com o charset especificado
                        const decoder = new TextDecoder(charset);
                        htmlContent = decoder.decode(buffer);
                    } catch (decodeError) {
                        this.logger.error(`Error decoding with charset ${charset}: ${decodeError instanceof Error ? decodeError.message : String(decodeError)}`);

                        // Fallbacks para encodings comuns em sites brasileiros
                        if (charset === 'iso-8859-1' || charset === 'latin1') {
                            const latin1Decoder = new TextDecoder('iso-8859-1');
                            htmlContent = latin1Decoder.decode(buffer);
                        } else {
                            // Se tudo falhar, tentar como UTF-8 mesmo
                            this.logger.log(`Falling back to UTF-8 decoding for ${url}`);
                            htmlContent = new TextDecoder('utf-8').decode(buffer);
                        }
                    }
                }

                // Verificar se o conteúdo HTML é válido e não muito grande
                if (!htmlContent || htmlContent.length === 0) {
                    throw new Error('Empty HTML content received');
                }

                if (htmlContent.length > 5000000) { // 5MB
                    this.logger.log(`Truncating large HTML content (${htmlContent.length} bytes) from ${url}`);
                    htmlContent = htmlContent.substring(0, 5000000);
                }

                this.logger.log(`Successfully read HTML content (${htmlContent.length} bytes) from ${url}`);
                return htmlContent;

            } catch (readError) {
                this.logger.error(`Error reading response body: ${readError instanceof Error ? readError.message : String(readError)}`);
                throw new Error(`Error reading response body: ${readError instanceof Error ? readError.message : String(readError)}`);
            }
        } catch (error: unknown) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                this.logger.error(`Fetch timeout for URL: ${url}`);
                throw new Error(`Fetch timeout after 15 seconds: ${url}`);
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error fetching HTML: ${errorMessage}`);
            throw new Error(`Error fetching HTML: ${errorMessage}`);
        }
    }

    /**
     * Analyze HTML content using AI API
     * @param html HTML content to analyze
     * @param url Source URL for context
     * @returns Analysis result with content suggestions and regex patterns
     */
    private async analyzeWithAI(html: string, url: string): Promise<any> {
        try {
            const truncatedHtml = html.length > 30000 ? html.substring(0, 30000) + "..." : html;

            const promptString = `
You are an expert in HTML parsing and extracting structured content from web pages.

Analyze the following HTML page and extract key information that would be needed for a feed/blog system.

IMPORTANT GUIDELINES:
1. For the title, prioritize extracting the main visible heading (h1) that would be seen by users over meta tags. Look for the actual article title, not site titles.
2. For content, extract the FULL article body content, not short meta descriptions or structured data. Look for the complete text within <article>, <main>, or content div containers. I need the entire article text that would be visible to users, not just a summary.
3. For category, try to determine from visible UI elements like breadcrumbs or category labels, not hidden metadata.
4. For featured image, look for the main article image, not icons or logos.
5. For tags, look for tag elements, keywords, or related topics shown in the page.

IMPORTANT REGEX GUIDELINES:
1. Make your regex patterns generalizable but still precise enough to capture only relevant content.
2. For HTML tags, keep important attributes that identify the content, especially for the article body content.
3. Always escape forward slashes in closing HTML tags with a backslash, like <\\/tag> NOT </tag>.
4. For the content section, identify specific container elements with distinct classes or IDs that uniquely identify the article content.
5. Try to include both opening and closing tags in your content regex to ensure you capture the complete article, not just fragments or unrelated content.
6. Use non-greedy operators (.*?) to avoid capturing too much content, especially for content sections.
7. Test your regex to make sure it extracts only the desired content.

For each field, provide:
- The extracted content
- A regular expression pattern that would reliably extract this information from similar pages on this site
- A confidence level (high, medium, or low) for your extraction

Return your analysis as a JSON object with the following format:
{
  "title": {
    "value": "The extracted title",
    "regex": "Regular expression to extract title",
    "confidence": "high|medium|low"
  },
  "content": {
    "value": "The first ~1000 characters of the actual article body content",
    "regex": "Regular expression to extract content",
    "confidence": "high|medium|low"
  },
  "category": {
    "value": "The extracted category",
    "regex": "Regular expression to extract category",
    "confidence": "high|medium|low"
  },
  "featuredImage": {
    "value": "URL of the featured image",
    "regex": "Regular expression to extract featured image URL",
    "confidence": "high|medium|low"
  },
  "tags": {
    "value": ["tag1", "tag2", "tag3"],
    "regex": "Regular expression to extract tags",
    "confidence": "high|medium|low"
  }
}

HTML to analyze:
${truncatedHtml}
`;

            const textResponse = await this.aiContentService.generateContent(promptString);

            if (!textResponse) throw new Error("AI response is empty");
            const jsonMatch = await this.runRegexWithTimeout(textResponse, "\\{[\\s\\S]*\\}");

            if (!jsonMatch)
                throw new Error("No JSON found in AI response");

            const jsonContent = jsonMatch[0];
            return JSON.parse(jsonContent);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error analyzing content with AI: ${errorMessage}`);
            throw new Error(`Error analyzing content: ${errorMessage}`);
        }
    }

    /**
     * Fix common regex issues in patterns extracted from Gemini
     * @param regex Regular expression string to fix
     * @param field Field name to help determine specific fixes
     * @returns Corrected regular expression string
     */
    private fixRegexPattern(regex: string, field: string = ''): string {
        if (!regex) return regex;

        let fixed = regex;
        const htmlTags = ['div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'ul', 'ol', 'li', 'article', 'section', 'main', 'header', 'footer'];

        for (const tag of htmlTags) {
            const find = new RegExp(`</${tag}>`, 'g');
            fixed = fixed.replace(find, `<\\/${tag}>`);

            const findPartial = new RegExp(`</${tag}([^>])`, 'g');
            fixed = fixed.replace(findPartial, `<\\/${tag}$1`);
        }

        if (field === 'content') {
            fixed = fixed.replace(/<([a-zA-Z0-9]+)\s+class="([^"]+)"/, '<$1\\s+class="[^"]*$2[^"]*"');
            fixed = fixed.replace(/<([a-zA-Z0-9]+)\s+id="([^"]+)"/, '<$1\\s+id="$2"');

            if (!fixed.includes('<\\/')) {
                const openTagMatch = fixed.match(/<([a-zA-Z0-9]+)[\s>]/);
                if (openTagMatch && openTagMatch[1]) {
                    const mainTag = openTagMatch[1];
                    if (!fixed.includes(`<\\/${mainTag}`)) {
                        fixed = fixed + `(?:.|\\s)*?<\\/${mainTag}>`;
                    }
                }
            }
        } else {
            fixed = fixed.replace(/<([a-zA-Z0-9]+)\s+[^>]*?([a-zA-Z0-9\-]+)="[^"]*"[^>]*>/g, '<$1 .*?>');
        }

        return fixed;
    }

    /**
     * Process AI response and fix regex patterns
     * @param aiResponse Raw response from AI
     * @returns Response with fixed regex patterns
     */
    private processAIResponse(aiResponse: any): any {
        if (!aiResponse) return aiResponse;

        const processedResponse = { ...aiResponse };

        if (processedResponse.title && processedResponse.title.regex) {
            processedResponse.title.regex = this.fixRegexPattern(processedResponse.title.regex, 'title');
        }

        if (processedResponse.content && processedResponse.content.regex) {
            processedResponse.content.regex = this.fixRegexPattern(processedResponse.content.regex, 'content');
        }

        if (processedResponse.category && processedResponse.category.regex) {
            processedResponse.category.regex = this.fixRegexPattern(processedResponse.category.regex, 'category');
        }

        if (processedResponse.featuredImage && processedResponse.featuredImage.regex) {
            processedResponse.featuredImage.regex = this.fixRegexPattern(processedResponse.featuredImage.regex, 'featuredImage');
        }

        if (processedResponse.tags && processedResponse.tags.regex) {
            processedResponse.tags.regex = this.fixRegexPattern(processedResponse.tags.regex, 'tags');
        }

        return processedResponse;
    }

    /**
     * Parse content using a specific parser or all parsers
     * @param parserId Optional ID of a specific parser to use
     * @param url The URL to parse
     * @returns Parsed content with confidence score
     */
    async parseContent(parserId: string | null = null, url: string) {
        const urlDecoded = decodeURIComponent(url);
        const FeedParserEntity = Repository.getEntity("FeedParserEntity");
        const FeedChannelsEntity = Repository.getEntity("FeedChannelsEntity");
        let parsers = [];
        const MAX_PARSERS = 5;

        const parsedUrl = urlParser.parse(urlDecoded);

        const channels = await Repository.findAll(FeedChannelsEntity, {
            limit: 1000,
            url: Like(`%${parsedUrl.host}%`)
        });

        const channelsIds = channels?.data?.map((channel: any) => channel.id);

        try {
            if (parserId) {
                const parser = await Repository.findOne(FeedParserEntity, Repository.queryBuilder({
                    id: parserId
                }));

                if (!parser)
                    throw new Error("Parser not found");

                parsers = [parser];
            } else {
                const findResult = await Repository.findAll(FeedParserEntity, {
                    limit: MAX_PARSERS,
                    channel: In(channelsIds)
                });

                parsers = findResult?.data || [];

                if (parsers.length === 0) {
                    this.logger.log(`No parsers found for URL ${urlDecoded}. Attempting generic extraction.`);

                    // Fallback genérico: tentar extrair título, imagem e corpo básico
                    const html = await this.fetchHTML(urlDecoded);
                    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
                    const extractedTitle = titleMatch ? titleMatch[1].trim() : '';

                    const imgMatch = html.match(/<img[^>]+(?:src|data-src)=["']([^"']+)["']/i);
                    let extractedImg = imgMatch ? this.resolveUrl(imgMatch[1], urlDecoded) : '';

                    // Tentar meta og:image se não achar
                    if (!extractedImg) {
                        const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
                        if (ogMatch) extractedImg = this.resolveUrl(ogMatch[1], urlDecoded);
                    }

                    if (!extractedImg) {
                        const twMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
                        if (twMatch) extractedImg = this.resolveUrl(twMatch[1], urlDecoded);
                    }

                    // Extrair corpo entre <article> ou <body>
                    let bodyContent = '';
                    const articleMatch = html.match(/<article[\s\S]*?<\/article>/i);
                    if (articleMatch) {
                        bodyContent = articleMatch[0];
                    } else {
                        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
                        if (bodyMatch) bodyContent = bodyMatch[1];
                    }

                    if (bodyContent.length > 5000)
                        bodyContent = bodyContent.substring(0, 5000) + '...';

                    return {
                        success: true,
                        data: {
                            title: extractedTitle,
                            content: bodyContent,
                            featureImage: extractedImg,
                            category: '',
                            pubDate: new Date(),
                            link: urlDecoded,
                            confidence: 5
                        },
                        message: "Generic extraction applied."
                    };
                }
            }

            this.logger.log(`Fetching HTML content from ${urlDecoded}`);
            const html = await this.fetchHTML(urlDecoded);

            if (!html || html.length === 0)
                throw new Error("Failed to fetch HTML content from the URL");

            this.logger.log(`Processing ${parsers.length} parsers for URL: ${urlDecoded}`);

            let bestResult = {
                title: '',
                content: '',
                featureImage: '',
                category: '',
                pubDate: new Date(),
                link: urlDecoded,
                confidence: 0
            };

            // Aumentamos o timeout global por parser para 6 s.
            const PARSER_TIMEOUT_MS = 6000;

            const parsePromises = parsers.map((parser: { id: any }) =>
                Promise.race([
                    this.processParserWithTimeout(parser, html, urlDecoded),
                    new Promise(resolve => setTimeout(() => resolve(null), PARSER_TIMEOUT_MS))
                ])
            );

            const results = await Promise.all(parsePromises);
            const validResults = results.filter(result => result !== null) as any[];

            for (const result of validResults) {
                if(result.title)
                    bestResult.title = result.title;

                if (result.content)
                    bestResult.content = result.content;

                if (result.featureImage)
                    bestResult.featureImage = result.featureImage;

                if (result.category)
                    bestResult.category = result.category;

                if (result.pubDate)
                    bestResult.pubDate = result.pubDate;

                if (result.link)
                    bestResult.link = result.link;
            }

            return {
                success: true,
                data: bestResult,
                message: `Successfully parsed content with confidence score ${bestResult.confidence}%`
            };
        } catch (error: unknown) {
            this.logger.error(`Error parsing content: ${error instanceof Error ? error.message : String(error)}`);
            throw new Error(`Failed to parse content: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Process a single parser with content
     * @param parser The parser to use
     * @param html The HTML content
     * @param url The original URL
     * @returns Parser result with confidence score
     */
    private async processParserWithTimeout(parser: any, html: string, url: string) {
        try {
            this.logger.log(`[ParserService] Iniciando processamento do parser ${parser.id} para URL: ${url}`);

            const result = {
                title: '',
                content: '',
                featureImage: '',
                category: '',
                pubDate: new Date(),
                link: url,
                confidence: 0,
                tags: '',
                parserId: parser.id
            };

            let confidenceScore = 0;

            // Título
            if (parser.title) {
                try {
                    this.logger.log(`[ParserService] Executando regex de título para parser ${parser.id}`);
                    const titleMatch = await this.runRegexWithTimeout(html, parser.title);

                    if (titleMatch) {
                        // Extract first capture group if it exists, otherwise use full match
                        const extractedTitle = titleMatch[1] ? titleMatch[1].trim() : titleMatch[0].trim();
                        result.title = extractedTitle;
                        confidenceScore += 25;
                    }
                } catch (error) {
                    this.logger.error(`[ParserService] Erro no regex de título do parser ${parser.id}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }

            // Conteúdo
            if (parser.content) {
                try {
                    this.logger.log(`[ParserService] Executando regex de conteúdo para parser ${parser.id}`);
                    const contentMatch = await this.runRegexWithTimeout(html, parser.content);

                    if (contentMatch) {
                        result.content = contentMatch[0].trim();
                        confidenceScore += 25;
                    }
                } catch (error) {
                    this.logger.error(`[ParserService] Erro no regex de conteúdo do parser ${parser.id}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }

            // Categoria
            if (parser.category) {
                try {
                    this.logger.log(`[ParserService] Executando regex de categoria para parser ${parser.id}`);
                    const categoryMatch = await this.runRegexWithTimeout(html, parser.category);

                    if (categoryMatch) {
                        // Extract first capture group if it exists, otherwise use full match
                        const extractedCategory = categoryMatch[1] ? categoryMatch[1].trim() : categoryMatch[0].trim();
                        result.category = extractedCategory;
                        confidenceScore += 20;
                    }
                } catch (error) {
                    this.logger.error(`[ParserService] Erro no regex de categoria do parser ${parser.id}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }

            // Imagem destacada
            if (parser.featureImage) {
                try {
                    this.logger.log(`[ParserService] Executando regex de imagem destacada para parser ${parser.id}`);
                    const featureImageMatch = await this.runRegexWithTimeout(html, parser.featureImage);

                    if (featureImageMatch) {
                        // Extract first capture group if it exists, otherwise use full match
                        const extractedImage = featureImageMatch[1] ? featureImageMatch[1] : featureImageMatch[0];
                        result.featureImage = this.resolveUrl(extractedImage, url);
                        confidenceScore += 20;
                    }
                } catch (error) {
                    this.logger.error(`[ParserService] Erro no regex de imagem destacada do parser ${parser.id}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }

            // Tags
            if (parser.tags) {
                try {
                    this.logger.log(`[ParserService] Executando regex de tags para parser ${parser.id}`);
                    const tagsMatch = await this.runRegexWithTimeout(html, parser.tags);

                    if (tagsMatch) {
                        // Extract first capture group if it exists, otherwise use full match
                        const extractedTags = tagsMatch[1] ? tagsMatch[1].trim() : tagsMatch[0].trim();
                        result.tags = extractedTags;
                        confidenceScore += 10;
                    }
                } catch (error) {
                    this.logger.error(`[ParserService] Erro no regex de tags do parser ${parser.id}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }

            // Data de publicação (padrão)
            const pubDateMatch = await this.runRegexWithTimeout(html, '<meta\\s+property=["\\\'"]article:published_time["\\\'"]\\s+content=["\\\'"]([^"\\\']+)["\\\'"]');
            if (pubDateMatch) {
                try {
                    const dateString = pubDateMatch[1] ? pubDateMatch[1] : pubDateMatch[0];
                    result.pubDate = new Date(dateString);
                    confidenceScore += 10;
                } catch (e) {
                    result.pubDate = new Date();
                }
            }

            result.confidence = confidenceScore;

            this.logger.log(`[ParserService] Parser ${parser.id} finalizado com confiança: ${confidenceScore}%`);
            return result;
        } catch (error) {
            this.logger.error(`[ParserService] Erro ao processar parser ${parser.id}: ${error instanceof Error ? error.message : String(error)}`);
            return null;
        }
    }

    /**
     * Resolve relative URLs to absolute URLs
     * @param url The relative URL to resolve
     * @param baseUrl The base URL to resolve against
     * @returns The absolute URL
     */
    private resolveUrl(url: string, baseUrl: string): string {
        try {
            if (url.startsWith('http://') || url.startsWith('https://'))
                return url;

            const base = new URL(baseUrl);

            if (url.startsWith('//'))
                return `${base.protocol}${url}`;

            if (url.startsWith('/'))
                return `${base.protocol}//${base.host}${url}`;

            let basePath = base.pathname;

            if (!basePath.endsWith('/'))
                basePath = basePath.substring(0, basePath.lastIndexOf('/') + 1);

            return `${base.protocol}//${base.host}${basePath}${url}`;
        } catch (e) {
            return url;
        }
    }

    /**
     * Refine a parser with AI
     * @param url The URL to refine the parser for
     * @param currentParser The current parser to refine
     * @returns The refined parser
     */
    async refineWithAI(url: string, currentParser: any) {
        try {
            const urlDecoded = decodeURIComponent(url);
            this.logger.log(`Refining parser for URL: ${urlDecoded}`);
            const html = await this.fetchHTML(urlDecoded);

            if (!html)
                throw new Error("Failed to fetch HTML content from the URL");

            const { prompt, unlockedFields } = this.buildRefinePrompt(html, currentParser);

            if (unlockedFields.length === 0) {
                this.logger.log("All fields are locked, no refinement needed.");
                return currentParser;
            }

            const aiResult = await this.executeAIPrompt(prompt);
            const refinedParser = this.mergeAIResults(currentParser, aiResult, unlockedFields);
            return refinedParser;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error refining parser with AI: ${errorMessage}`);
            throw new Error(`Failed to refine parser: ${errorMessage}`);
        }
    }

    /**
     * Build a prompt for the AI to refine the parser
     * @param html The HTML to analyze
     * @param parser The current parser to refine
     * @returns The prompt and the unlocked fields
     */
    private buildRefinePrompt(html: string, parser: any): { prompt: string, unlockedFields: string[] } {
        const truncatedHtml = html.length > 30000 ? html.substring(0, 30000) + "..." : html;
        const unlockedFields = Object.keys(parser).filter(key => parser[key] && !parser[key].locked);

        let prompt = `
You are an expert in HTML parsing and creating precise regular expressions.
Your task is to refine an existing set of regex patterns to better extract structured content from a web page.

**INSTRUCTIONS:**
1.  Analyze the provided HTML.
2.  You have been given a set of existing regex patterns. Some are "locked" and **MUST NOT BE CHANGED**.
3.  You **MUST** generate new, improved regex patterns ONLY for the "unlocked" fields listed below.
4.  For each unlocked field, provide the new regex, the extracted value, and a confidence score (high, medium, or low).
5.  Always escape forward slashes in closing HTML tags (e.g., <\\/div>).
6.  Return your response as a JSON object containing ONLY the unlocked fields.

**LOCKED FIELDS (DO NOT CHANGE):**
`;

        Object.keys(parser).forEach(key => {
            if (parser[key] && parser[key].locked) {
                prompt += `- ${key}: ${parser[key].regex}\n`;
            }
        });

        prompt += `
**UNLOCKED FIELDS (IMPROVE THESE):**
${unlockedFields.join(', ')}

**EXPECTED JSON OUTPUT FORMAT (only include unlocked fields):**
{
  "fieldName": {
    "value": "The extracted content for the unlocked field",
    "regex": "The new, improved regular expression",
    "confidence": "high|medium|low"
  },
  // ... other unlocked fields
}

**HTML to analyze:**
${truncatedHtml}
`;
        return { prompt, unlockedFields };
    }

    /**
     * Execute a prompt with the AI
     * @param prompt The prompt to execute
     * @returns The AI response
     */
    private async executeAIPrompt(prompt: string): Promise<any> {
        const textResponse = await this.aiContentService.generateContent(prompt);

        if (!textResponse) throw new Error("AI response is empty");
        const jsonMatch = await this.runRegexWithTimeout(textResponse, "\\{[\\s\\S]*\\}");

        if (!jsonMatch)
            throw new Error("No JSON found in AI response");

        const jsonContent = jsonMatch[0];
        return JSON.parse(jsonContent);
    }

    /**
     * Merge AI results with the locked fields
     * @param originalParser The original parser
     * @param aiResult The AI response
     * @param unlockedFields The unlocked fields
     * @returns The refined parser
     */
    private mergeAIResults(originalParser: any, aiResult: any, unlockedFields: string[]): any {
        const refinedParser = JSON.parse(JSON.stringify(originalParser)); // Deep copy

        for (const key of unlockedFields) {
            if (aiResult[key]) {
                const fixedRegex = this.fixRegexPattern(aiResult[key].regex, key);
                refinedParser[key] = {
                    ...aiResult[key],
                    regex: fixedRegex,
                    locked: false
                };
            }
        }
        return refinedParser;
    }

    /**
     * Test a custom parser
     * @param url The URL to test the parser for
     * @param parserData The parser data to test
     * @returns The test result
     */
    async testCustomParser(url: string, parserData: any) {
        try {
            const urlDecoded = decodeURIComponent(url);
            this.logger.log(`Testing custom parser for URL: ${urlDecoded}`);
            const html = await this.fetchHTML(urlDecoded);

            if (!html || html.length === 0)
                throw new Error("Failed to fetch HTML content from the URL");

            const result = await this.processParserWithTimeout(parserData, html, urlDecoded);

            return {
                success: true,
                data: result
            };

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error testing custom parser: ${errorMessage}`);
            throw new Error(`Failed to test custom parser: ${errorMessage}`);
        }
    }

    /**
     * Analyze all parsers
     * @returns The analysis result
     */
    async analyzeAllParsers() {
        this.logger.log('Starting analysis of all parsers');
        const FeedParserEntity = Repository.getEntity("FeedParserEntity");
        const problematicParsers = [];

        try {
            const allParsersResult = await Repository.findAll(FeedParserEntity, { limit: 2000 });

            if (!allParsersResult || !allParsersResult.data || allParsersResult.data.length === 0) {
                return {
                    success: true,
                    data: [],
                    message: "No parsers found to analyze."
                };
            }

            const allParsers = allParsersResult.data;

            for (const parser of allParsers) {
                const issues = [];
                const regexFields = ['title', 'content', 'category', 'featureImage', 'tags'];

                for (const field of regexFields) {
                    const regex = parser[field];
                    if (regex) {
                        try {
                            new RegExp(regex, 'i');
                        } catch (error) {
                            issues.push({
                                field,
                                error: error instanceof Error ? error.message : String(error),
                                regex: regex
                            });
                        }
                    }
                }

                if (issues.length > 0) {
                    problematicParsers.push({
                        parserId: parser.id,
                        channelId: parser.channel,
                        issues: issues
                    });
                }
            }

            return {
                success: true,
                data: problematicParsers,
                message: `Analysis complete. Found ${problematicParsers.length} problematic parsers.`
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error analyzing parsers: ${errorMessage}`);
            throw new Error(`Failed to analyze parsers: ${errorMessage}`);
        }
    }

    /**
     * Validate a parser
     * @param data The parser data to validate
     * @returns The validated parser
     */
    private _validateParser(data: any) {
        const regexFields = ['title', 'content', 'category', 'featureImage', 'tags'];

        for (const field of regexFields) {
            const regex = data[field];
            if (regex) {
                try {
                    new RegExp(regex, 'i');
                } catch (e: any) {
                    throw new Error(`Invalid regular expression for field "${field}": ${e.message}`);
                }
            }
        }
    }

    /**
     * Create a parser
     * @param data The parser data to create
     * @returns The created parser
     */
    async createParser(data: any) {
        this._validateParser(data);
        const FeedParserEntity = Repository.getEntity("FeedParserEntity");
        return Repository.insert(FeedParserEntity, data);
    }

    /**
     * Update a parser
     * @param id The ID of the parser to update
     * @param data The parser data to update
     * @returns The updated parser
     */
    async updateParser(id: string, data: any) {
        this._validateParser(data);
        const FeedParserEntity = Repository.getEntity("FeedParserEntity");
        return Repository.update(FeedParserEntity, { id }, data);
    }

    /**
     * Run a regex with a timeout
     * @param html The HTML to run the regex on
     * @param regexStr The regex to run
     * @param timeout The timeout in milliseconds
     * @returns The regex match
     */
    runRegexWithTimeout(html: string, regexStr: string, timeout = 2000): Promise<RegExpMatchArray | null> {
        return new Promise((resolve) => {
            if (html.length > 1000000) { // 1MB
                this.logger.log(`HTML too large (${html.length} chars), skipping regex execution`);
                resolve(null);
                return;
            }

            if (regexStr.length > 1000) {
                this.logger.log(`Regex too complex (${regexStr.length} chars), skipping execution`);
                resolve(null);
                return;
            }

            const workerCode = `
                const { parentPort } = require('worker_threads');

                parentPort.on('message', ({ html, regexStr, flags }) => {
                    try {
                        const regex = new RegExp(regexStr, flags);
                        const match = html.match(regex);
                        parentPort.postMessage({ success: true, result: match });
                    } catch (error) {
                        parentPort.postMessage({ success: false, error: error.message });
                    }
                });
            `;

            let worker;
            let isResolved = false;

            try {
                worker = new Worker(workerCode, { eval: true });
            } catch (error) {
                this.logger.error(`Failed to create worker: ${error instanceof Error ? error.message : String(error)}`);
                resolve(null);
                return;
            }

            const timeoutId = setTimeout(() => {
                if (!isResolved) {
                    isResolved = true;
                    try {
                        worker?.terminate();
                    } catch (e) {}

                    this.logger.log(`Regex execution timed out after ${timeout}ms`);
                    resolve(null);
                }
            }, timeout);

            worker.on('message', (data) => {
                if (!isResolved) {
                    isResolved = true;
                    clearTimeout(timeoutId);
                    try {
                        worker.terminate();
                    } catch (e) {}

                    if (data.success) {
                        resolve(data.result);
                    } else {
                        this.logger.error(`Regex execution error: ${data.error}`);
                        resolve(null);
                    }
                }
            });

            worker.on('error', (error) => {
                if (!isResolved) {
                    isResolved = true;
                    clearTimeout(timeoutId);
                    try {
                        worker.terminate();
                    } catch (e) {}

                    this.logger.error(`Worker error: ${error.message}`);
                    resolve(null);
                }
            });

            worker.on('exit', (code) => {
                if (!isResolved && code !== 0) {
                    isResolved = true;
                    clearTimeout(timeoutId);
                    this.logger.error(`Worker exited with code: ${code}`);
                    resolve(null);
                }
            });

            try {
                worker.postMessage({
                    html,
                    regexStr,
                    flags: 'igs'
                });
            } catch (error) {
                if (!isResolved) {
                    isResolved = true;
                    clearTimeout(timeoutId);
                    try {
                        worker.terminate();
                    } catch (e) {}
                    this.logger.error(`Failed to send message to worker: ${error instanceof Error ? error.message : String(error)}`);
                    resolve(null);
                }
            }
        });
    }
}
