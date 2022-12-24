import { alexandriaError } from "./errors"
import { Schema, SettingValue } from "./types"

export const isAllowedValue = (
	key: string,
	value: SettingValue,
	schema: Schema
): boolean => {
	const setting = schema[key]

	if (
		typeof setting === "undefined" ||
		(typeof setting.allow === "undefined" &&
			typeof setting.validate === "undefined")
	) {
		return false
	}

	if (!setting) return false
	if (setting.allow === "*") return true

	if (typeof setting.validate === "function") {
		const valid = setting.validate(value)
		if (valid) return true
		return false
	}

	if (typeof setting.allow === "undefined") return false
	return setting.allow.includes(value as never)
}

export const compileDefaultSettingsFromSchema = <TypedSettings extends {}>(
	schema: Schema
): TypedSettings => {
	let settings: Partial<TypedSettings> = {}

	if (typeof schema !== "object") {
		throw alexandriaError("invalidSchema", schema)
	}

	if (Object.keys(schema || {}).length === 0) {
		throw alexandriaError("emptySchema")
	}

	for (const [key, value] of Object.entries(schema || {})) {
		settings[key] = value.default
	}

	return settings as TypedSettings // Caller is responsible for providing defaults
}
