import React from "react";
import type { AlexandriaConfig, AlexandriaSchema } from "./types";
interface Props {
    schema: AlexandriaSchema;
    config?: AlexandriaConfig;
    children: React.ReactNode;
}
export declare const AlexandriaProvider: <TypedSettings extends {}>({ schema, config: userConfig, children, }: Props) => JSX.Element;
export {};
