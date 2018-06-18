declare namespace Router {

    type PageHandler = (...params: string[]) => void;
    type QueryObject = {[props:string]: boolean | string};

    interface Route {
        rule: string | RegExp;
        handler: PageHandler;
        options?: PageOptions;
    }


    interface RouterOptions {
        routes?: Route[];
        mode?: "history" | "hash";
        root?: string;
        hooks?: {
            /**
             *
             * @param {Router.Page} page
             */
            before?: (page: Page) => void;

            /**
             *
             * @param {Router.Page} page
             * @returns {boolean}
             */
            secure?: (page: Page) => boolean;
        };
        /**
         *
         * @param {Router.Page} page
         */
        page404: (page: Page) => void;
    };

    interface PageOptions {
        unloadCb?: (async: boolean) => boolean | Promise<boolean>;
    }

    export class Router {

        routes: Route[];
        mode: "history" | "hash";
        root: string;
        beforeHook: () => void;
        securityHook: () => boolean;

        constructor(options?: RouterOptions);

        /**
         * Add route to routes list
         *
         * @param {string|RegExp} rule
         * @param {function} handler
         * @param {PageOptions} options
         * @returns {Router}
         */
        add(rule: string | RegExp, handler: PageHandler, options?: PageOptions): Router;

        /**
         * Remove a route from routes list
         *
         * @param params
         * @returns {Router}
         */
        remove(params: string | PageHandler):Router;

        /**
         * Reset the state of Router
         *
         * @returns {Router}
         */
        reset(): Router;

        /**
         * Check the URL and execute handler for its route
         *
         * @returns {Router}
         */
        check(): Router;

        /**
         * Add the URI listener
         *
         * @returns {Router}
         */
        addUriListener(): Router;

        /**
         * Remove the URI listener
         *
         * @returns {Router}
         */
        removeUriListener(): Router;

        /**
         * Navigate to a page
         *
         * @param {string} path
         * @param {object} state
         * @param {boolean} silent
         *
         * @returns {Router}
         */
        navigateTo(path: string, state?: any, silent?: boolean): Router;

        /**
         * Redirect to a page with replace state
         *
         * @param {string} path
         * @param {object} state
         * @param {boolean} silent
         *
         * @returns {Router}
         */
        redirectTo(path: string, state?: any, silent?: boolean): Router;

        /**
         * Refresh page with recall route handler
         *
         * @returns {Router}
         */
        refresh(): Router;

        /**
         * Go to a specific history page
         *
         * @param {number} count
         * @returns {Router}
         */
        go(count: number): Router;

        /**
         * Go Back in browser history
         * Simulate "Back" button
         *
         * @returns {Router}
         */
        back(): Router;

        /**
         * Go Forward in browser history
         * Simulate "Forward" button
         *
         * @returns {Router}
         */
        forward(): Router;
    }


    export class Page {
        uri: string;
        query: QueryObject;
        params: string[];
        state: any;
        options: PageOptions;

        /**
         *
         * @param {string} uri
         * @param {Router.QueryObject} query
         * @param {string[]} params
         * @param state
         * @param {Router.PageOptions} options
         */
        constructor(uri?: string, query?: QueryObject, params?: string[], state?: any, options?: PageOptions);
    }
}

