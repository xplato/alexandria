import { AlexandriaSchema } from "./types";
export declare const errors: {
    unknownSetting: (key: string) => string;
    invalidSettingValue: (key: string, value: string, schema: AlexandriaSchema) => string;
    invalidSchema: (schema: unknown) => string;
    emptySchema: () => string;
};
export declare const alexandriaError: (key: string, ...args: any[]) => Error;
