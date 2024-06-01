# @whisthub/vue-i18n

Simple internationalization plugin for Vue, modeled after vue-i18n

## Motivation

In the past we used [vue-i18n](https://www.npmjs.com/package/vue-i18n) for internationalization in Vue applications - most notably on www.whisthub.com.
However, since `v9`, you have to either choose between using it with the Composition API, or with the Options API.
[You can't mix both](https://github.com/intlify/vue-i18n/discussions/605).

This is unfortunate because it means you have to migrate your *entire* codebase *at once* to the Composition API.
On top of that, Vue explicitly states that Options API isn't going anywhere, and that it's perfectly fine to have some components use the Options API, while others use the Composition API.

This makes the new version of [vue-i18n](https://www.npmjs.com/package/vue-i18n) pretty much useless in large codebases and even an hindrance to migrating some components to the composition API as you can't migrate step by step, even though there is no technical reason why both options and composition API couldn't be supported at the same time.
After all, other Vue libraries such as [vue-router](https://npmjs.com/package/vue-router) or [pinia](https://www.npmjs.com/package/pinia) are all doing it.

The goal of `@whistub/vue-i18n` is to provide the same *basic* functionality that [vue-i18n](https://www.npmjs.com/package/vue-i18n) offers, but by explicitly allowing it to be used both with the options and composition api.
Note that the goal is **not** to have full feature-parity, just the basic features needed on www.whisthub.com.
If you're having trouble with [vue-i18n](https://www.npmjs.com/package/vue-i18n), you might want to give this library a try as a replacement, but do it at your own risk!
Some features you rely on might be missing and there can be subtle differences here and there.

## Differences with `vue-i18n`

As mentioned above, we don't aim to provide full feature parity with [vue-i18n](https://www.npmjs.com/package/vue-i18n), but the most common functionality is there.
We also use the same message compiler [@intlify/message-compiler](https://www.npmjs.com/package/@intlify/message-compiler) under the hood, so the [message syntax](https://vue-i18n.intlify.dev/guide/essentials/syntax) is still the same as well.

Nevertheless there are some important differences that you should be aware of, which are highlighted below.
Most of these differences are the result of trying to make the library a bit simpler.

### Messages are not precompiled

In [vue-i18n](https://www.npmjs.com/package/vue-i18n), there are [two bundles](https://vue-i18n.intlify.dev/guide/advanced/optimization): one that includes the message compiler, and another one that doesn't.
This module *never* compiles the messages at runtime and always assumes that the messages passed to `useI18n` are already compiled.
This means that you either have to *precompile* them during your build step, or *explicitly* compile them at runtime.
This can look like

```js
import jit from '@whisthub/vue-i18n/jit';
import messages from './messages.json';

const { t } = useI18n({ messages: jit(messages) });
```

We do recommend *precompiling* the messages though.
If you're using [Vite](https://vitejs.dev), we have an official plugin that can do this

```js
// # vite.config.js
import vue from '@vitejs/plugin-vue';
import i18nPlugin from '@whisthub/vue-i18n/plugin-vite';

export default {
  plugins: [
    vue(),
    i18nPlugin({

      // By default, include is set to precompile .i18n.json files, but you can 
      // change this. For example, if you want to precompile yaml, you can set 
      // it to /\.ya?ml$/, but in that case you have to make sure that you first 
      // register a plugin that transforms yaml to json!
      include: /\.i18n\.json$/,

    }),
  ],
};
```

That being said, messages with interpolation use [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates) when compiled, which looks like
```js
const message = i => i`Hello ${'name'}!`;
```
This means that writing interpolated messages manually should be easy enough that you might not even need to compile them manually!
Messages that don't use interpolation can just be strings, and pluralized messages can be just arrays

```js
const messages = {
  en: {
    banana: [
      'One banana',
      i => i`${'n'} bananas`,
    ],
  },
};
```

### No nested messages

[vue-i18n](https://www.npmjs.com/package/vue-i18n) allows you to use nested message and then access them with dot notation:

```vue
<template>
{{ t('nested.hello') }}
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n({
  messages: {
    en: {
      nested: {
        hello: 'Hello!',
      },
    },
  },
});
</script>
```

This **does not work** with [@whisthub/vue-i18n].
You can use something like [dot-object](https://www.npmjs.com/package/dot-object) to transform your messages if you truly need this:

```js
import dot from 'dot-object';

const { t } = useI18n({
  messages: {
    en: dot.transform({
      nested: {
        hello: 'Hello!',
      },
    }),
  },
});
```

### Locale changing

Since version v9, [vue-i18n](https://vue-i18n.intlify.dev/) has an extremely weird way of [changing the global locale](https://vue-i18n.intlify.dev/guide/essentials/scope#global-scope-1), for which the api is different when running in legacy mode:

```js
// when vue-i18n is being used with legacy: false, note that i18n.global.locale is a ref, so we must set it via .value:
i18n.global.locale.value = 'en'

// otherwise - when using legacy: true, we set it like this:
i18n.global.locale = 'en'
```

Enough of that, now you can just change the locale as

```js
import { createI18n } from '@whisthub/vue-i18n';
const i18n = createI18n({
  locale: 'en',
});

// Change the global locale later on.
i18n.locale = 'nl';
```

### No TypeScript

I don't use TypeScript, and I'm not going to, so the library is not written in TypeScript.
Sorry.

### Notable missing features

Some notable missing features are listed below.
Some are omitted intentionally, while others might still be added in the future.
PRs are welcome of course if you're missing a certain feature.
