import { Schema, SettingValue, UnknownSettings } from "rtypes";
export declare const isAllowedValue: (key: string, value: SettingValue, schema: Schema) => boolean;
export declare const compileDefaultSettingsFromSchema: (schema: Schema) => UnknownSettings;
