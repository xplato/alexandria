import React from "react";
import { Schema, UnknownSettings } from "types";
export declare const createAlexandria: <KnownSettings extends UnknownSettings = {}>(schema: Schema) => {
    Provider: ({ children }: {
        children: React.ReactNode;
    }) => JSX.Element;
    Consumer: () => import("./types").AlexandriaOperatingContext & KnownSettings;
};
