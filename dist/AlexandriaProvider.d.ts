import React from "react";
import type { Config, Schema, UnknownSettings } from "rtypes";
interface Props {
    schema: Schema;
    config?: Config;
    children: React.ReactNode;
}
export declare const AlexandriaProvider: <KnownSettings extends UnknownSettings = UnknownSettings>({ schema, config: userConfig, children, }: Props) => JSX.Element;
export {};
