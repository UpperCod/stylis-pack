# stylis-pack/plugin-import

This plugin allows the import of local or remote CSS modules.

## Example

```js
import { serialize, stringify } from "stylis";
import { pluginImport } from "stylis-pack/plugin-import";

const { css } = await load(
    {
        file: "my.css",
        code: `
            @import "http://unpkg.com/mycss";
            @import "./mycss";
            @import "@css/mycss";
        `,
    },
    [pluginImport({})]
);

serialize(css, stringify);
```
