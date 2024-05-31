# @whisthub/vue-i18n

Simple internationalization plugin for Vue, modeled after vue-i18n

## Motivation

In the past we used [vue-i18n](https://www.npmjs.com/package/vue-i18n) for internationalization in Vue applications.
However, since `v9`, you have to either choose between using it with the Composition API, or with the Options API.
[You can't mix both](https://github.com/intlify/vue-i18n/discussions/605).

This is unfortunate because it means you have to migrate your *entire* codebase *at once* to the Composition API.
On top of that, Vue explicitly states that Options API isn't going anywhere, and that it's perfectly fine to have some components use the Options API, while others use the Composition API.

This makes the new version of [vue-i18n](https://www.npmjs.com/package/vue-i18n) pretty much useless in large codebases and even an hindrance to migrating some components to the composition API as you can't migrate step by step.

The goal of `@whistub/vue-i18` is to provide the same basic functionality that [vue-i18n](https://www.npmjs.com/package/vue-i18n) offers, but by explicitly allowing it to be used both with the options and composition api.
