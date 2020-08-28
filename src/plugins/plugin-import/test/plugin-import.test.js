import path from "path";
import { readFile } from "fs/promises";
import { serialize, stringify } from "stylis";
import test from "ava";
import { load } from "../../../load";
import { pluginImport } from "../plugin-import";

test("pluginImport", async (t) => {
    const file = path.join(__dirname, "./style/a.css");
    const data = await load(
        {
            file,
            code: await readFile(file, "utf-8"),
        },
        [pluginImport()]
    );
    t.is(
        serialize(data.css, stringify),
        `@media (max-width: 520px){c{color:red;}}b{color:red;}a{color:red;}`
    );
});
