import { Element } from "stylis";
import { Context } from "@uppercod/imported";

type RootPlugin = (
    root: RootRoot,
    context: RootContext
) => Promise<void> | null;

interface RootContext {
    load(root: RootRoot): Promise<Element[]>;
}

interface RootRoot {
    file: string;
    code: string;
    css?: Element[];
    rootFile?: string;
    tree?: Context;
}

declare module "stylis-pack" {
    export type Root = RootRoot;
    export type Context = RootContext;
    export type Plugin = RootPlugin;
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
    export function pluginImport(options: Options): RootPlugin;
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
        callback: (root: RootRoot) => Promise<void>
    );
    export function walk(
        rules: Element[],
        callback: (root: RootRoot) => Promise<void>
    );
}
