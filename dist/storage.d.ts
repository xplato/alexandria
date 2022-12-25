export declare const saveObject: <T>(key: string, value: T) => void;
export declare const getBlob: (key: string) => string | undefined;
export declare const getSavedObject: <T>(key: string, fallback: T) => T;
