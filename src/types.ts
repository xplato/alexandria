import { Dispatch, SetStateAction } from "react"

export interface AlexandriaOperatingContext {
	ready: boolean
	cycleBetween: (key: string, values: string[]) => void
	reset: (key?: string) => void
	set: (key: string, value: SettingValue) => void
	toggle: (key: string) => void
	toggleBetween: (key: string, values: string[]) => void
}

export type SettingValue = string | boolean | number | unknown[] | object

export interface Schema {
	[key: string]: {
		allow: string[] | boolean[] | "*" | undefined
		validate: ((value: SettingValue) => boolean) | undefined
		default: SettingValue
	}
}

export interface UnknownSettings {
	[key: string]: SettingValue
}

export interface Config {
	key: string
}

export interface TAlexandriaContext {
	settings: UnknownSettings
	setSettings: Dispatch<SetStateAction<UnknownSettings>>
	schema: Schema
	config: Config
}
