import { Schema, SettingValue } from "./types";
export declare const isAllowedValue: (key: string, value: SettingValue, schema: Schema) => boolean;
export declare const compileDefaultSettingsFromSchema: <TypedSettings extends {}>(schema: Schema) => TypedSettings;
