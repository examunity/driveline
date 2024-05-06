import ReactDOMServer from 'react-dom/server';
import { ChunkExtractor } from '@loadable/server';
import path from 'path';
import paths from '../config/paths';

const ROOT = Symbol('REACT_TRANSPORTER_ROOT');
const SCRIPTS = Symbol('REACT_TRANSPORTER_SCRIPTS');

function createHtml(loadableExtractor, data) {
  function html(strings, ...values) {
    return ({ onWrite, onRoot }) => {
      let buffer = '';

      for (let i = 0; i < strings.length; i += 1) {
        const string = strings[i];
        const value = values[i] || '';

        buffer += string;

        switch (value) {
          case ROOT: {
            buffer += '<div id="root">';
            onWrite(buffer);
            onRoot();
            buffer = '</div>';
            break;
          }
          case SCRIPTS: {
            if (data) {
              const serialized = data.replace(/</g, '\\u003c');
              buffer += `<script>window.__DRIVELINE_DATA__ = ${serialized};</script>`;
            }
            buffer += loadableExtractor.getScriptTags();
            break;
          }
          default: {
            buffer += typeof value === 'function' ? value() : value;
          }
        }
      }

      onWrite(buffer);
    };
  }

  html.root = ROOT;
  html.scripts = SCRIPTS;

  return html;
}

export default (req, res) => {
  // define render, redirect and error function for hydrate function
  const render = (element, config) => {
    if (!config.document) {
      throw new Error('Driveline: "document" must be set on render() config.');
    }

    const entryFolder = process.env.NODE_ENV === 'development' ? 'dev' : 'prod';
    const statsFile = path.join(
      paths.appCache,
      entryFolder,
      'loadable-stats.json',
    );
    const loadableExtractor = new ChunkExtractor({ statsFile });
    const root = loadableExtractor.collectChunks(element);

    const html = createHtml(loadableExtractor, config.data);
    const write = config.document(html);

    res.statusCode = 200;
    res.setHeader('content-type', 'text/html');

    if (!config.ssr) {
      write({
        onWrite(buffer) {
          res.write(buffer);
        },
        onRoot() {},
      });

      res.end();
      return;
    }

    let hasShellError = false;

    const stream = ReactDOMServer.renderToPipeableStream(root, {
      onShellReady() {
        if (!config.stream) {
          return;
        }

        write({
          onWrite(buffer) {
            res.write(buffer);
          },
          onRoot() {
            stream.pipe(res);
          },
        });
      },
      onAllReady() {
        if (config.stream || hasShellError) {
          return;
        }

        write({
          onWrite(buffer) {
            res.write(buffer);
          },
          onRoot() {
            stream.pipe(res);
          },
        });
      },
      onShellError() {
        hasShellError = true;

        // Do not server side render page after error and try again on client.
        write({
          onWrite(buffer) {
            res.write(buffer);
          },
          onRoot() {},
        });

        res.end();
      },
      onError(err) {
        // eslint-disable-next-line no-console
        console.error(err);
      },
    });
  };

  // get hydrate function and hydrate
  // eslint-disable-next-line global-require, import/no-unresolved, import/no-dynamic-require
  const hydrate = require('@@entry').default;

  hydrate({ render, req, res });
};
