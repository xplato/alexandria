# Alexandria 🌍🏛️📚

Alexandria is a lightweight React wrapper for `localStorage`. It's primarily meant (though not by means of exclusion) for storing settings and user preferences. It provides a simple API for accessing and manipulating settings, and handles the validation and persistence to `localStorage` for you. It also plays nicely with SSR frameworks like NextJS.

## Features

-   Deep TypeScript integration; [see videos](#typescript-demonstration)
-   Automatic validation and persistence to `localStorage`
-   One-line addition for projects using SSR
-   Lightweight
-   Zero dependencies

## Installation

```bash
yarn add @xplato/alexandria
```

or

```bash
npm install @xplato/alexandria
```

## Basic TypeScript Usage

```tsx
// 1. Import the TypeScript creation function and the Schema type
import { createAlexandria, Schema } from "@xplato/alexandria"

// 2. Define your Settings as an interface/type
interface Settings {
  theme: "light" | "dark" // be as specific as possible
  sessionID: string
}

// 3. Define your settings schema
const schema: Schema = {
  theme: {
    allow: ["light", "dark"],
    default: "light",
  },
  sessionID: {
    validate: value => isUUID(value), // an imperative alternative to setting `allow`
    default: "00000000-0000-0000-0000-000000000000",
  },
}

// 4. Create Alexandria
const Alexandria = createAlexandria<Settings>(schema)
export const AlexandriaProvider = Alexandria.Provider
export const useAlexandria = Alexandria.useConsumer

// 5. Wrap your App with the AlexandriaProvider
const App = () => (
  <AlexandriaProvider>
    <Main />
  </AlexandriaProvider>
)

// 6. Use the useAlexandria hook to access your settings!
const Main = () => {
  const alexandria = useAlexandria()

  const increment = () => {
    alexandria.set("count", alexandria.count + 1)
  }

  // See the SSR section for more details on this
  if (!alexandria.ready) return null

  return (
    <>
      <p>{alexandria.theme}</p>
      <button onClick={increment}>Mod</button>
    </>
  )
}
```

Continue reading the documentation for more details on the API :)

## Documentation

**Table of Contents**

