import { Schema, Settings, SettingValue } from "types"

export const isAllowedValue = (
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

export const compileDefaultSettingsFromSchema = (schema: Schema): Settings => {
	let settings: Partial<Settings> = {}

	for (const [key, value] of Object.entries(schema)) {
		settings[key] = value.default
	}

	return settings as Settings // Caller is responsible for providing defaults
}
