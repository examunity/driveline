# Driveline

If you are looking for a fully featured React framework, there are better options available compared to Driveline, such as Next.js or Remix. However, if you only want the bare minimum to quickly start a new React app with server side rendering, Driveline could be a suitable choice for you.

## Installation

```shell
npm install driveline
# or
yarn add driveline
```

## Commands

Once the project is set up (see [project structure](#project-structure)), you can use the following three commands to develop, build and run the application:

### `driveline dev`

Run `driveline dev` to start the development server. This is all you need for development.

| Option       | Description                                      |
| ------------ | ------------------------------------------------ |
| `-h, --host` | The host of the server, defaults to `localhost`. |
| `-p, --port` | The port of the server, defaults to `3000`.      |

### `driveline build`

Run `driveline build` to create a new bundle.

| Option          | Description                    |
| --------------- | ------------------------------ |
| `--server-only` | Only create the server bundle. |
| `--client-only` | Only create the client bundle. |

### `driveline start`

Run `driveline start` after running `driveline build` to start the production server.

| Option       | Description                                      |
| ------------ | ------------------------------------------------ |
| `-h, --host` | The host of the server, defaults to `localhost`. |
| `-p, --port` | The port of the server, defaults to `3000`.      |

## Project structure

Each Driveline app has an app directory. The app directory must include the `client.js` and `server.js` entry files. `server.js` is the entry point on the server side, while `client.js` is the entry point on the client side. Furthermore all other app related files like React components should be placed in the app directory. In the public folder you can place assets that should be publicy available.

In addition configuration files can be placed in the project root directory. The `babel.config.js` file is the only required file. It is recommended to use the Babel `driveline` preset. The ESLint `driveline` config can be used for any ESLint config files like `.eslintrc.js` or `eslint.config.js` (new format). Optionally a `server.config.js` file can be created to configure the app server.

Here is the full file structure of a Driveline app:

```
app/
├─ client.js
├─ server.js
public/
babel.config.js
eslint.config.js (optional)
server.config.js (optional)
```

### `server.js` entry

The `server.js` must export a function that has a `server` object as argument with the following properties:

| Property | Type                                                    | Description                                                                                                                                                                                           |
| -------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| req      | Request                                                 | The Express.js request object                                                                                                                                                                         |
| res      | Response                                                | The Express.js response object                                                                                                                                                                        |
| render   | (element: ReactElement, options: RenderOptions) => void | The `render` function needs to be called to render the app on the server. The first parameter is the root element to render the app. See [examples](https://github.com/examunity/driveline/examples). |

The following render options are possible on the `RenderOptions` object:

| Option   | Type                                        | Description                                                                                                                                                                                           |
| -------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ssr      | boolean                                     | Should server side rendering be used? (default `true`)                                                                                                                                                |
| stream   | boolean                                     | Should React streaming be used? (default `false`)                                                                                                                                                     |
| data     | any \| () => any                            | Any data that should be passed to the client. You can pass a function if you want to resolve the data after rendering.                                                                                |
| document | (html: HTMLTemplateCreator) => HTMLTemplate | The `html` parameter must be used to define the html template. Also `html.root` and `html.scripts` must be used within the template. See [examples](https://github.com/examunity/driveline/examples). |

Minimal example:

```jsx
export default (server) => {
  server.render(<App />, {
    document: html`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <title>Driveline App</title>
        </head>
        <body>
          <!-- root -->
          ${html.root}

          <!-- scripts -->
          ${html.scripts}
        </body>
      </html>`,
  });
};
```

### `client.js` entry

The `client.js` file must export a function that has a `client` object as argument with the following properties:

| Property | Type                            | Description                                                                                                                                                                                           |
| -------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rootTag  | HTMLElement                     | The DOM root element                                                                                                                                                                                  |
| data     | any                             | The data passed to the client by the server render options.                                                                                                                                           |
| ready    | (() => void) => void            | The `ready` function waits until the app is ready. You don't need it when using `render`, but it is useful if you provide your own rendering logic.                                                   |
| render   | (element: ReactElement) => void | The `render` function needs to be called to render the app on the client. The first parameter is the root element to render the app. See [examples](https://github.com/examunity/driveline/examples). |

Minimal example:

```jsx
export default (client) => {
  client.render(<App />);
};
```

### `server.config.js` config

In most cases you do not need a `server.config.js`, but if you want to use an alternative host or port, you can create one. The configuration file can have the following options:

| Option  | Type                               | Description                                      |
| ------- | ---------------------------------- | ------------------------------------------------ |
| host    | string                             | The host of the server, defaults to `localhost`. |
| port    | number                             | The port of the server, defaults to `3000`.      |
| proxies | { path: string, target: string }[] | Array of proxies defined by path and target.     |

Example:

```js
module.exports = {
  host: 'localhost',
  port: 3000,
  proxies: [
    {
      path: '/api',
      target: 'http://localhost:8000',
    },
  ],
};
```

## Examples

Please have a look at the [examples](https://github.com/examunity/driveline/examples) folder for a basic example and also examples with Typescript and Expo.

## Code splitting

Driveline implements [@loadable/component](https://github.com/gregberge/loadable-components) under the hood and provides a `lazy` function for code splitting. `lazy` needs to be used in conjunction with `Suspense` and should be used over React's `lazy` export for the best performance.

```jsx
import React, { Suspense } from 'react';
import lazy from 'driveline/lazy';
import Loading from './Loading';

const Chunk = lazy(() => import('./Chunk'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Chunk />
    </Suspense>
  );
}

export default App;
```

## Acknowledgment

This package is inspired by [Create React App](https://github.com/facebook/create-react-app) and [Razzle](https://github.com/jaredpalmer/razzle). Thanks for these awesome packages! 🙏

## License

This package is released under the [MIT License](LICENSE).
