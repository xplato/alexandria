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
