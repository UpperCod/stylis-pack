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

export function insertAfter(rule, rules) {
    const { children } = rule.parent;
    const position = children.indexOf(rule);
    if (position > -1 && children[position + 1]) {
        return insertBefore(children[position + 1], rules);
    }
}

export function append(rule, rules) {
    rule.parent.children.push(...[].concat(rules));
    return true;
}

export function prepend(rule, rules) {
    rule.parent.children.unshift(...[].concat(rules));
    return true;
}

export function walkAtRule(rules, type, callback) {
    return walk(
        rules.filter((rule) => type == rule.type),
        callback
    );
}

export function walk(rules, callback) {
    return Promise.all(rules.map(callback).flat());
}
