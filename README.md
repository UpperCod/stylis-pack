# stylis-pack

[Stylis](https://github.com/thysultan/stylis.js) is fast to preprocess CSS fragments, nested, associate prefix and minimize code. Stylis-pack simply adds a layer for managing asynchronous plugins before serialization to include module import support, asynchronous parsing in parallel, and utilities for CSS management, achieving a PostCss-like effect.

## Submodules

1. [stylis-pack/utils](./src/utils)
2. [stylis-pack/plugin-import](./src/plugins/plugin-import)

## Install

```bash
npm install stylis stylis-pack
```

## Usage

```js
import { serialize, stringify } from "stylis";
import path from "path";
import { readFile } from "fs/promises";
import { load } from "stylis-pack/load";
import { pluginImport } from "stylis-pack/plugin-import";

async function readCss(file) {
    const { css } = await load(
        {
            file,
            code: await readFile(file, "utf-8"),
        },
        [pluginImport({})]
    );
    return serialize(css, stringify);
}

readCss(path.join(process.cwd(), "./test/style.css")).then(console.log);
```
