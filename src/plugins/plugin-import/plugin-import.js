import path from "path";
import { readFile } from "fs/promises";
import resolveCss from "resolve-css";
import { request } from "@uppercod/request";
import createCache from "@uppercod/cache";
import { compile } from "stylis";
import { walkAtRule, replaceWith } from "../../utils/utils";

const cache = createCache();
const isUrl = (file) => /^(http(s){0,1}:){0,1}\/\//.test(file);

const baseAtMedia = compile(`@media{}`);
/**
 *
 * @param {Object} [options]
 * @param {(src:string)=>Promise<string>} [options.readFile]
 * @returns {import("../../load").plugin}
 */

export function pluginImport(options) {
    options = {
        readFile: (src) => readFile(src, "utf-8"),
        ...options,
    };
    /**@type {import("../load").plugin} */
    return async (root, { load }) => {
        const { dir } = path.parse(root.file);
        await walkAtRule(root.css, "@import", async (rule) => {
            const test = rule.value.match(
                /@import\s+(?:"([^"]+)"|'([^']+)')\s*([^;]*);/
            );
            if (test) {
                const [, src1, src2, media = ""] = test;
                let code;
                let src = src1 || src2;
                if (isUrl(src)) {
                    [src, code] = await cache(request, src);
                } else {
                    [src, code] = await resolveCss(options.readFile, src, dir);
                }

                let css = await load({
                    file: src,
                    code,
                });

                if (media) {
                    const value = `@media ${media}`;
                    css = {
                        ...baseAtMedia,
                        //@ts-ignore
                        children: css,
                        props: [value],
                        value,
                    };
                }

                replaceWith(rule, css);
            }
        });
    };
}
