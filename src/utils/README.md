# stylis-pack/utils

All exposed utilities depend on the load instance, since it creates a root as a reference to hold the mutability on children.

## replaceWith

```js
replaceWith(oldRule, newRule);
```

## insertBefore

```js
insertBefore(markRule, newRule);
```

## insertAfter

```js
insertAfter(markRule, newRule);
```

## append

```js
append(refRule, newRule);
```

## prepend

```js
prepend(refRule, newRule);
```

## walkAtRule

```js
walkAtRule(rules, "@import", (root) => {});
```

## walk

```js
walkAtRule(rules, (root) => {});
```
