function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var AlexandriaContext = React.createContext({});

var isServer = typeof window === "undefined";
var saveObject = function saveObject(key, value) {
  if (isServer) return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};
var getBlob = function getBlob(key) {
  if (isServer) return undefined;
  var blob;

  try {
    blob = localStorage.getItem(key) || undefined;
  } catch (e) {}

  return blob || undefined;
};
var getSavedObject = function getSavedObject(key, fallback) {
  var blob = getBlob(key);

  if (typeof blob === "undefined") {
    saveObject(key, fallback);
    return fallback;
  }

  var value = fallback;

  try {
    value = JSON.parse(blob);
  } catch (e) {
    saveObject(key, "{}");
  }

  return value;
};

var PREFIX = "Alexandria: ";
var errors = {
  unknownSetting: function unknownSetting(key) {
    return "UNKNOWN_SETTING_ERROR: \"" + key + "\" is not a valid setting. If it should be, please update your schema in the AlexandriaProvider. Your mutation has been ignored and the setting was not changed.";
  },
  invalidSettingValue: function invalidSettingValue(key, value, schema) {
    return "INVALID_SETTING_VALUE_ERROR: \"" + value + "\" is not an allowed value for setting \"" + key + "\". Your mutation has been ignored and the setting was not changed. The current allowed values are: " + schema[key].allow + ". If you want to allow any value, set the \"allow\" property to \"*\".";
  },
  invalidSchema: function invalidSchema(schema) {
    return "INVALID_SCHEMA_ERROR: The schema provided to the AlexandriaProvider is invalid. Got: \"" + schema + "\"";
  },
  emptySchema: function emptySchema() {
    return "EMPTY_SCHEMA_ERROR: The schema provided to the AlexandriaProvider is empty. Please provide a schema with at least one setting.";
  }
};
var alexandriaError = function alexandriaError(key) {
  var error = errors[key];

  if (typeof error === "undefined") {
    throw new Error("UNKNOWN_ERROR: " + key);
  }

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return new Error("" + PREFIX + error.apply(void 0, args));
};

var isAllowedValue = function isAllowedValue(key, value, schema) {
  var setting = schema[key];

  if (typeof setting === "undefined" || typeof setting.allow === "undefined" && typeof setting.validate === "undefined") {
    return false;
  }

  if (!setting) return false;
  if (setting.allow === "*") return true;

  if (typeof setting.validate === "function") {
    var valid = setting.validate(value);
    if (valid) return true;
    return false;
  }

  if (typeof setting.allow === "undefined") return false;
  return setting.allow.includes(value);
};
var compileDefaultSettingsFromSchema = function compileDefaultSettingsFromSchema(schema) {
  var settings = {};

  if (typeof schema !== "object") {
    throw alexandriaError("invalidSchema", schema);
  }

  if (Object.keys(schema || {}).length === 0) {
    throw alexandriaError("emptySchema");
  }

  for (var _i = 0, _Object$entries = Object.entries(schema || {}); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _Object$entries[_i],
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];
    settings[key] = value["default"];
  }

  return settings;
};

var defaultConfig = {
  key: "alexandria"
};
var AlexandriaProvider = function AlexandriaProvider(_ref) {
  var schema = _ref.schema,
      userConfig = _ref.config,
      children = _ref.children;

  var config = _extends({}, defaultConfig, userConfig);

  var defaultSettings = compileDefaultSettingsFromSchema(schema);

  var loadSettings = function loadSettings() {
    return getSavedObject(config.key, defaultSettings);
  };

  var _useState = React.useState(function () {
    return _extends({}, defaultSettings, loadSettings());
  }),
      settings = _useState[0],
      setSettings = _useState[1];

  return React__default.createElement(AlexandriaContext.Provider, {
    value: {
      settings: settings,
      setSettings: setSettings,
      schema: schema,
      config: config
    }
  }, children);
};

