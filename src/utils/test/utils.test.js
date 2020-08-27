import test from "ava";
import { compile } from "stylis";
import {
    replaceWith,
    insertBefore,
    insertAfter,
    append,
    prepend,
    walk,
} from "../utils";

const css = `
    @root{
        a{color:red}
        b{color:tomato}
        c{color:black}
    }
`;

test("replaceWith", (t) => {
    const [root] = compile(css);

    const [button] = compile(`x{color:teal}`);

    const children = [...root.children];

    replaceWith(root.children[1], button);

    children[1] = button;

    t.deepEqual(children, root.children);
});

test("insertBefore", (t) => {
    const [root] = compile(css);
    const [button] = compile(`x{color:teal}`);

    const children = [
        ...root.children.slice(0, 1),
        button,
        ...root.children.slice(1),
    ];

    insertBefore(root.children[1], button);

    t.deepEqual(children, root.children);
});

test("insertAfter", (t) => {
    const [root] = compile(css);
    const [button] = compile(`x{color:teal}`);

    const children = [
        ...root.children.slice(0, 2),
        button,
        ...root.children.slice(2),
    ];

    insertAfter(root.children[1], button);

    t.deepEqual(children, root.children);
});

test("append", (t) => {
    const [root] = compile(css);
    const [button] = compile(`x{color:teal}`);

    const children = [...root.children, button];

    append(root.children[1], button);

    t.deepEqual(children, root.children);
});

test("prepend", (t) => {
    const [root] = compile(css);
    const [button] = compile(`x{color:teal}`);

    const children = [button, ...root.children];

    prepend(root.children[1], button);

    t.deepEqual(children, root.children);
});

test("walk", async (t) => {
    const [root] = compile(css);
    const rules = [];

    await walk(root.children, (rule) => {
        rules.push(rule);
    });

    t.deepEqual(rules, root.children);
});
