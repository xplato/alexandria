# Alexandria 🌍🏛️📚

Alexandria is a lightweight React wrapper for `localStorage`. It's primarily meant (though not by means of exclusion) for storing settings and user preferences. It provides a simple API for accessing and manipulating settings, and handles the validation and persistence to `localStorage` for you. It also plays nicely with SSR frameworks like NextJS.

## Basic Usage

First, install:

```bash
yarn add @xplato/alexandria
```

or

```bash
npm install @xplato/alexandria
```

Then, use it:

```jsx
// Import Alexandria
import { AlexandriaProvider, useAlexandria } from "@xplato/alexandria"

// Define your settings schema
const schema = {
  theme: {
    allow: ["light", "dark"],
    default: "light",
  },
  sessionID: {
    validate: value => isUUID(value), // an imperative alternative to setting `allow`
    default: "00000000-0000-0000-0000-000000000000",
  },
}

// Define your config (optional)
const config = {
  // They primary localStorage key
  key: "alexandria", // default
}

// Wrap your app with the AlexandriaProvider
const App = () => (
  <AlexandriaProvider schema={schema} config={config}>
    <Main />
  </AlexandriaProvider>
)

// Use the useAlexandria hook to access your settings
const Main = () => {
  const alexandria = useAlexandria()

  return (
    <div>
      <h1>Settings</h1>
      <p>Theme: {alexandria.theme}</p>
      <p>Session ID: {alexandria.sessionID}</p>

      <button
        onClick={() =>
          alexandria.toggleBetween("theme", ["light", "dark"])
        }
      >
        Toggle theme
      </button>
      <button
        onClick={() =>
          alexandria.set(
            "sessionID",
            "1111111-1111-1111-1111-111111111111"
          )
        }
      >
        Reset session ID
      </button>
    </div>
  )
}
```

## Documentation

There are two primary components: the `AlexandriaProvider` and the `useAlexandria` hook.

### `AlexandriaProvider`

The `AlexandriaProvider` is a React component that wraps your app and provides the `useAlexandria` hook with the settings you want to use. It also handles the automatic validation and persistence to `localStorage`.

View the Basic Usage section for an example of how to use it.

It accepts two props:

-   `schema`: Your Settings Schema (described below)
-   `config`: Your Config (described below)

#### `schema`

[Go to type definition](https://github.com/xplato/alexandria/blob/main/src/types.ts#L3-L9)

The schema is an object that defines the structure of all your settings. It is used during validation to ensure the user's settings are in sync with your schema. It also defines the default values for your settings.

As an example, let's say you want to store a user's theme preference. You could define your schema like this:

```jsx
const schema = {
  theme: {
    allow: ["light", "dark"],
    default: "light",
  },
}
```

In a lot of cases, you'll know ahead of time what values your settings can be. Sometimes, however, you don't. For those cases, you can simply use `"*"` to allow any value. For instance, if you allow the user to set the accent to any hex value, you could do this:

```jsx
const schema = {
  accent: {
    allow: "*",
    default: "#3452ff",
  },
}
```

Better yet, you can alternatively define a `validate` function to perform more complex validation. For instance, if you want to ensure that the accent is a valid hex value, you could do this:

```jsx
const schema = {
  accent: {
    validate: value => /^#[0-9a-f]{6}$/i.test(value),
    default: "#3452ff",
  },
}
```

View the [type definition](https://github.com/xplato/alexandria/blob/main/src/types.ts#L3-L9) for more information.

#### `config`

[Go to type definition](https://github.com/xplato/alexandria/blob/main/src/types.ts#L15-L17)

The config is a small object that allows you to tweak some data/behavior of Alexandria. Right now, it contains a single property: `key`. This is the key used for the settings in `localStorage` (Alexandria uses only one key for all settings).

### `useAlexandria`

The `useAlexandria` hook is what you use to access your settings. It returns a merged object of your settings and some methods for updating them.

I prefer to use and assign the whole object directly like so:

```jsx
const alexandria = useAlexandria()

console.log(alexandria.theme)

alexandria.set("theme", "dark")
alexandria.toggleBetween("theme", ["light", "dark"])
```

The entire object is given to the provider, so there's no performance benefit to destructuring it. However, if you prefer to do that, you can do so like so:

```jsx
const { theme, set, toggleBetween } = useAlexandria()
```

#### Access & Methods

Your settings are spread onto the object returned by `useAlexandria`, so they can be accessed directly. There is no `alexandria.get` method.

**Methods**

##### `set`

`set` is used to set a setting to a specific value. It accepts two arguments: the setting name and the value to set it to.

```jsx
alexandria.set("theme", "dark")
```

##### `update`

`update` is like `set`, but accepts an object. It then merges this with the existing settings. This is useful for updating multiple settings at once.

```jsx
alexandria.update({
  theme: "dark",
  sessionID: "1111111-1111-1111-1111-111111111111",
})
```

##### `toggle`

`toggle` is used to toggle a setting between `true` and `false`. It accepts a single argument: the setting name.

```jsx
alexandria.toggle("darkMode")
```

##### `toggleBetween`

`toggleBetween` is used to toggle a setting between a list of 2 values. It accepts two arguments: the setting name and an array of 2 values to toggle between. This is a more specific alternative to `cycleBetween`.

```jsx
alexandria.toggleBetween("theme", ["light", "dark"])
```

##### `cycleBetween`

`cycleBetween` is used to cycle a setting between a list of values. It accepts two arguments: the setting name and an array of values to cycle between.

```jsx
alexandria.cycleBetween("theme", ["light", "dark", "system"])
```

##### `reset`

`reset` is used to reset a setting to its default value, or to reset all settings if no argument is provided. It accepts an optional argument: the setting name.

```jsx
alexandria.reset("theme") // theme => "light"
alexandria.reset() // all settings => their defaults
```

### Validation

Alexandria uses your schema to perform automatic validation during the initial reading of the user's saved settings and whenever you call a mutating method.

There are a number of checks being performed:

-   If the setting is not recognized, it's deleted.
-   If the setting is found in the schema, but the value is not allowed, it's set to the default value.
-   If the user hasn't been here before (i.e. the entire object is missing), it's set to the all the default values (meaning they will always be defined)

### Persistence & Limitations

Alexandria uses `localStorage` to persist your settings. This has a few quirks and limitations:

-   You are limited to around 5MB of data. This is by most accounts more than enough, but it's something to keep in mind.
-   Persistence is only ensured as long as the user doesn't clear their browser data and cookies. This is a limitation of `localStorage` itself. If you need _permanent_ storage, you should use a database.

### Integration with SSR

Technically, there is none. Alexandria just defers working with browser-level APIs until they're available.
