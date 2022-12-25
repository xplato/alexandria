import { AlexandriaSchema } from "./types"

const PREFIX = "Alexandria: "

export const errors = {
	unknownSetting: (key: string): string =>
		`UNKNOWN_SETTING_ERROR: "${key}" is not a valid setting. If it should be, please update your schema in the AlexandriaProvider. Your mutation has been ignored and the setting was not changed.`,
	invalidSettingValue: (
		key: string,
		value: string,
		schema: AlexandriaSchema
	): string =>
		`INVALID_SETTING_VALUE_ERROR: "${value}" is not an allowed value for setting "${key}". Your mutation has been ignored and the setting was not changed. The current allowed values are: ${schema[key].allow}. If you want to allow any value, set the "allow" property to "*".`,
	invalidSchema: (schema: unknown): string =>
		`INVALID_SCHEMA_ERROR: The schema provided to the AlexandriaProvider is invalid. Got: "${schema}"`,
	emptySchema: (): string =>
		`EMPTY_SCHEMA_ERROR: The schema provided to the AlexandriaProvider is empty. Please provide a schema with at least one setting.`,
}

export const alexandriaError = (key: string, ...args: any[]) => {
	const error = errors[key]

	if (typeof error === "undefined") {
		throw new Error(`UNKNOWN_ERROR: ${key}`)
	}

	return new Error(`${PREFIX}${error(...args)}`)
}
