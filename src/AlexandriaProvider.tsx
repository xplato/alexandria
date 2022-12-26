import React, { useState } from "react"

import { AlexandriaContext } from "./context"
import { getSavedObject } from "./storage"
import { compileDefaultSettingsFromSchema } from "./logic"

import type { AlexandriaConfig, AlexandriaSchema } from "./types"

const defaultConfig: AlexandriaConfig = {
	key: "alexandria",
}

interface Props {
	schema: AlexandriaSchema
	config?: AlexandriaConfig
	children: React.ReactNode
}

export const AlexandriaProvider = <TypedSettings extends {}>({
	schema,
	config: userConfig,
	children,
}: Props) => {
	const config: AlexandriaConfig = {
		...defaultConfig,
		...userConfig,
	}

	const defaultSettings =
		compileDefaultSettingsFromSchema<TypedSettings>(schema)

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
