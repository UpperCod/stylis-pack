'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils = require('./utils.js');
var path = require('path');
var promises = require('fs/promises');
var request = require('@uppercod/request');
var createCache = require('@uppercod/cache');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var createCache__default = /*#__PURE__*/_interopDefaultLegacy(createCache);

const cache = createCache__default['default']();
const isUrl = (file) => /^(http(s){0,1}:){0,1}\/\//.test(file);

/**
 *
 * @param {Object} [options]
 * @param {(src:string)=>Promise<string>} [options.readFile]
 * @returns {import("../../load").plugin}
 */

function pluginImport(options) {
    options = {
        readFile: (src) => promises.readFile(src, "utf-8"),
        ...options,
    };
    /**@type {import("../load").plugin} */
    return async (root, { load }) => {
        const { dir } = path__default['default'].parse(root.file);
        await utils.walkAtRule(root.css, "@import", async (rule) => {
            const test = rule.value.match(
                /@import\s+(?:"([^"]+)"|'([^']+)')([^;]*);/
            );
            if (test) {
                const [, src1, src2, media = ""] = test;
                let code;
                let src = src1 || src2;
                if (isUrl(src)) {
                    [src, code] = await cache(request.request, src);
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

                utils.replaceWith(rule, css);
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
        src = path__default['default'].join(dir, src);
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

            const { dir, ext, base } = path__default['default'].parse(md);

            const nextSrc = path__default['default'].join(
                dir,
                ext == ".css" ? base : folder.endsWith(".css") ? folder : base
            );

            return [nextSrc, await readFile(nextSrc)];
        }
    }
}

exports.pluginImport = pluginImport;
//# sourceMappingURL=plugin-import.js.map
