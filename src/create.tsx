import React from "react"

import { AlexandriaProvider } from "./AlexandriaProvider"
import { useAlexandria } from "./useAlexandria"

import { AlexandriaConfig, AlexandriaSchema } from "./types"

export const createAlexandria = <TypedSettings extends {}>(
	schema: AlexandriaSchema,
	config?: AlexandriaConfig
) => {
	const Provider = ({ children }: { children: React.ReactNode }) => (
		<AlexandriaProvider<TypedSettings> schema={schema} config={config}>
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
