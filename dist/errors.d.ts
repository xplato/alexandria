import { Schema } from "types";
export declare const errors: {
    unknownSetting: (key: string) => string;
    invalidSettingValue: (key: string, value: string, schema: Schema) => string;
};
export declare const alexandriaError: (key: string, ...args: any[]) => Error;