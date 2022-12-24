import { alexandriaError } from "errors"
import React, { createContext, useContext, useState, useEffect } from "react"

import { getSavedObject, saveObject } from "storage"

import type { Alexandria, Config, Schema, Settings, SettingValue } from "types"

const SettingsContext = createContext<any>({})

const compileDefaultSettingsFromSchema = (schema: Schema): Settings => {
	let settings: Partial<Settings> = {}

	for (const [key, value] of Object.entries(schema)) {
		settings[key] = value.default
	}

	return settings as Settings // Caller is responsible for providing defaults
}

const isAllowedValue = (
	key: keyof Settings,
	value: SettingValue,
	schema: Schema
): boolean => {
	const setting = schema[key]

	if (
		typeof setting === "undefined" ||
		(typeof setting.allow === "undefined" &&
			typeof setting.validate === "undefined")
	) {
		console.warn(
			`Alexandria: Setting "${key}" is not defined in the schema.`
		)
		return false
	}

	if (!setting) return false
	if (setting.allow === "*") return true

	if (typeof setting.validate === "function") {
		const valid = setting.validate(value)

		if (valid) return true

		console.warn(
			`Alexandria: Value "${value}" is not allowed for setting "${key}". Using default value.`
		)
		return false
	}

	if (typeof setting.allow === "undefined") return false
	return setting.allow.includes(value as never)
}

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
	const knownSettings = Object.keys(defaultSettings) as (keyof Settings)[]

	const isKnownSetting = (key: keyof Settings): boolean =>
		knownSettings.includes(key)

	const loadSettings = (): Partial<Settings> => {
		return getSavedObject(config.key, defaultSettings)
	}

	//////////

	const [settings, setSettings] = useState<Settings>(() => {
		return {
			...defaultSettings,
			...loadSettings(),
		} as Settings
	})

	const validateSettings = (settingsToValidate: Settings): Settings => {
		let newSettings: Partial<Settings> = {}

		for (const [key, value] of Object.entries(settingsToValidate)) {
			const known = isKnownSetting(key)
			const allowed = isAllowedValue(key, value, schema)

			if (known) {
				if (allowed) {
					newSettings[key] = value as never
				} else {
					newSettings[key] = settings[key]
					throw alexandriaError(
						"invalidSettingValue",
						key,
						value,
						schema
					)
				}
			}
		}

		return newSettings as Settings
	}

	const setWithValidation = (cb: (settings: Settings) => Settings) => {
		setSettings(settings => validateSettings(cb(settings)))
	}

	useEffect(() => {
		const savedSettings = loadSettings()

		if (Object.keys(savedSettings).length === 0) {
			setSettings(defaultSettings)
		}
	}, [])

	useEffect(() => {
		// const validatedSettings = validateSettings(settings)
		if (JSON.stringify(loadSettings()) !== JSON.stringify(settings)) {
			saveObject(config.key, settings)
		}
	}, [settings])

	//////////

	const throwIfUnknownSetting = (key: keyof Settings) => {
		if (!isKnownSetting(key)) {
			throw alexandriaError("unknownSetting", key)
		}
	}

	//////////

	const cycleBetween = (key: keyof Settings, values: string[]) => {
		throwIfUnknownSetting(key)

		const index = values.indexOf(settings[key] as string)
		const nextIndex = index === values.length - 1 ? 0 : index + 1

		setWithValidation(settings => ({
			...settings,
			[key]: values[nextIndex],
		}))
	}

	const reset = (key?: keyof Settings) => {
		if (typeof key === "undefined") {
			setSettings(defaultSettings)
			return
		}

		throwIfUnknownSetting(key)

		setWithValidation(settings => ({
			...settings,
			[key]: defaultSettings[key],
		}))
	}

	const set = (key: keyof Settings, value: any) => {
		throwIfUnknownSetting(key)

		if (settings[key] === value) return
		setSettings(settings => validateSettings({ ...settings, [key]: value }))
	}

	const toggle = (key: keyof Settings) => {
		throwIfUnknownSetting(key)
		setWithValidation(settings => ({
			...settings,
			[key]: !settings[key],
		}))
	}

	const toggleBetween = (key: keyof Settings, values: [string, string]) => {
		throwIfUnknownSetting(key)
		setWithValidation(settings => ({
			...settings,
			[key]: settings[key] === values[0] ? values[1] : values[0],
		}))
	}

	const alexandria: Alexandria = {
		...settings,

		ready: typeof window !== "undefined" || false,
		cycleBetween,
		reset,
		set,
		toggle,
		toggleBetween,
	}

	return (
		<SettingsContext.Provider value={alexandria}>
			{children}
		</SettingsContext.Provider>
	)
}

export const useAlexandria = (): Alexandria => {
	return useContext(SettingsContext)
}
