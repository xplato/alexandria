import React, { useState } from "react"

import { AlexandriaContext } from "context"
import { getSavedObject } from "storage"
import { compileDefaultSettingsFromSchema } from "logic"

import type { Config, Schema, UnknownSettings } from "types"

const defaultConfig: Config = {
	key: "alexandria",
}

interface Props {
	schema: Schema
	config?: Config
	children: React.ReactNode
}

export const AlexandriaProvider = ({
	schema,
	config: userConfig,
	children,
}: Props) => {
	const config: Config = {
		...defaultConfig,
		...userConfig,
	}

	const defaultSettings = compileDefaultSettingsFromSchema(
		schema
	) as UnknownSettings

	const loadSettings = (): UnknownSettings => {
		return getSavedObject(config.key, defaultSettings)
	}

	const [settings, setSettings] = useState<UnknownSettings>(() => {
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
