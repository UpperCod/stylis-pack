import path from "path";
import { readFile } from "fs/promises";
import resolveCss from "resolve-css";
import { request } from "@uppercod/request";
import createCache from "@uppercod/cache";
import { compile } from "stylis";
import { walkAtRule, walk, replaceWith } from "../../utils/utils";

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
        const alias = {};
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
                    const testAlias = media.match(/(?:as\s*:\s*(\w+)\s*)/);

                    if (testAlias) {
                        const [, space] = testAlias;

                        //@ts-ignore
                        css.forEach(({ type, props, children }) => {
                            if (type == "rule") {
                                props.map((selector) => {
                                    if (selector.startsWith(".")) {
                                        const id = space + selector;
                                        alias[id] = (alias[id] || []).concat(
                                            children
                                        );
                                    }
                                });
                            }
                        });
                        css = [];
                    } else {
                        const value = `@media ${media}`;
                        css = {
                            ...baseAtMedia,
                            //@ts-ignore
                            children: css,
                            props: [value],
                            value,
                        };
                    }
                }

                replaceWith(rule, css);
            }
        });

        if (Object.keys(alias).length) {
            await walkAtRule(root.css, "@use", (atrule) => {
                const { parent } = atrule;
                atrule.value
                    .replace(/@use\s*(.+)\s*;/, "$1")
                    .split(/\s+/)
                    .map((id) => {
                        if (alias[id]) {
                            parent.children = alias[id].concat(parent.children);
                        }
                    });
            });
        }
    };
}
