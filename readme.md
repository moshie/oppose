# Oppose

Oppose captures screenshots of internal website pages and compares them for differences


### Capture Options

```js
{
    environments: { live: 'http://google.com/', test: 'http://test.google.com/' },
    directory: path.join(process.cwd(), 'screenshots'),

    cluster: {
        maxConcurrency: 2,
        retryLimit: 0
    },

    browser: {
        width: 800,
        height: 600,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        isLandscape: false,
    },

    screenshot: {
        fullPage: true,
        type: 'png',
        // quality: 100,
        // clip: {},
        omitBackground: false,
    }
}
```