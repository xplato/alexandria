import { Dispatch, SetStateAction } from "react"

export interface AlexandriaOperatingContext<TypedSettings> {
	ready: boolean
	cycleBetween: (key: keyof TypedSettings, values: string[]) => void
	reset: (key?: keyof TypedSettings) => void
	set: <Key extends keyof TypedSettings>(
		key: Key,
		value: TypedSettings[Key]
	) => void
	toggle: (key: keyof TypedSettings) => void
	toggleBetween: <Key extends keyof TypedSettings>(
		key: Key,
		values: TypedSettings[Key][]
	) => void
}

export type AlexandriaSetting = string | boolean | number | unknown[] | object

export interface AlexandriaSchema {
	[key: string]: {
		allow?: string[] | boolean[] | "*"
		validate?: (value: AlexandriaSetting) => boolean
		default: AlexandriaSetting
	}
}

export interface AlexandriaConfig {
	key: string
}

export interface TAlexandriaContext<TypedSettings> {
	settings: TypedSettings
	setSettings: Dispatch<SetStateAction<TypedSettings>>
	schema: AlexandriaSchema
	config: AlexandriaConfig
}
