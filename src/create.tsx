import React from "react"

import { AlexandriaProvider } from "AlexandriaProvider"
import { useAlexandria } from "useAlexandria"

import {
	AlexandriaCreationContext,
	AlexandriaOperatingContext,
	Schema,
	UnknownSettings,
} from "rtypes"

export const createAlexandria = <KnownSettings extends UnknownSettings>(
	schema: Schema
): AlexandriaCreationContext<KnownSettings> => {
	type Alexandria = AlexandriaOperatingContext & KnownSettings

	const Provider = ({ children }: { children: React.ReactNode }) => (
		<AlexandriaProvider<KnownSettings> schema={schema}>
			{children}
		</AlexandriaProvider>
	)

	const Consumer = (): Alexandria => {
		return useAlexandria<KnownSettings>()
	}

	return {
		Provider,
		Consumer,
	}
}
