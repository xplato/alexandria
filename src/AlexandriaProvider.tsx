import { alexandriaError } from "errors"
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react"

import { getSavedObject, saveObject } from "storage"

import type { Config, Schema, Settings, SettingValue } from "types"

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
	const config = {
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

	const validateSettings = useCallback(
		(settings: Settings) => {
			let newSettings: Partial<Settings> = {}

			for (const [key, value] of Object.entries(settings)) {
				const known = isKnownSetting(key)
				const allowed = isAllowedValue(key, value, schema)

				if (known && allowed) {
					newSettings[key] = value as never
					return
				}

				if (!allowed) {
					newSettings[key] = schema[key].default
					console.warn(
						`Alexandria: Value "${value}" is not allowed for setting "${key}". Using default value.`
					)
				}
			}

			if (
				JSON.stringify(newSettings) === JSON.stringify(loadSettings())
			) {
				return undefined
			}

			return newSettings
		},
		[settings]
	)

	useEffect(() => {
		const savedSettings = loadSettings()

		if (Object.keys(savedSettings).length === 0) {
			setSettings(defaultSettings)
		}
	}, [])

	useEffect(() => {
		const validatedSettings = validateSettings(settings)
		if (typeof validatedSettings === "undefined") return
		saveObject(config.key, validatedSettings)
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

		setSettings(settings => ({
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

		setSettings(settings => ({
			...settings,
			[key]: defaultSettings[key],
		}))
	}

	const set = (key: keyof Settings, value: any) => {
		throwIfUnknownSetting(key)
		setSettings(settings => ({ ...settings, [key]: value }))
	}

	const toggle = (key: keyof Settings) => {
		throwIfUnknownSetting(key)
		setSettings(settings => ({
			...settings,
			[key]: !settings[key],
		}))
	}

	const toggleBetween = (key: keyof Settings, values: [string, string]) => {
		throwIfUnknownSetting(key)
		setSettings(settings => ({
			...settings,
			[key]: settings[key] === values[0] ? values[1] : values[0],
		}))
	}

	const update = useCallback(
		(newSettings: Partial<Settings>) => {
			setSettings(settings => {
				const mergedNew = { ...settings, ...newSettings }
				const validatedSettings = validateSettings(
					mergedNew as Settings
				)
				return validatedSettings as Settings
			})
		},
		[settings]
	)

	return (
		<SettingsContext.Provider
			value={{
				...settings,

				cycleBetween,
				reset,
				set,
				toggle,
				toggleBetween,
				update,
			}}
		>
			{children}
		</SettingsContext.Provider>
	)
}

export const useAlexandria = () => {
	return useContext(SettingsContext)
}
