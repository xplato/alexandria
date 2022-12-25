import { AlexandriaSchema, AlexandriaSetting } from "./types";
export declare const isAllowedValue: (key: string, value: AlexandriaSetting, schema: AlexandriaSchema) => boolean;
export declare const compileDefaultSettingsFromSchema: <TypedSettings extends {}>(schema: AlexandriaSchema) => TypedSettings;
