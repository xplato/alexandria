import { alexandriaError } from "errors"
import { Schema, SettingValue, UnknownSettings } from "types"

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

export const compileDefaultSettingsFromSchema = (
	schema: Schema
): UnknownSettings => {
	let settings: Partial<UnknownSettings> = {}

	if (typeof schema !== "object") {
		throw alexandriaError("invalidSchema", schema)
	}

	if (Object.keys(schema || {}).length === 0) {
		throw alexandriaError("emptySchema")
	}

	for (const [key, value] of Object.entries(schema || {})) {
		settings[key] = value.default
	}

	return settings as UnknownSettings // Caller is responsible for providing defaults
}
