import React from "react"

import { AlexandriaProvider } from "./AlexandriaProvider"
import { useAlexandria } from "./useAlexandria"

import { AlexandriaSchema } from "./types"

export const createAlexandria = <TypedSettings extends {}>(
	schema: AlexandriaSchema
) => {
	const Provider = ({ children }: { children: React.ReactNode }) => (
		<AlexandriaProvider<TypedSettings> schema={schema}>
			{children}
		</AlexandriaProvider>
	)

	const useConsumer = () => {
		return useAlexandria<TypedSettings>()
	}

	return {
		Provider,
		useConsumer,
	}
}
