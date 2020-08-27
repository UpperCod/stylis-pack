'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function replaceWith(rule, rules) {
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

function insertBefore(rule, rules) {
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

function insertAfter(rule, rules) {
    const { children } = rule.parent;
    const position = children.indexOf(rule);
    if (position > -1 && children[position + 1]) {
        return insertBefore(children[position + 1], rules);
    }
}

function append(rule, rules) {
    rule.parent.children.push(...[].concat(rules));
    return true;
}

function prepend(rule, rules) {
    rule.parent.children.unshift(...[].concat(rules));
    return true;
}

function walkAtRule(rules, type, callback) {
    return walk(
        rules.filter((rule) => type == rule.type),
        callback
    );
}

function walk(rules, callback) {
    return Promise.all(rules.map(callback).flat());
}

exports.append = append;
exports.insertAfter = insertAfter;
exports.insertBefore = insertBefore;
exports.prepend = prepend;
exports.replaceWith = replaceWith;
exports.walk = walk;
exports.walkAtRule = walkAtRule;
//# sourceMappingURL=utils.js.map
