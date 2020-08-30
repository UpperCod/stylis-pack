interface _Tree {
    tree: Object<string, any>;
    has(str: string): boolean;
    get(str: string): Value;
    add(src: string): void;
    graph(src: string): object;
    addChild(src: string, childSrc: string): void;
    getRoots(src: string, childSrc: string): void;
    remove(src: string): void;
}

interface _Rule {
    parent?: _Rule;
    children?: _Rule[];
    root: _Rule;
    type: string;
    props: string[];
    value: string;
    length: number;
    return: string;
    line?: number;
    column?: number;
}

interface _Root {
    file: string;
    code: string;
    css?: _Rule[];
    rootFile?: string;
    tree?: _Tree;
}

interface _PluginContext {
    addChild(src: string): void;
    load(root: _Root): Promise<_Rule[]>;
}

type _Plugin = (root: _Root, context: _PluginContext) => Promise<void> | null;

declare module "stylis-pack" {
    export type Rule = _Rule;
    export type Root = _Root;
    export type Plugin = _Plugin;
    export type PluginContext = _PluginContext;
}

declare module "stylis-pack/load" {
    export function load(
        root: _Root,
        plugins: _Plugin[],
        parallel?: object
    ): Promise<_Root>;
}

declare module "stylis-pack/plugin-import" {
    export interface Options {
        readFile?: (src: string) => Promise<string>;
    }
    export function pluginImport(options?: Options): _Plugin;
}

declare module "stylis-pack/utils" {
    export function replaceWith(rule: _Rule, rules: _Rule | _Rule[]): boolean;
    export function insertBefore(rule: _Rule, rules: _Rule | _Rule[]): boolean;
    export function insertAfter(rule: _Rule, rules: _Rule | _Rule[]): boolean;
    export function append(rule: _Rule, rules: _Rule | _Rule[]): boolean;
    export function prepend(rule: _Rule, rules: _Rule | _Rule[]): boolean;
    export function walkAtRule(
        rules: _Rule[],
        type: string,
        callback: (root: _Root) => Promise<void>
    );
    export function walk(
        rules: _Rule[],
        callback: (root: _Root) => Promise<void>
    );
}
