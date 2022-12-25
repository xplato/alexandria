import React from "react";
import { AlexandriaSchema } from "./types";
export declare const createAlexandria: <TypedSettings extends {}>(schema: AlexandriaSchema) => {
    Provider: ({ children }: {
        children: React.ReactNode;
    }) => JSX.Element;
    useConsumer: () => import("./types").AlexandriaOperatingContext<TypedSettings> & TypedSettings;
};
