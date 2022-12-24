const PREFIX = "Alexandria: "

export const errors = {
	unknownSetting: (key: string): string => `UNKNOWN_SETTING_ERROR: ${key}`,
}

export const alexandriaError = (key: string, ...args: any[]) => {
	const error = errors[key]

	if (typeof error === "undefined") {
		throw new Error(`UNKNOWN_ERROR: ${key}`)
	}

	return new Error(`${PREFIX}${error(...args)}`)
}
