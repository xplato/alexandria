import React, { useEffect, useState } from "react"

import { SettingsContext } from "context"
import { getSavedObject } from "storage"
import { compileDefaultSettingsFromSchema } from "logic"

import type { Config, Schema, Settings } from "types"

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

	const defaultSettings = compileDefaultSettingsFromSchema(schema)

	const loadSettings = () => {
		return getSavedObject(config.key, defaultSettings)
	}

	const [settings, setSettings] = useState<Settings>(() => {
		return {
			...defaultSettings,
			...loadSettings(),
		} as Settings
	})

	useEffect(() => {
		if (!window.localStorage) return

		const savedSettings = loadSettings()
		settings.current = savedSettings
	}, [])

	return (
		<SettingsContext.Provider
			value={{
				settings,
				setSettings,
				schema,
				config,
			}}
		>
			{children}
		</SettingsContext.Provider>
	)
}
