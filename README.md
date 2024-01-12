# PUBQ JavaScript SDK

[PUBQ](https://pubq.io) is a pub/sub channels cloud and this is the official JavaScript client library including both real-time and REST interfaces.

To meet PUBQ and see more info and examples, please read the [documentation](https://pubq.io/docs).

# Getting Started

Follow these steps to just start building with PUBQ in JavaScript or see the [Quickstart guide](https://pubq.io/docs/getting-started/quickstart) which covers more programming languages.

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
import { Pubq } from "pubq";
```

Import from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/pubq@latest/build/browser/pubq.min.js"></script>
```

## Interacting with PUBQ

Get your application API key from [PUBQ dashboard](https://dashboard.pubq.io) by [creating a new app](https://dashboard.pubq.io/applications/create) or use existing one.

Connect to PUBQ:

```js
const realtime = new Pubq.RealTime({ key: "YOUR_API_KEY" });
```

Subscribe to a channel and listen for any data publishing to receive:

```js
let channel = realtime.channels.get("my-channel");
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
const rest = new Pubq.REST({ key: "YOUR_API_KEY" });

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
npm run build
```
