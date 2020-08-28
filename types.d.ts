import { Element } from "stylis";
import { Context } from "@uppercod/imported";

type _Plugin = (root: _Root, context: _Context) => Promise<void> | null;

interface _Context {
    load(root: _Root): Promise<Element[]>;
}

interface _Root {
    file: string;
    code: string;
    css?: Element[];
    rootFile?: string;
    tree?: Context;
}

declare module "stylis-pack" {
    export type Root = _Root;
    export type Context = _Context;
    export type Plugin = _Plugin;
    export function load(
        root: Root,
        plugins: Plugin[],
        parallel?: object
    ): Promise<Root>;
}

declare module "stylis-pack/plugin-import" {
    export interface Options {
        readFile?: (src: string) => Promise<string>;
    }
    export function pluginImport(options: Options): _Plugin;
}

declare module "stylis-pack/utils" {
    export function replaceWith(
        rule: Element,
        rules: Element | Element[]
    ): boolean;
    export function insertBefore(
        rule: Element,
        rules: Element | Element[]
    ): boolean;
    export function insertAfter(
        rule: Element,
        rules: Element | Element[]
    ): boolean;
    export function append(rule: Element, rules: Element | Element[]): boolean;
    export function prepend(rule: Element, rules: Element | Element[]): boolean;

    export function walkAtRule(
        rules: Element[],
        type: string,
        callback: (root: _Root) => Promise<void>
    );
    export function walk(
        rules: Element[],
        callback: (root: _Root) => Promise<void>
    );
}
