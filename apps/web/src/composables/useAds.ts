import { computed } from 'vue';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

const isTruthy = (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        return value === '1' || value.toLowerCase() === 'true';
    }
    return false;
};

export const useAds = (settings: any, page = 'generic') => {
    const adSettings = computed(() => {
        const rawSettings = settings || {};
        const processedSettings: Record<string, any> = {};

        Object.keys(rawSettings).forEach(key => {
            if (key.startsWith('blog.')) {
                const shortKey = key.replace('blog.', '');
                processedSettings[shortKey] = rawSettings[key];
            } else {
                processedSettings[key] = rawSettings[key];
            }
        });

        const result: Record<string, any> = {
            enableAds: isTruthy(processedSettings['enableAds']),
            showAdsLoggedIn: isTruthy(processedSettings['showAdsLoggedIn']),

            [`${page}PageHeader`]: processedSettings[`${page}PageHeader`] === undefined ? true : isTruthy(processedSettings[`${page}PageHeader`]),
            [`${page}PageSidebarTop`]: processedSettings[`${page}PageSidebarTop`] === undefined ? true : isTruthy(processedSettings[`${page}PageSidebarTop`]),
            [`${page}PageSidebarMid`]: processedSettings[`${page}PageSidebarMid`] === undefined ? true : isTruthy(processedSettings[`${page}PageSidebarMid`]),
            [`${page}PageSidebarBottom`]: processedSettings[`${page}PageSidebarBottom`] === undefined ? true : isTruthy(processedSettings[`${page}PageSidebarBottom`]),
            [`${page}PageInContent`]: processedSettings[`${page}PageInContent`] === undefined ? true : isTruthy(processedSettings[`${page}PageInContent`]),
            [`${page}PageAfterContent`]: processedSettings[`${page}PageAfterContent`] === undefined ? true : isTruthy(processedSettings[`${page}PageAfterContent`]),
            [`${page}PageAfterTitle`]: processedSettings[`${page}PageAfterTitle`] === undefined ? false : isTruthy(processedSettings[`${page}PageAfterTitle`]),
            [`${page}PageAfterCover`]: processedSettings[`${page}PageAfterCover`] === undefined ? false : isTruthy(processedSettings[`${page}PageAfterCover`]),

            enableAdSense: isTruthy(processedSettings['enableAdSense']),
            adSensePublisherId: processedSettings['adSensePublisherId'] || '',
            adSenseAutoAdsCode: processedSettings['adSenseAutoAdsCode'] || '',
            enableAdSenseAutoAds: isTruthy(processedSettings['enableAdSenseAutoAds']),
            adSenseHeaderBanner: processedSettings['adSenseHeaderBanner'] || '',
            adSenseSidebarTop: processedSettings['adSenseSidebarTop'] || '',
            adSenseSidebarMid: processedSettings['adSenseSidebarMid'] || '',
            adSenseSidebarBottom: processedSettings['adSenseSidebarBottom'] || '',
            adSenseSidebarLeft: processedSettings['adSenseSidebarLeft'] || '',
            adSenseAfterCover: processedSettings['adSenseAfterCover'] || '',
            adSenseAfterTitle: processedSettings['adSenseAfterTitle'] || '',
            adSenseInArticle: processedSettings['adSenseInArticle'] || '',
            adSenseBelowContent: processedSettings['adSenseBelowContent'] || '',

            enableCustomAds: isTruthy(processedSettings['enableCustomAds']),
            customHeaderBanner: processedSettings['customHeaderBanner'] || '',
            customSidebarTop: processedSettings['customSidebarTop'] || '',
            customSidebarBottom: processedSettings['customSidebarBottom'] || '',
            customInArticle: processedSettings['customInArticle'] || '',
            customBelowContent: processedSettings['customBelowContent'] || '',
            customAfterTitle: processedSettings['customAfterTitle'] || '',
            customAfterCover: processedSettings['customAfterCover'] || '',

            enableAmazonAds: isTruthy(processedSettings['enableAmazonAds']),
            amazonAssociateId: processedSettings['amazonAssociateId'] || '',
            amazonSidebarAd: processedSettings['amazonSidebarAd'] || '',
            amazonInContentAd: processedSettings['amazonInContentAd'] || '',
            amazonBelowContentAd: processedSettings['amazonBelowContentAd'] || '',

            enableTaboolaAds: isTruthy(processedSettings['enableTaboolaAds']),
            taboolaPublisherId: processedSettings['taboolaPublisherId'] || '',
            taboolaBelowArticle: processedSettings['taboolaBelowArticle'] || '',
            taboolaRightRail: processedSettings['taboolaRightRail'] || '',
            taboolaFooter: processedSettings['taboolaFooter'] || '',
            taboolaJsCode: processedSettings['taboolaJsCode'] || '',
        };

        return result;
    });

    const getAdHtml = (position: string): string => {
        if (!adSettings.value.enableAds) return '';

        const positionSetting = `${page}Page${position.charAt(0).toUpperCase() + position.slice(1)}`;

        if (positionSetting in adSettings.value && !adSettings.value[positionSetting])
            return '';

        if (adSettings.value.enableAdSense) {
            let adSenseSetting = '';
            switch (position) {
                case 'header':
                    adSenseSetting = 'adSenseHeaderBanner';
                    break;
                case 'sidebarTop':
                    adSenseSetting = 'adSenseSidebarTop';
                    break;
                case 'sidebarMid':
                    adSenseSetting = 'adSenseSidebarMid';
                    break;
                case 'sidebarBottom':
                    adSenseSetting = 'adSenseSidebarBottom';
                    break;
                case 'sidebarLeft':
                    adSenseSetting = 'adSenseSidebarLeft';
                    break;
                case 'inContent':
                    adSenseSetting = 'adSenseInArticle';
                    break;
                case 'belowContent':
                    adSenseSetting = 'adSenseBelowContent';
                    break;
                case 'afterTitle':
                    adSenseSetting = 'adSenseAfterTitle';
                    break;
                case 'afterCover':
                    adSenseSetting = 'adSenseAfterCover';
                    break;
                default:
                    return '';
            }

            if (adSenseSetting in adSettings.value && adSettings.value[adSenseSetting]) {
                return adSettings.value[adSenseSetting];
            }
        }

        if (adSettings.value.enableCustomAds) {
            let customSetting = '';
            switch (position) {
                case 'header':
                    customSetting = 'customHeaderBanner';
                    break;
                case 'sidebarTop':
                    customSetting = 'customSidebarTop';
                    break;
                case 'sidebarBottom':
                    customSetting = 'customSidebarBottom';
                    break;
                case 'inContent':
                    customSetting = 'customInArticle';
                    break;
                case 'belowContent':
                    customSetting = 'customBelowContent';
                    break;
                case 'afterTitle':
                    customSetting = 'customAfterTitle';
                    break;
                case 'afterCover':
                    customSetting = 'customAfterCover';
                    break;
                default:
                    return '';
            }

            if (customSetting in adSettings.value && adSettings.value[customSetting]) {
                return adSettings.value[customSetting];
            }
        }

        if (adSettings.value.enableAmazonAds) {
            switch (position) {
                case 'sidebarTop':
                    if (adSettings.value.amazonSidebarAd) return adSettings.value.amazonSidebarAd;
                    break;
                case 'inContent':
                    if (adSettings.value.amazonInContentAd) return adSettings.value.amazonInContentAd;
                    break;
                case 'belowContent':
                    if (adSettings.value.amazonBelowContentAd) return adSettings.value.amazonBelowContentAd;
                    break;
            }
        }

        if (adSettings.value.enableTaboolaAds) {
            switch (position) {
                case 'belowContent':
                    if (adSettings.value.taboolaBelowArticle) return adSettings.value.taboolaBelowArticle;
                    break;
                case 'sidebarTop':
                    if (adSettings.value.taboolaRightRail) return adSettings.value.taboolaRightRail;
                    break;
                case 'footer':
                    if (adSettings.value.taboolaFooter) return adSettings.value.taboolaFooter;
                    break;
            }
        }

        return '';
    };

    const loadAdScripts = () => {
        if (adSettings.value.enableAds) {
            if (adSettings.value.enableAdSense && adSettings.value.enableAdSenseAutoAds && adSettings.value.adSenseAutoAdsCode) {
                const existingScript = document.getElementById('adsense-script');
                if (!existingScript) {
                    try {
                        const srcRegex = /src="([^"]+)"/;
                        const match = adSettings.value.adSenseAutoAdsCode.match(srcRegex);

                        if (match && match[1]) {
                            const scriptSrc = match[1];
                            const head = document.head;
                            const script = document.createElement('script');
                            script.id = 'adsense-script';
                            script.async = true;
                            script.src = scriptSrc;
                            script.crossOrigin = "anonymous";
                            head.appendChild(script);
                        }
                    } catch (e) {}
                }
            }

            if (adSettings.value.enableAdSense && window.adsbygoogle) {
                setTimeout(() => {
                    try {
                        document.querySelectorAll('.adsbygoogle').forEach((ad) => {
                            if (!ad.hasAttribute('data-adsbygoogle-status')) {
                                (window.adsbygoogle = window.adsbygoogle || []).push({});
                            }
                        });
                    } catch (e) {}
                }, 300);
            }
        }
    };

    const loadSidebarLeftAd = (containerRef: HTMLElement | null) => {
        if (!adSettings.value.enableAds || !containerRef) return;

        if (adSettings.value.adSenseSidebarLeft && containerRef) {
            try {
                setTimeout(() => {
                    if (!containerRef)
                        return;

                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = adSettings.value.adSenseSidebarLeft;

                    const insElement = tempDiv.querySelector('ins');

                    if (insElement && containerRef) {
                        containerRef.appendChild(insElement);

                        if (window.adsbygoogle) {
                            try {
                                window.adsbygoogle.push({});
                            } catch (e) {}
                        }
                    }
                }, 500);
            } catch (e) {}
        }
    };

    return {
        adSettings,
        getAdHtml,
        loadAdScripts,
        loadSidebarLeftAd
    };
};
