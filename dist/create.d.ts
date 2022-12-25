import React from "react";
import { AlexandriaConfig, AlexandriaSchema } from "./types";
export declare const createAlexandria: <TypedSettings extends {}>(schema: AlexandriaSchema, config?: AlexandriaConfig | undefined) => {
    Provider: ({ children }: {
        children: React.ReactNode;
    }) => JSX.Element;
    useConsumer: () => import("./types").AlexandriaOperatingContext<TypedSettings> & TypedSettings;
};
