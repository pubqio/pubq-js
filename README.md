# PubQ JavaScript SDK

[PubQ](https://pubq.io) is a pub/sub channels cloud and this is the official JavaScript client library including both real-time and REST interfaces.

To meet PUBQ and see more info and examples, please read the [documentation](https://pubq.io/docs).

# Getting Started

Follow these steps to just start building with PubQ in JavaScript or see the [Quickstart guide](https://pubq.io/docs/getting-started/quickstart) which covers more programming languages.

## Install with package manager

Use any package manager like npm or yarn to install the JavaScript SDK.

Npm:

```bash
npm i pubq
```

Yarn:

```bash
yarn add pubq
```

Import as ES module:

```js
import { PubQ } from "pubq";
```

Import from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/pubq@latest/build/pubq.umd.js"></script>
```

## Interacting with PubQ

Get your API key from [PubQ dashboard](https://dashboard.pubq.io) by [creating a new project](https://dashboard.pubq.io/projects/create) or use existing one.

Connect to PubQ:

```js
const socket = new PubQ.Socket({ apiKey: "YOUR_API_KEY" });
```

Subscribe to a channel and listen for any data publishing to receive:

```js
let channel = socket.channels.get("my-channel");
channel.subscribe((message: any) => {
    console.log({ message });
});
```

Publish a message:

```js
channel.publish("Hello!");
```

Publish a message with REST interface:

```js
const rest = new PubQ.Rest({ apiKey: "YOUR_API_KEY" });

let channel = rest.channels.get("my-channel");

channel.publish("Hello!");
```

# Development

Please, read the [contribution guide](https://pubq.io/docs/basics/contribution).

## Install

```bash
git clone git@github.com:pubqio/pubq-js.git
cd ./pubq-js/
npm i
```

Make your changes.

## Build

To build commonjs, esm, and umd bundles, run:

```bash
npm run build
```
