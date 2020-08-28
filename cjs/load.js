'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var stylis = require('stylis');
var createTree = require('@uppercod/imported');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var createTree__default = /*#__PURE__*/_interopDefaultLegacy(createTree);

/**
 * Create a queue of plugins that access a root object,
 * this object allows you to declare one read per file
 * and share cache between readings
 * @param {root} data
 * @param {plugin[]} plugins
 * @param {parallel} [parallel]
 * @returns {Promise<root>}
 */
function load(data, plugins = [], parallel = {}) {
    if (!data.tree) {
        data.tree = createTree__default['default']();
        data.tree.add(data.file);
        data.rootFile = data.file;
    }
    return (parallel[data.file] =
        parallel[data.file] || map(data, plugins, parallel));
}
/**
 *
 * @param {root} data
 * @param {plugin[]} plugins
 * @param {parallel} parallel
 */
function map(data, plugins, parallel) {
    /**
     * Root is only for local use to keep the mutations
     * associated with a root node.
     */
    const [root] = stylis.compile(`@root{${data.code}}`);
    /**
     * Create root access to keep the mutation on the root,
     * This node is the only one without parent and root
     */
    if (!data.root) data.root = root;
    /**
     * An asynchronous pipe is generated, parallel processes
     * are only allowed from a plugin.
     * In this way the mutation can be controlled without
     * problems by collision of parallel references
     */
    return plugins
        .reduce(
            (pipe, plugin) =>
                pipe.then(async () => {
                    /**
                     * The context allows inheriting the main data
                     * and associate a root dependency through data.tree
                     * @type {context}
                     **/
                    const context = {
                        load: (nextData) => {
                            data.tree.addChild(data.file, nextData.file);
                            return load(
                                { ...data, ...nextData },
                                [plugin],
                                parallel
                            ).then(({ css }) => css);
                        },
                    };
                    await plugin({ ...data, css: root.children }, context);
                }),
            Promise.resolve()
        )
        .then(() => ({
            ...data,
            // the css is a reference from root.children
            css: root.children,
        }));
}

/**
 * @typedef {{[src:string]:Promise<root>}} parallel
 */

/**
 * @typedef {import("stylis").Element} css
 */

/**
 * @typedef {Object} root
 * @property {string} file
 * @property {string} code
 * @property {css[]|string} [css]
 * @property {string} [rootFile]
 * @property {css} [root]
 * @property {import("@uppercod/imported").Context} [tree]
 */

/**
 * @typedef {(root:root)=>Promise<css[]|string>} subLoad
 */

/**
 * @typedef {(root:root,context:context)=>Promise<void>|null} plugin
 */

/**
 * @typedef {Object} context
 * @property {subLoad} load
 */

exports.load = load;
//# sourceMappingURL=load.js.map
