# Getting Started

## Install with package manager

Use any package manager like npm or yarn to install the library.

Npm:

```bash
npm i @pubq/pubq-js
```

Yarn:

```bash
yarn add @pubq/pubq-js
```

Import as ES6 module:

```js
const Pubq = require("@pubq/pubq-js");
```

Import from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@pubq/pubq-js@latest/dist/pubq.js"></script>
```

## Interacting with Pubq

Get your application key and id from [Pubq dashboard](https://dashboard.pubq.io) by [creating a new app](https://dashboard.pubq.io/applications/create) or use existing one.

Connect to Pubq:

```js
var pubq = new Pubq("YOU_APPLICATION_ID", "YOU_APPLICATION_KEY");
```

Subscribe a channel:

```js
let channel = pubq.subscribe("my-channel");
```

Listen for any data publish to receive:

```js
(async () => {
    for await (let data of channel) {
        console.log({ data });
    }
})();
```

# Development

## Install

```bash
git clone git@github.com:pubqio/pubq-js.git
cd ./pubq-js/
cp .env.example .env
npm i
```

## Build

```bash
npx webpack
```
