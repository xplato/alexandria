import React from "react";
import type { Config, Schema } from "./types";
interface Props {
    schema: Schema;
    config?: Config;
    children: React.ReactNode;
}
export declare const AlexandriaProvider: <TypedSettings extends {}>({ schema, config: userConfig, children, }: Props) => JSX.Element;
export {};
