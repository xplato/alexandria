import { Dispatch, SetStateAction } from "react"

export interface Alexandria extends Settings {
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

export interface Settings {
	[key: string]: SettingValue
}

export interface Config {
	key: string
}

export interface AlexandriaContext {
	settings: Settings
	setSettings: Dispatch<SetStateAction<Settings>>
	schema: Schema
	config: Config
}
