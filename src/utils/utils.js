/**
 *
 * @param {Rule} rule
 * @param {Rule|Rule[]} rules
 */
export function replaceWith(rule, rules) {
    const { children } = rule.parent;
    const position = children.indexOf(rule);
    if (position > -1) {
        rule.parent.children = children
            .slice(0, position)
            .concat(rules)
            .concat(children.slice(position + 1));
        return true;
    }
}
/**
 *
 * @param {Rule} rule
 * @param {Rule|Rule[]} rules
 */
export function insertBefore(rule, rules) {
    const { children } = rule.parent;
    const position = children.indexOf(rule);
    if (position > -1) {
        rule.parent.children = children
            .slice(0, position)
            .concat(rules)
            .concat(children.slice(position));
        return true;
    }
}
/**
 *
 * @param {Rule} rule
 * @param {Rule|Rule[]} rules
 */
export function insertAfter(rule, rules) {
    const { children } = rule.parent;
    const position = children.indexOf(rule);
    if (position > -1 && children[position + 1]) {
        return insertBefore(children[position + 1], rules);
    }
}
/**
 *
 * @param {Rule} rule
 * @param {Rule|Rule[]} rules
 */
export function append(rule, rules) {
    rule.parent.children.push(...[].concat(rules));
    return true;
}
/**
 *
 * @param {Rule} rule
 * @param {Rule|Rule[]} rules
 */
export function prepend(rule, rules) {
    rule.parent.children.unshift(...[].concat(rules));
    return true;
}
/**
 *
 * @param {Rule[]} rules
 * @param {string} type
 * @param {walkCallback} callback
 */
export function walkAtRule(rules, type, callback) {
    return walk(
        rules.filter((rule) => type == rule.type),
        callback
    );
}
/**
 *
 * @param {Rule[]} rules
 * @param {walkCallback} callback
 */
export function walk(rules, callback) {
    //@ts-ignore
    return Promise.all(rules.map(callback).flat());
}

/**@typedef {import("stylis-pack").Rule} Rule*/

/**
 * @callback walkCallback
 * @param {import("stylis-pack").Rule} rule
 */
