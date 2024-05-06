import ReactDOMServer from 'react-dom/server';
import { AppRegistry } from 'react-native-web';
import App from './App';

const locale = 'en';
const isCrawler = false;

export default ({ req, res, render }) => {
  if (req.url === '/favicon.ico') {
    res.status(404).end();
    return;
  }

  // register the app
  AppRegistry.registerComponent('App', () => App);

  // prerender the app
  const { element, getStyleElement } = AppRegistry.getApplication('App', {
    initialProps: {},
  });

  // styles (optionally include a nonce if your CSP policy requires it)
  // note that styles is a function, so that the styles are created lazily.
  const styles = () => ReactDOMServer.renderToStaticMarkup(getStyleElement());

  render(element, {
    ssr: true,
    stream: !isCrawler,
    document(html) {
      return html`<!DOCTYPE html>
        <html lang="${locale}">
          <head>
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />

            <title>Driveline App</title>

            <style>
              /* These styles make the body full-height */
              html,
              body {
                height: 100%;
              }
              /* These styles disable body scrolling if you are using <ScrollView> */
              body {
                overflow: hidden;
              }
              /* These styles make the root element full-height */
              #root {
                display: flex;
                height: 100%;
              }
            </style>
            ${styles}
          </head>
          <body>
            <!-- root -->
            ${html.root}

            <!-- scripts -->
            ${html.scripts}
          </body>
        </html>`;
    },
  });
};
