import { Dispatch, SetStateAction } from "react";
export interface AlexandriaOperatingContext<TypedSettings> {
    ready: boolean;
    cycleBetween: (key: keyof TypedSettings, values: string[]) => void;
    reset: (key?: keyof TypedSettings) => void;
    set: (key: keyof TypedSettings, value: SettingValue) => void;
    toggle: (key: keyof TypedSettings) => void;
    toggleBetween: (key: keyof TypedSettings, values: string[]) => void;
}
export declare type SettingValue = string | boolean | number | unknown[] | object;
export interface Schema {
    [key: string]: {
        allow?: string[] | boolean[] | "*";
        validate?: (value: SettingValue) => boolean;
        default: SettingValue;
    };
}
export interface UnknownSettings {
    [key: string]: SettingValue;
}
export interface Config {
    key: string;
}
export interface TAlexandriaContext<TypedSettings> {
    settings: TypedSettings;
    setSettings: Dispatch<SetStateAction<TypedSettings>>;
    schema: Schema;
    config: Config;
}
