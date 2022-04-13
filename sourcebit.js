const fs = require('fs');
const path = require('path');
const { cssClassesFromUrlPath, getPageUrl } = require('./src/utils/page-utils');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    plugins: [
        /**
         * The `sourcebit-source-contentful` plugin pulls entries from contentful using the provided credentials,
         * and generates an array of objects that are passed to subsequent plugins.
         */
        {
            module: require('sourcebit-source-contentful'),
            options: {
                /**
                 * accessToken ( Personal Access Token )
                 *
                 * The accessToken is also referred to as the Personal Access Token and can be generated in Contentful in several places.
                 * 1. It can be found in User Account Settings > Tokens > Personal Access Tokens - https://app.contentful.com/account/profile/cma_tokens
                 * 2. It can be found in Contentful Space Settings > API Keys > Content management tokens tab > Generate personal token - https://app.contentful.com/spaces/<space-id>/api/cma_tokens
                 *
                 * The accessToken can be used instead of the deliveryToken & previewToken. If the other keys are not found it will generate them.
                 * can be used to run `npm run build` and `npm run dev`
                 * must be used to import/export data using `./contentful/import.js` and `./contentful/export.js`
                 **/
                accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,

                // deliveryToken is found in the Contentful Space Settings > API Keys > Content delivery / preview tokens > Content Delivery API - access token
                // can be used to run `npm run build`
                deliveryToken: process.env.CONTENTFUL_DELIVERY_TOKEN,

                // previewToken is found in Contentful Space Settings > API Keys > Content delivery / preview tokens > Content Preview API - access token
                // can be used to run `npm run dev`
                previewToken: process.env.CONTENTFUL_PREVIEW_TOKEN,

                // spaceId is found in Contentful Space Settings > General settings > Space ID
                spaceId: process.env.CONTENTFUL_SPACE_ID,
                environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
                preview: isDev,
                watch: isDev,
                host: isDev ? 'preview.contentful.com' : undefined
            }
        },

        // middleware to save ThemeStyle objects in filesystem for use with tailwind.
        {
            module: {
                transform: ({ data }) => {
                    data.objects.find((object) => {
                        if (object.__metadata.modelName === 'ThemeStyle') {
                            const dirname = path.join(__dirname, 'content/data');
                            if (!fs.existsSync(dirname)) {
                                fs.mkdirSync(dirname, { recursive: true });
                            }
                            fs.writeFileSync(path.join(dirname, 'style.json'), JSON.stringify(object, null, 4));
                            return true;
                        }
                    });
                    return data;
                }
            }
        },

        /**
         * The `sourcebit-target-next` plugin receives objects generated by `sourcebit-source-contentful` plugin,
         * and generates new data that is consumed by Next.js `getStaticPaths` and `getStaticProps` methods.
         * The generated data is cached and stored inside `.sourcebit-nextjs-cache.json` file.
         *
         * The generated data is an object with three properties:
         * - objects: Array of objects representing all content entries loaded by the `sourcebit-source-contentful` plugin.
         * - pages: Array of objects representing site pages props. This array is generated by the `pages()` method.
         * - props: Object with common props that will be merged with props of every page. This object is generated by
         *          the `commonProps()` method.
         */
        {
            module: require('sourcebit-target-next'),
            options: {
                liveUpdate: isDev,
                flattenAssetUrls: true,
                commonProps: (objects) => {
                    const site = objects.find((page) => page.__metadata.modelName === 'Config');
                    return { site };
                },
                pages: (objects) => {
                    const pageObjects = objects.filter((page) => ['PageLayout', 'PostFeedLayout', 'PostLayout'].includes(page.__metadata.modelName));
                    const pages = pageObjects.map((page) => {
                        const { __metadata, ...restProps } = page;
                        const urlPath = getPageUrl(page);
                        return {
                            __metadata: {
                                ...__metadata,
                                urlPath,
                                pageCssClasses: cssClassesFromUrlPath(urlPath)
                            },
                            ...restProps
                        };
                    });

                    return [...pages];
                }
            }
        }
    ]
};