- [Installation](#installation)
- [Basic TypeScript Usage](#basic-typescript-usage)
- [TypeScript Usage](#typescript-usage)
- [Vanilla Usage](#vanillajs--manually-typed-usage)
- API
  - [create Alexandria](#createalexandriatypedsettingsschema-schema-config-config)
  - [AlexandriaProvider](#alexandriaprovidertypedsettingsschema-schema-config-config)
    - [Schema](#schema)
    - [Config](#config)
  - [useAlexandria](#usealexandriatypedsettings)
    - [Access & Methods](#access--methods)
    - [`alexandria.set`](#setkey-value)
    - [`alexandria.toggle`](#togglekey)
    - [`alexandria.toggleBetweem`](#togglebetweenkey-value1-value2)
    - [`alexandria.cycleBetween`](#cyclebetweenkey-value1-value2-value3)
    - [`alexandria.reset`](#resetkey)
    - [`alexandria.ready`](#ready-boolean)
  - [SSR](#integration-with-ssr)

### TypeScript Usage

Alexandria is meant for TypeScript! [See the videos](#typescript-demonstration) at the bottom of this doc for examples of how Alexandria integrates with TypeScript.

To make Alexandria fully-typed, you must manually create the provider and consumer with the `createAlexandria` function shown in the [Basic TypeScript Usage](#basic-typescript-usage) section. This is so that you can pass the type argument to one function once instead of doing it manually every time you use the provider or hook.

```tsx
// lib/alexandria.ts
// A file containing the root Alexandria exports and types

import { createAlexandria } from "@xplato/alexandria"

// Exported so your components can use if needed
export interface Settings {
  // ...
}

const schema = {
  // ...
}

const Alexandria = createAlexandria<Settings>(schema)
export const AlexandriaProvider = Alexandria.Provider
export const useAlexandria = Alexandria.useConsumer
```

Now, you can import and use the provider and consumer without having to annotate them:

```tsx
import { AlexandriaProvider, useAlexandria } from "./lib/alexandria"

const App = () => (
  <AlexandriaProvider>
    <Main />
  </AlexandriaProvider>
)

const Main = () => {
  const alexandria = useAlexandria()
}
```

### VanillaJS / Manually Typed Usage

Plain JavaScript / Manually Typed TypeScript is essentially the same, apart from the type annotations in the provider and hook, of course.

Instead of creating the provider and consumer, you just import them directly:

```tsx
import { AlexandriaProvider, useAlexandria } from "@xplato/alexandria"

interface MySettings {
  // ...
}

const App = () => (
  <AlexandriaProvider<MySettings> schema={schema}>
    <Main />
  </AlexandriaProvider>
)

const Main = () => {
  const alexandria = useAlexandria<MySettings>()
}
```

The reason why this is not the default is because it would require you to annotate both the provider and hook in every place you use them, which is annoying.

### `createAlexandria<TypedSettings>(schema: Schema, config?: Config)`

This function is what allows you to deeply integrate your types into Alexandria. Calling it returns an object with two properties: `Provider` and `useConsumer`. These are the same as the default exports, but with the type argument already applied.

### `AlexandriaProvider<TypedSettings?>{schema: Schema, config?: Config}`

The `AlexandriaProvider` is a React component that wraps your app and provides the `useAlexandria` hook with the settings you want to use. Under the hood, it uses the React Context API, meaning it is lightweight and fast.

View the [Basic TypeScript Usage](#basic-typescript-usage) section for an example of how to use it.

It accepts two props and an optional type argument:

-   `schema`: Your Settings Schema (described below)
-   `config`: Your Config (described below)
-   `TypedSettings`: The type of your settings; not required if created by `createAlexandria`

#### `schema`

The schema is an object that defines the structure of all your settings. It is used during validation to ensure the user's settings are in sync with your schema. It also defines the default values for your settings.

As an example, let's say you want to store a user's theme preference. You could define your schema like this:

```tsx
const schema = {
  theme: {
    allow: ["light", "dark"],
    default: "light",
  },
}
```

In a lot of cases, you'll know ahead of time what values your settings can be. Sometimes, however, you don't. For those cases, you can simply use `"*"` to allow any value. For instance, if you allow the user to set the accent to any hex value, you could do this:

```tsx
const schema = {
  accent: {
    allow: "*",
    default: "#3452ff",
  },
}
```

Better yet, you can alternatively define a `validate` function to perform more complex validation. For instance, if you want to ensure that the accent is a valid hex value, you could do this:

```tsx
const schema = {
  accent: {
    validate: value => /^#[0-9a-f]{6}$/i.test(value),
    default: "#3452ff",
  },
}
```

#### `config`

The config is a small object that allows you to tweak some data/behavior of Alexandria. Right now, it contains a single property: `key`. This is the key used for the settings in `localStorage` (Alexandria uses only one key for all settings).

The default value is `"alexandria"`.

### `useAlexandria<TypedSettings?>()`

The `useAlexandria` hook is what you use to access your settings. It returns a merged object of your settings and some methods for updating them.

It accepts no arguments with the exception of an optional type argument, `TypedSettings`. This is not required if created with `createAlexandria`.

**Hook usage**

I prefer to use and assign the whole object directly like so:

```tsx
const alexandria = useAlexandria()

console.log(alexandria.theme)

alexandria.set("theme", "dark")
alexandria.toggleBetween("theme", ["light", "dark"])
```

#### Access & Methods

Your settings are spread onto the object returned by `useAlexandria`, so they can be accessed directly. There is no `alexandria.get` method.

**Methods**

##### `set(key, value)`

`set` is used to set a single setting to a specific value. It accepts two arguments: the setting name and the value to set it to.

```tsx
alexandria.set("theme", "dark")
alexandria.set("openLinksInNewTab", true)
```

##### `toggle(key)`

`toggle` is used to toggle a setting between `true` and `false`. It accepts a single argument: the setting name.

```tsx
alexandria.toggle("darkMode")
```

##### `toggleBetween(key, [value1, value2])`

`toggleBetween` is used to toggle a setting between a list of 2 values. It accepts two arguments: the setting name and an array of 2 values to toggle between. This is a more specific alternative to `cycleBetween`.

```tsx
alexandria.toggleBetween("theme", ["light", "dark"])
```

##### `cycleBetween(key, [value1, value2, value3, ...])`

`cycleBetween` is used to cycle a setting between a list of values. It accepts two arguments: the setting name and an array of values to cycle between.

```tsx
alexandria.cycleBetween("theme", ["light", "dark", "system"])
```

##### `reset(key?)`

`reset` is used to reset a setting to its default value, or to reset all settings if no argument is provided. It accepts an optional argument: the setting name.

```tsx
alexandria.reset("theme") // theme => "light"
alexandria.reset() // all settings => their defaults
```

##### `ready: boolean`

The `ready` property defines when browser-level APIs (`localStorage`) are ready to be used. This is useful for SSR, where you don't want to render your app until the settings are ready.

For more info, see the [SSR section.](#integration-with-ssr)

```tsx
const alexandria = useAlexandria()
if (!alexandria.ready) return null
```

### Validation

Alexandria uses your schema to perform automatic validation during the initial reading of the user's saved settings and whenever you call a mutating method.

There are a number of checks being performed:

-   If the setting is not recognized, it's deleted.
-   If the setting is found in the schema, but the value is not allowed, it's set to the default value.
-   If the user hasn't been here before (i.e. the entire object is missing), it's set to the all the default values (meaning they will always be defined)

### Persistence & Limitations

Alexandria uses `localStorage` to persist your settings. This has a few quirks and limitations:

-   You are limited to around 5MB of data. This is by most accounts way, way more than enough, but it's something to keep in mind.
-   Persistence is only ensured as long as the user doesn't clear their browser data and cookies. This is a limitation of `localStorage` itself. If you need _permanent_ storage, you should use a database.

### Integration with SSR

Technically, Alexandria doesn't have any direct integration with SSR. After all, `localStorage` isn't available on the server. Because of this, Alexandria will simply defer execution until browser-level APIs are available. In most cases, this is fine. However, if you have to render settings as textual content (meaning literally showing the value of a setting; this includes the DOM like classes and attributes) on your website, you'll run into hydration issues. This is because Alexandria will render the default values on the server, but the actual values on the client, leading to a mismatch.

To avoid these issues, you can use the `ready` property from the `useAlexandria` hook to defer rendering until the settings are ready. For instance:

```tsx
const MyComponent = () => {
  const alexandria = useAlexandria()

  if (!alexandria.ready) {
    return null
  }

  return <div>Theme: {alexandria.theme}</div>
}
```

## TypeScript Demonstration

The `set` function narrows the key and values for you, so you can't set a setting to an invalid value.

https://user-images.githubusercontent.com/87919558/209453564-ba8a84a2-26bf-498a-8cd1-55bef03bc0e1.mov

The `toggleBetween` function narrows the key and values for you as well:

https://user-images.githubusercontent.com/87919558/209453569-42e61e51-e0a1-4934-bdea-18d465d41ca6.mov
