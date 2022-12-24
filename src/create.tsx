import React from "react"

import { AlexandriaProvider } from "./AlexandriaProvider"
import { useAlexandria } from "./useAlexandria"

import { Schema } from "./types"

export const createAlexandria = <TypedSettings extends {}>(schema: Schema) => {
	const Provider = ({ children }: { children: React.ReactNode }) => (
		<AlexandriaProvider<TypedSettings> schema={schema}>
			{children}
		</AlexandriaProvider>
	)

	const Consumer = () => {
		return useAlexandria<TypedSettings>()
	}

	return {
		Provider,
		Consumer,
	}
}
