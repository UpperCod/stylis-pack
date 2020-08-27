import test from "ava";
import { compile } from "stylis";
import { load } from "../load";

const css = `
    a{color:red}
    b{color:tomato}
    c{color:black}
`;

test("load", async (t) => {
    const rules = compile(css);
    const file = "my.css";
    const data = await load({
        file,
        code: css,
    });

    t.deepEqual(
        rules,
        /**
         * load creates a virtual scope to hold the mutation on the rules
         * without parent, to make a comparison you must remove root and parent
         * in this way equality is maintained.
         */
        data.css.map((rule) => {
            rule.root = rule.parent = null;
            return rule;
        })
    );

    t.is(data.file, file);
    t.is(data.rootFile, file);
});
