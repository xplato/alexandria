import { Schema, SettingValue, UnknownSettings } from "types";
export declare const isAllowedValue: (key: string, value: SettingValue, schema: Schema) => boolean;
export declare const compileDefaultSettingsFromSchema: (schema: Schema) => UnknownSettings;
