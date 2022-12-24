import React, { createContext, useState, useContext, useEffect } from 'react';

const createAlexandriaContext = () => {
  return createContext({});
};

const isServer = typeof window === "undefined";
const saveObject = (key, value) => {
  if (isServer) return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};
const getBlob = key => {
  if (isServer) return undefined;
  let blob;

  try {
    blob = localStorage.getItem(key) || undefined;
  } catch (e) {}

  return blob || undefined;
};
const getSavedObject = (key, fallback) => {
  const blob = getBlob(key);

  if (typeof blob === "undefined") {
    saveObject(key, fallback);
    return fallback;
  }

  let value = fallback;

  try {
    value = JSON.parse(blob);
  } catch (e) {
    saveObject(key, "{}");
  }

  return value;
};

const PREFIX = "Alexandria: ";
const errors = {
  unknownSetting: key => `UNKNOWN_SETTING_ERROR: "${key}" is not a valid setting. If it should be, please update your schema in the AlexandriaProvider. Your mutation has been ignored and the setting was not changed.`,
  invalidSettingValue: (key, value, schema) => `INVALID_SETTING_VALUE_ERROR: "${value}" is not an allowed value for setting "${key}". Your mutation has been ignored and the setting was not changed. The current allowed values are: ${schema[key].allow}. If you want to allow any value, set the "allow" property to "*".`,
  invalidSchema: schema => `INVALID_SCHEMA_ERROR: The schema provided to the AlexandriaProvider is invalid. Got: "${schema}"`,
  emptySchema: () => `EMPTY_SCHEMA_ERROR: The schema provided to the AlexandriaProvider is empty. Please provide a schema with at least one setting.`
};
const alexandriaError = (key, ...args) => {
  const error = errors[key];

  if (typeof error === "undefined") {
    throw new Error(`UNKNOWN_ERROR: ${key}`);
  }

  return new Error(`${PREFIX}${error(...args)}`);
};

const isAllowedValue = (key, value, schema) => {
  const setting = schema[key];

  if (typeof setting === "undefined" || typeof setting.allow === "undefined" && typeof setting.validate === "undefined") {
    return false;
  }

  if (!setting) return false;
  if (setting.allow === "*") return true;

  if (typeof setting.validate === "function") {
    const valid = setting.validate(value);
    if (valid) return true;
    return false;
  }

  if (typeof setting.allow === "undefined") return false;
  return setting.allow.includes(value);
};
const compileDefaultSettingsFromSchema = schema => {
  let settings = {};

  if (typeof schema !== "object") {
    throw alexandriaError("invalidSchema", schema);
  }

  if (Object.keys(schema || {}).length === 0) {
    throw alexandriaError("emptySchema");
  }

  for (const [key, value] of Object.entries(schema || {})) {
    settings[key] = value.default;
  }

  return settings;
};

const defaultConfig = {
  key: "alexandria"
};
const AlexandriaProvider = ({
  schema,
  config: userConfig,
  children
}) => {
  const config = { ...defaultConfig,
    ...userConfig
  };
  const AlexandriaContext = createAlexandriaContext();
  const defaultSettings = compileDefaultSettingsFromSchema(schema);

  const loadSettings = () => {
    return getSavedObject(config.key, defaultSettings);
  };

  const [settings, setSettings] = useState(() => {
    return { ...defaultSettings,
      ...loadSettings()
    };
  });
  return React.createElement(AlexandriaContext.Provider, {
    value: {
      settings,
      setSettings,
      schema,
      config
    }
  }, children);
};

const useAlexandria = () => {
  const AlexandriaContext = createAlexandriaContext();
  const {
    settings,
    setSettings,
    schema,
    config
  } = useContext(AlexandriaContext);

  if (!schema) {
    return {};
  }

  const defaultSettings = compileDefaultSettingsFromSchema(schema);
  const [isServer, setIsServer] = useState(true);
  const knownSettings = Object.keys(defaultSettings);

  const isKnownSetting = key => knownSettings.includes(key);

  const validateSettings = settingsToValidate => {
    let newSettings = {};

    for (const [key, value] of Object.entries(settingsToValidate)) {
      const known = isKnownSetting(key);
      const allowed = isAllowedValue(key, value, schema);

      if (known) {
        if (allowed) {
          newSettings[key] = value;
        } else {
          newSettings[key] = settings[key];
          throw alexandriaError("invalidSettingValue", key, value, schema);
        }
      }
    }

    return newSettings;
  };

  const setWithValidation = cb => {
    setSettings(settings => validateSettings(cb(settings)));
  };

  const loadSettings = () => {
    return getSavedObject(config.key, defaultSettings);
  };

  useEffect(() => {
    if (!window.localStorage) return;
    setIsServer(false);
    const savedSettings = loadSettings();

    if (Object.keys(savedSettings).length === 0) {
      setSettings(defaultSettings);
    }

    setSettings(validateSettings(savedSettings));
  }, []);
  useEffect(() => {
    if (JSON.stringify(loadSettings()) !== JSON.stringify(settings)) {
      saveObject(config.key, settings);
    }
  }, [settings]);

  const throwIfUnknownSetting = key => {
    if (!isKnownSetting(key)) {
      throw alexandriaError("unknownSetting", key);
    }
  };

  const cycleBetween = (key, values) => {
    throwIfUnknownSetting(key);
    const index = values.indexOf(settings[key]);
    const nextIndex = index === values.length - 1 ? 0 : index + 1;
    setWithValidation(settings => ({ ...settings,
      [key]: values[nextIndex]
    }));
  };

  const reset = key => {
    if (typeof key === "undefined") {
      setSettings(_ => defaultSettings);
      return;
    }

    throwIfUnknownSetting(key);
    setWithValidation(settings => ({ ...settings,
      [key]: defaultSettings[key]
    }));
  };

  const set = (key, value) => {
    throwIfUnknownSetting(key);
    if (settings[key] === value) return;
    setSettings(settings => validateSettings({ ...settings,
      [key]: value
    }));
  };

  const toggle = key => {
    throwIfUnknownSetting(key);
    setWithValidation(settings => ({ ...settings,
      [key]: !settings[key]
    }));
  };

  const toggleBetween = (key, values) => {
    throwIfUnknownSetting(key);
    setWithValidation(settings => ({ ...settings,
      [key]: settings[key] === values[0] ? values[1] : values[0]
    }));
  };

  const operatingContext = {
    ready: !isServer,
    cycleBetween,
    reset,
    set,
    toggle,
    toggleBetween
  };
  const alexandria = { ...settings,
    ...operatingContext
  };
  return alexandria;
};

const createAlexandria = schema => {
  const Provider = ({
    children
  }) => React.createElement(AlexandriaProvider, {
    schema: schema
  }, children);

  const useConsumer = () => {
    return useAlexandria();
  };

  return {
    Provider,
    useConsumer
  };
};

export { AlexandriaProvider, createAlexandria, createAlexandriaContext, useAlexandria };
//# sourceMappingURL=index.modern.js.map
