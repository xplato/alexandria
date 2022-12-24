import { useContext, useEffect, useState } from "react"

import { AlexandriaContext } from "context"
import { compileDefaultSettingsFromSchema, isAllowedValue } from "logic"
import { getSavedObject, saveObject } from "storage"
import { alexandriaError } from "errors"

import { AlexandriaOperatingContext, UnknownSettings } from "rtypes"

export const useAlexandria = <
	KnownSettings extends UnknownSettings = UnknownSettings
>(): AlexandriaOperatingContext & KnownSettings => {
	const { settings, setSettings, schema, config } =
		useContext(AlexandriaContext)

	// type KnownSettings = typeof settings

	const defaultSettings = compileDefaultSettingsFromSchema(schema)

	const [isServer, setIsServer] = useState(true)

	const knownSettings = Object.keys(
		defaultSettings
	) as (keyof KnownSettings)[]
	const isKnownSetting = (key: keyof KnownSettings): boolean =>
		knownSettings.includes(key)

	const validateSettings = (
		settingsToValidate: KnownSettings
	): KnownSettings => {
		let newSettings: Partial<KnownSettings> = {}

		for (const [key, value] of Object.entries(settingsToValidate)) {
			const known = isKnownSetting(key)
			const allowed = isAllowedValue(key, value, schema)

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

		return newSettings as KnownSettings
	}

	const setWithValidation = (
		cb: (settings: KnownSettings) => KnownSettings
	) => {
		setSettings(settings => validateSettings(cb(settings as KnownSettings)))
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

		setSettings(validateSettings(savedSettings as KnownSettings))
	}, [])

	useEffect(() => {
		if (JSON.stringify(loadSettings()) !== JSON.stringify(settings)) {
			saveObject(config.key, settings)
		}
	}, [settings])

	//////////

	const throwIfUnknownSetting = (key: keyof KnownSettings) => {
		if (!isKnownSetting(key)) {
			throw alexandriaError("unknownSetting", key)
		}
	}

	//////////

	const cycleBetween = (key: keyof KnownSettings, values: string[]) => {
		throwIfUnknownSetting(key)

		// @ts-ignore
		const index = values.indexOf(settings[key] as string)
		const nextIndex = index === values.length - 1 ? 0 : index + 1

		setWithValidation(settings => ({
			...settings,
			[key]: values[nextIndex],
		}))
	}

	const reset = (key?: keyof KnownSettings) => {
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

	const set = (key: keyof KnownSettings, value: any) => {
		throwIfUnknownSetting(key)

		// @ts-ignore
		if (settings[key] === value) return
		// @ts-ignore
		setSettings(settings => validateSettings({ ...settings, [key]: value }))
	}

	const toggle = (key: keyof KnownSettings) => {
		throwIfUnknownSetting(key)
		setWithValidation(settings => ({
			...settings,
			[key]: !settings[key],
		}))
	}

	const toggleBetween = (
		key: keyof KnownSettings,
		values: [string, string]
	) => {
		throwIfUnknownSetting(key)
		setWithValidation(settings => ({
			...settings,
			[key]: settings[key] === values[0] ? values[1] : values[0],
		}))
	}

	const operatingContext: AlexandriaOperatingContext = {
		ready: !isServer,
		cycleBetween,
		reset,
		set,
		toggle,
		toggleBetween,
	}

	// @ts-ignore
	const alexandria: AlexandriaOperatingContext & KnownSettings = {
		...settings,
		...operatingContext,
	}

	// @ts-ignore
	return alexandria
}
