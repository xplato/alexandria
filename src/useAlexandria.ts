import { useContext, useEffect, useState } from "react"

import { createAlexandriaContext } from "./context"
import { compileDefaultSettingsFromSchema, isAllowedValue } from "./logic"
import { getSavedObject, saveObject } from "./storage"
import { alexandriaError } from "./errors"

import { AlexandriaOperatingContext, SettingValue } from "./types"

export const useAlexandria = <
	TypedSettings extends {}
>(): AlexandriaOperatingContext<TypedSettings> & TypedSettings => {
	const AlexandriaContext = createAlexandriaContext<TypedSettings>()

	const { settings, setSettings, schema, config } =
		useContext(AlexandriaContext)

	const defaultSettings =
		compileDefaultSettingsFromSchema<TypedSettings>(schema)

	const [isServer, setIsServer] = useState(true)

	const knownSettings = Object.keys(
		defaultSettings
	) as (keyof TypedSettings)[]
	const isKnownSetting = (key: keyof TypedSettings): boolean =>
		knownSettings.includes(key)

	const validateSettings = (
		settingsToValidate: TypedSettings
	): TypedSettings => {
		let newSettings: Partial<TypedSettings> = {}

		for (const [key, value] of Object.entries(settingsToValidate)) {
			const known = isKnownSetting(key as keyof TypedSettings)
			const allowed = isAllowedValue(key, value as SettingValue, schema)

			if (known) {
				if (allowed) {
					// @ts-ignore
					newSettings[key] = value as never
				} else {
					// @ts-ignore
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

		return newSettings as TypedSettings
	}

	const setWithValidation = (
		cb: (settings: TypedSettings) => TypedSettings
	) => {
		setSettings(settings => validateSettings(cb(settings as TypedSettings)))
	}

	const loadSettings = () => {
		return getSavedObject(config.key, defaultSettings)
	}

	useEffect(() => {
		if (!window.localStorage) return

		setIsServer(false)
		const savedSettings = loadSettings()

		if (Object.keys(savedSettings).length === 0) {
			setSettings(defaultSettings)
		}

		setSettings(validateSettings(savedSettings as TypedSettings))
	}, [])

	useEffect(() => {
		if (JSON.stringify(loadSettings()) !== JSON.stringify(settings)) {
			saveObject(config.key, settings)
		}
	}, [settings])

	//////////

	const throwIfUnknownSetting = (key: keyof TypedSettings) => {
		if (!isKnownSetting(key)) {
			throw alexandriaError("unknownSetting", key)
		}
	}

	//////////

	const cycleBetween = (key: keyof TypedSettings, values: string[]) => {
		throwIfUnknownSetting(key)

		// @ts-ignore
		const index = values.indexOf(settings[key] as string)
		const nextIndex = index === values.length - 1 ? 0 : index + 1

		setWithValidation(settings => ({
			...settings,
			[key]: values[nextIndex],
		}))
	}

	const reset = (key?: keyof TypedSettings) => {
		if (typeof key === "undefined") {
			setSettings(_ => defaultSettings)
			return
		}

		throwIfUnknownSetting(key)

		setWithValidation(settings => ({
			...settings,
			// @ts-ignore
			[key]: defaultSettings[key],
		}))
	}

	const set = (key: keyof TypedSettings, value: any) => {
		throwIfUnknownSetting(key)

		// @ts-ignore
		if (settings[key] === value) return
		// @ts-ignore
		setSettings(settings => validateSettings({ ...settings, [key]: value }))
	}

	const toggle = (key: keyof TypedSettings) => {
		throwIfUnknownSetting(key)
		setWithValidation(settings => ({
			...settings,
			[key]: !settings[key],
		}))
	}

	const toggleBetween = (
		key: keyof TypedSettings,
		values: [string, string]
	) => {
		throwIfUnknownSetting(key)
		setWithValidation(settings => ({
			...settings,
			// @ts-ignore
			[key]: settings[key] === values[0] ? values[1] : values[0],
		}))
	}

	const operatingContext: AlexandriaOperatingContext<TypedSettings> = {
		ready: !isServer,
		cycleBetween,
		reset,
		set,
		toggle,
		toggleBetween,
	}

	const alexandria: AlexandriaOperatingContext<TypedSettings> &
		TypedSettings = {
		...settings,
		...operatingContext,
	}

	return alexandria
}
