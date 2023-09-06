# PUBQ JavaScript SDK

[PUBQ](https://pubq.io) is a pub/sub channels cloud and this is the official JavaScript client library including both real-time and REST interfaces.

To meet PUBQ and see more info and examples, please read the [documentation](https://pubq.io/docs).

# Getting Started

Follow these steps to just start building with PUBQ in JavaScript or see the [Quickstart guide](https://pubq.io/docs/getting-started/quickstart) which covers more programming languages.

## Install with package manager

Use any package manager like npm or yarn to install the JavaScript SDK.

Npm:

```bash
npm i @pubq/pubq-js
```

Yarn:

```bash
yarn add @pubq/pubq-js
```

Import as ES module:

```js
import { RealTime, REST } from "@pubq/pubq-js";
```

Import from CDN:

```html
<!-- Import only pubq realtime interface -->
<script src="https://cdn.jsdelivr.net/npm/@pubq/pubq-js@latest/dist/pubq-realtime.js"></script>

<!-- Import only pubq rest interface -->
<script src="https://cdn.jsdelivr.net/npm/@pubq/pubq-js@latest/dist/pubq-rest.js"></script>

<!-- Or Import both pubq realtime and rest interfaces -->
<script src="https://cdn.jsdelivr.net/npm/@pubq/pubq-js@latest/dist/pubq-all.js"></script>
```

## Interacting with PUBQ

Get your application API key from [PUBQ dashboard](https://dashboard.pubq.io) by [creating a new app](https://dashboard.pubq.io/applications/create) or use existing one.

Connect to PUBQ:

```js
const realtime = new RealTime("YOUR_API_KEY");
```

Subscribe a channel:

```js
let channel = realtime.subscribe("my-channel");
```

Listen for any data publish to receive:

```js
(async () => {
    for await (let data of channel) {
        console.log({ data });
    }
})();
```

Publish a message with REST interface:

```js
const rest = new REST("YOUR_API_KEY");

rest.publish("my-channel", "Hello!");
```

# Development

Please, read the [contribution guide](https://pubq.io/docs/basics/contribution).

## Install

```bash
git clone git@github.com:pubqio/pubq-js.git
cd ./pubq-js/
npm i
```

## Build

To build umd bundles, run:

```bash
npx webpack
```