var useAlexandria = function useAlexandria() {
  var _useContext = React.useContext(AlexandriaContext),
      settings = _useContext.settings,
      setSettings = _useContext.setSettings,
      schema = _useContext.schema,
      config = _useContext.config;

  var defaultSettings = compileDefaultSettingsFromSchema(schema);

  var _useState = React.useState(true),
      isServer = _useState[0],
      setIsServer = _useState[1];

  var knownSettings = Object.keys(defaultSettings);

  var isKnownSetting = function isKnownSetting(key) {
    return knownSettings.includes(key);
  };

  var validateSettings = function validateSettings(settingsToValidate) {
    var newSettings = {};

    for (var _i = 0, _Object$entries = Object.entries(settingsToValidate); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _Object$entries[_i],
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];
      var known = isKnownSetting(key);
      var allowed = isAllowedValue(key, value, schema);

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

  var setWithValidation = function setWithValidation(cb) {
    setSettings(function (settings) {
      return validateSettings(cb(settings));
    });
  };

  var loadSettings = function loadSettings() {
    return getSavedObject(config.key, defaultSettings);
  };

  React.useEffect(function () {
    if (!window.localStorage) return;
    setIsServer(false);
    var savedSettings = loadSettings();

    if (Object.keys(savedSettings).length === 0) {
      setSettings(defaultSettings);
    }

    setSettings(validateSettings(savedSettings));
  }, []);
  React.useEffect(function () {
    if (JSON.stringify(loadSettings()) !== JSON.stringify(settings)) {
      saveObject(config.key, settings);
    }
  }, [settings]);

  var throwIfUnknownSetting = function throwIfUnknownSetting(key) {
    if (!isKnownSetting(key)) {
      throw alexandriaError("unknownSetting", key);
    }
  };

  var cycleBetween = function cycleBetween(key, values) {
    throwIfUnknownSetting(key);
    var index = values.indexOf(settings[key]);
    var nextIndex = index === values.length - 1 ? 0 : index + 1;
    setWithValidation(function (settings) {
      var _extends2;

      return _extends({}, settings, (_extends2 = {}, _extends2[key] = values[nextIndex], _extends2));
    });
  };

  var reset = function reset(key) {
    if (typeof key === "undefined") {
      setSettings(function (_) {
        return defaultSettings;
      });
      return;
    }

    throwIfUnknownSetting(key);
    setWithValidation(function (settings) {
      var _extends3;

      return _extends({}, settings, (_extends3 = {}, _extends3[key] = defaultSettings[key], _extends3));
    });
  };

  var set = function set(key, value) {
    throwIfUnknownSetting(key);
    if (settings[key] === value) return;
    setSettings(function (settings) {
      var _extends4;

      return validateSettings(_extends({}, settings, (_extends4 = {}, _extends4[key] = value, _extends4)));
    });
  };

  var toggle = function toggle(key) {
    throwIfUnknownSetting(key);
    setWithValidation(function (settings) {
      var _extends5;

      return _extends({}, settings, (_extends5 = {}, _extends5[key] = !settings[key], _extends5));
    });
  };

  var toggleBetween = function toggleBetween(key, values) {
    throwIfUnknownSetting(key);
    setWithValidation(function (settings) {
      var _extends6;

      return _extends({}, settings, (_extends6 = {}, _extends6[key] = settings[key] === values[0] ? values[1] : values[0], _extends6));
    });
  };

  var operatingContext = {
    ready: !isServer,
    cycleBetween: cycleBetween,
    reset: reset,
    set: set,
    toggle: toggle,
    toggleBetween: toggleBetween
  };

  var alexandria = _extends({}, settings, operatingContext);

  return alexandria;
};

exports.AlexandriaContext = AlexandriaContext;
exports.AlexandriaProvider = AlexandriaProvider;
exports.useAlexandria = useAlexandria;
//# sourceMappingURL=index.js.map
