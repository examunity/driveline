import React from 'react';
import App from './App';

const locale = 'en';
const isCrawler = false;

export default ({ req, res, render }) => {
  if (req.url === '/favicon.ico') {
    res.status(404).end();
    return;
  }

  render(<App />, {
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
