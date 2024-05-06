import ReactDOMClient from 'react-dom/client';
import { loadableReady as ready } from '@loadable/component';

const rootTag = document.getElementById('root');

const ssr = rootTag && rootTag.firstChild;

if (!ssr) {
  // eslint-disable-next-line no-console
  console.warn('Driveline Client: React server side rendering is not in use.');
}

// define render function for hydrate function
const render = (element) => {
  if (ssr) {
    ready(() => {
      ReactDOMClient.hydrateRoot(rootTag, element);
    });
  } else {
    ReactDOMClient.createRoot(rootTag).render(element);
  }
};

// eslint-disable-next-line no-underscore-dangle
const data = window.__DRIVELINE_DATA__;

// get hydrate function and hydrate
// eslint-disable-next-line import/no-unresolved
const hydrate = require('@@entry').default;

hydrate({ render, ready, rootTag, ssr, data });
