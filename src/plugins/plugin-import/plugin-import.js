import path from "path";
import { readFile } from "fs/promises";
import { request } from "@uppercod/request";
import createCache from "@uppercod/cache";
import { walkAtRule, replaceWith } from "../../utils/utils";

const cache = createCache();
const isUrl = (file) => /^(http(s){0,1}:){0,1}\/\//.test(file);

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
        const context = {};
        const { dir } = path.parse(root.file);
        await walkAtRule(root.css, "@import", async (rule) => {
            const test = rule.value.match(
                /@import\s+(?:"([^"]+)"|'([^']+)')([^;]*);/
            );
            if (test) {
                const [, src1, src2, media = ""] = test;
                let code;
                let src = src1 || src2;
                if (isUrl(src)) {
                    [src, code] = await cache(request, src);
                } else {
                    [src, code] = await localResolve(
                        options.readFile,
                        dir,
                        src
                    );
                }

                const css = await load({
                    file: src,
                    code,
                });

                replaceWith(rule, css);
            }
        });
    };
}
/**
 *
 * @param {(src:string)=>Promise<string>} readFile
 * @param {string} dir
 * @param {string} src
 */
async function localResolve(readFile, dir, src) {
    try {
        src = path.join(dir, src);
        return [src, await readFile(src)];
    } catch (e) {
        const test = src.match(/(?:(@\w+\/[^\/]+)|([^\/]+))(.*)/);

        if (test) {
            const [, name1, name2, folder] = test;

            let md;
            try {
                md = require.resolve(src);
            } catch (e) {
                md = require.resolve(name1 || name2);
            }

            const { dir, ext, base } = path.parse(md);

            const nextSrc = path.join(
                dir,
                ext == ".css" ? base : folder.endsWith(".css") ? folder : base
            );

            return [nextSrc, await readFile(nextSrc)];
        }
    }
}
