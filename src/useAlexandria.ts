import { useContext, useEffect, useState } from "react"

import { AlexandriaContext } from "context"
import { compileDefaultSettingsFromSchema, isAllowedValue } from "logic"
import { getSavedObject, saveObject } from "storage"
import { alexandriaError } from "errors"

import { Alexandria, Settings } from "types"

export const useAlexandria = (): Alexandria => {
	const { settings, setSettings, schema, config } =
		useContext(AlexandriaContext)
	const defaultSettings = compileDefaultSettingsFromSchema(schema)
	const [isServer, setIsServer] = useState(true)

	const knownSettings = Object.keys(defaultSettings) as (keyof Settings)[]
	const isKnownSetting = (key: keyof Settings): boolean =>
		knownSettings.includes(key)

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

		setSettings(validateSettings(savedSettings))
	}, [])

	useEffect(() => {
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
			setSettings(_ => defaultSettings)
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

		ready: !isServer,
		cycleBetween,
		reset,
		set,
		toggle,
		toggleBetween,
	}

	return alexandria
}
