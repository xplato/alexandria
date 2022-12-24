import React from "react";
import { Schema } from "./types";
export declare const createAlexandria: <TypedSettings extends {}>(schema: Schema) => {
    Provider: ({ children }: {
        children: React.ReactNode;
    }) => JSX.Element;
    useConsumer: () => import("./types").AlexandriaOperatingContext<TypedSettings> & TypedSettings;
};
