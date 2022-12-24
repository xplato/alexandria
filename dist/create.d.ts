import { AlexandriaCreationContext, Schema, UnknownSettings } from "types";
export declare const createAlexandria: <KnownSettings extends UnknownSettings>(schema: Schema) => AlexandriaCreationContext<KnownSettings>;
