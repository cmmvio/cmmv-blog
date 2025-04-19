import { RouteRecordRaw } from 'vue-router';

/**
 * Merge multiple router configurations, combining their routes
 *
 * @param baseRoutes The main/base router routes
 * @param additionalRoutesArray Array of additional router configurations to merge
 * @returns Merged router configuration
 */
export function mergeRouterConfigurations(
    baseRoutes: RouteRecordRaw[],
    ...additionalRoutesArray: RouteRecordRaw[][]
): RouteRecordRaw[] {
    const mergedRoutes = JSON.parse(JSON.stringify(baseRoutes)) as RouteRecordRaw[];

    for (const additionalRoutes of additionalRoutesArray) {
        for (const newRoute of additionalRoutes) {
            const existingRouteIndex = mergedRoutes.findIndex((route: RouteRecordRaw) => route.path === newRoute.path);

            if (existingRouteIndex === -1) {
                mergedRoutes.push(newRoute);
            } else {
                const existingRoute = mergedRoutes[existingRouteIndex];

                if (existingRoute.children && newRoute.children) {
                    existingRoute.children = mergeRouterConfigurations(
                        existingRoute.children,
                        newRoute.children
                    );
                } else if (newRoute.children) {
                    existingRoute.children = newRoute.children;
                }

                if (newRoute.name) existingRoute.name = newRoute.name;
                if (newRoute.component) existingRoute.component = newRoute.component;
                if (newRoute.components) existingRoute.components = newRoute.components;
                if (newRoute.redirect) existingRoute.redirect = newRoute.redirect;
                if (newRoute.props) existingRoute.props = newRoute.props;
                if (newRoute.meta) existingRoute.meta = { ...existingRoute.meta, ...newRoute.meta };
            }
        }
    }

    return mergedRoutes;
}

/**
 * Utility to specifically merge plugin routes into the main admin router
 * This is useful for plugins that want to add their routes to the admin panel
 *
 * @param mainRouter The main admin router configuration
 * @param pluginRouters Plugin router configurations to merge
 * @returns Combined router configuration
 */
export function mergePluginRoutes(
    mainRouter: RouteRecordRaw[],
    pluginRouters: RouteRecordRaw[] | RouteRecordRaw[][]
): RouteRecordRaw[] {
    const normalizedPluginRouters: RouteRecordRaw[][] = Array.isArray(pluginRouters) &&
        !('path' in pluginRouters[0]) ?
        pluginRouters as RouteRecordRaw[][] :
        [pluginRouters as RouteRecordRaw[]];

    const adminLayoutRoute = mainRouter.find(route =>
        route.path === '/' && route.children && route.children.length > 0
    );

    if (!adminLayoutRoute) {
        console.warn('Admin layout route not found, adding plugin routes as top-level routes');
        return [...mainRouter, ...normalizedPluginRouters.flat()];
    }

    normalizedPluginRouters.forEach(pluginRouter => {
        const pluginLayouts = pluginRouter.find(route =>
            route.path === '/' && route.children && route.children.length > 0
        );

        if (pluginLayouts && pluginLayouts.children) {
            adminLayoutRoute.children = mergeRouterConfigurations(
                adminLayoutRoute.children || [],
                pluginLayouts.children
            );
        } else {
            adminLayoutRoute.children = mergeRouterConfigurations(
                adminLayoutRoute.children || [],
                pluginRouter
            );
        }
    });

    return mainRouter;
}

export const useRouter = () => {
    return {
        mergeRouterConfigurations,
        mergePluginRoutes
    };
};


