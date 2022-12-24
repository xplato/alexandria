import React, { useState } from "react"

import { AlexandriaContext } from "context"
import { getSavedObject } from "storage"
import { compileDefaultSettingsFromSchema } from "logic"

import type { Config, Schema, UnknownSettings } from "rtypes"

const defaultConfig: Config = {
	key: "alexandria",
}

interface Props {
	schema: Schema
	config?: Config
	children: React.ReactNode
}

export const AlexandriaProvider = <
	KnownSettings extends UnknownSettings = UnknownSettings
>({
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
	) as KnownSettings

	const loadSettings = (): KnownSettings => {
		return getSavedObject(config.key, defaultSettings)
	}

	const [settings, setSettings] = useState<KnownSettings>(() => {
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
