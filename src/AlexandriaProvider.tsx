import React, { useState } from "react"

import { createAlexandriaContext } from "./context"
import { getSavedObject } from "./storage"
import { compileDefaultSettingsFromSchema } from "./logic"

import type { Config, Schema } from "./types"

const defaultConfig: Config = {
	key: "alexandria",
}

interface Props {
	schema: Schema
	config?: Config
	children: React.ReactNode
}

export const AlexandriaProvider = <TypedSettings extends {}>({
	schema,
	config: userConfig,
	children,
}: Props) => {
	const config: Config = {
		...defaultConfig,
		...userConfig,
	}

	const AlexandriaContext = createAlexandriaContext<TypedSettings>()

	const defaultSettings = compileDefaultSettingsFromSchema<TypedSettings>(
		schema
	) as TypedSettings

	const loadSettings = (): TypedSettings => {
		return getSavedObject(config.key, defaultSettings)
	}

	const [settings, setSettings] = useState<TypedSettings>(() => {
		return {
			...defaultSettings,
			...loadSettings(),
		}
	})

	return (
		<AlexandriaContext.Provider
			value={{
				settings,
				setSettings,
				schema,
				config,
			}}
		>
			{children}
		</AlexandriaContext.Provider>
	)
}
