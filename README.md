# @whisthub/vue-i18n

Simple internationalization plugin for Vue, modeled after [vue-i18n](https://vue-i18n.intlify.dev/) that does support both Options and Composition API in the same project.

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

## Usage

`@whisthub/vue-i18n` can be used both with the [Options API](https://vuejs.org/guide/introduction#options-api) and the [Composition API](https://vuejs.org/guide/introduction#composition-api) in the same project. ✨
Nothing needs to be configured for this to work, so no `{ legacy: true }` or `{ allowComposition: true }` as with [vue-i18n](https://vue-i18n.intlify.dev/guide/advanced/composition.html).

```js
import { createApp } from 'vue';
import { createI18n } from '@whisthub/vue-i18n';

const app = createApp();
const i18n = createI18n({

  // Globally available messages go here.
  messages: {},

  // Initial locale, can be changed at runtime.
  locale: 'en',

  // Fallback locale to use when a message is not found.
  fallbackLocale: 'en',

});
app.use(i18n);
```

### Options API

```vue
<template>
  <p>{{ $t('greeting', { name: 'John Doe' }) }}</p>
  <i18n-t keypath="accept_terms">
    <template #terms>
      <a href="/terms">{{ $t('terms_and_conditions') }}</a>
    </template>
  </i18n->
</template>

<script>
export default {
  i18n: {
    messages: {
      en: {
        greeting: i => i`Hello ${'name'}!`,
        accept_terms: i => i`I accept the ${'terms'}.`,
        terms: 'terms and conditions',
      },
      fr: {
        greeting: i => i`Bonjour ${'name'}!`,
      },
    },
  },
};
</script>
```

### Composition API

```vue
<template>
  <p>{{ t('greeting', { name: 'John Doe' }) }}</p>
  <i18n-t keypath="accept_terms">
    <template #terms>
      <a href="/terms">{{ $t('terms_and_conditions') }}</a>
    </template>
  </i18n->
</template>

<script setup>
import { useI18n } form '@whisthub/vue-i18n';

// $t is an alias for t, which makes it easier to migrate your components.
const { t, $t } = useI18n({
  messages: {
    en: {
      greeting: i => i`Hello ${'name'}!`,
      accept_terms: i => i`I accept the ${'terms'}.`,
      terms: 'terms and conditions',
    },
    fr: {
      greeting: i => i`Bonjour ${'name'}!`,
    },
  },
});
</script>
```

Most of the options passed to `createI18n` and `useI18n` or `i18n: {}` are the same as for [vue-i18n](https://vue-i18n.intlify.dev/), so migrating should be failry straightforward.
It also helps if you quickly want to try it out to see if this library is a viable alternative for [vue-i18n](https://vue-i18n.intlify.dev/).
The most important differences are listed below.

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

[vue-i18n](https://www.npmjs.com/package/vue-i18n) allows you to use nested messages and then access them with dot notation:

```vue
<template>
{{ t('nested.hello') }}
</template>

<script setup>
import { useI18n } from 'vue-i18n';

// THIS WILL NOT WORK!!
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

Alternatively you could also do this at build time with a custom Vite plugin.

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

### The difference between `createI18n` and `useI18n`

In [vue-i18n](https://vue-i18n.intlify.dev/) it's not always clear anymore when you're working with what.
There's no clear terminology for the difference between the two, but let's call the result of
```js
const i18n = createI18n();
```
the *i18n root* and the result of
```js
const context = useI18n();
```
a *translation context*.

The *i18n root* contains the configuration and acts as a "hub", just like `const app = createApp()` is for Vue.
It's here that you change the global locale of your application - see above.

A *translation context* is what you will be interacting with the most: it contains the `t` function used for translating messages.
When using the options API, it's also available as `$i18n` in your templates, meaning that using `$i18n.$t` and `$t` in your templates are equivalent.

You can get a reference to to the *i18n root* from a *translation context* as

```js
// Composition API
const { i18n } = useI18n();

// Options API
export default {
  created() {
    const { i18n } = this.$i18n;
  },
};
```

So, if you want to change the global locale somewhere in your application, you could do it as

```vue
<template>
  <select v-model="i18n.locale">
    <option value="en">English</option>
    <option value="fr">Français</option>
  </select>
</template>

<script setup>
const { i18n } = useI18n();
</script>
```

### No TypeScript

I don't use TypeScript, and I'm not going to, so the library is not written in TypeScript.
Sorry.

### Notable missing features

Some notable missing features are listed below.
Some are omitted intentionally, while others might still be added in the future.
PRs are welcome of course if you're missing a certain feature.

 - No [number](https://vue-i18n.intlify.dev/guide/essentials/number.html) or [date](https://vue-i18n.intlify.dev/guide/essentials/datetime) formatting.
 - No modifiers in messages.
 - No [custom `v-t` directive](https://vue-i18n.intlify.dev/guide/advanced/directive)
 - No support for [custom compilers](https://vue-i18n.intlify.dev/guide/advanced/format.html). You can still precompile your messages in different formats manually to either a string, a tagged function ``i => i`Hello ${'name'}!` `` or an array of strings and functions for pluralization.

## Should you use this?

It depends.
My philosophy on Open Source is

> Do with my code whatever you want, but don't expect me to do whatever you want.

meaning that I needed this for myself and thought that maybe someone else could benefit from it.

I do not intend to actively maintain this repository and add more features.
You can look at this as a downside, but on the upside it also means that you don't have to fear a new version coming out every 2 months that requires you to upgrade your code to cope with breaking changes.
We're all tired of that anyway, aren't we?

That being said, if you feel like something is missing before you can use this yourself, you can definitely file a PR and I'll have a look at it.
Just don't open an issue saying that there is something missing, and then expect me to implement it for you.

Is it production ready?
Well this module is being used in production on www.whisthub.com, so in a way it's production ready.

## Can I support this project?

You can, but you definitely don't have to.
If you want, you can make a donation on www.whisthub.com/donate.
It requires you to create an account though, but you can create one, make the donation and then request the account to be deleted afterwards via www.whisthub.com/settings.
