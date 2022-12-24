const isServer = typeof window === "undefined"

export const saveObject = <T>(key: string, value: T): void => {
	if (isServer) return

	try {
		localStorage.setItem(key, JSON.stringify(value))
	} catch (e) {
		// Unsupported
	}
}

export const getBlob = (key: string): string | undefined => {
	if (isServer) return undefined

	let blob

	try {
		blob = localStorage.getItem(key) || undefined
	} catch (e) {
		// Unsupported
	}

	return blob || undefined
}

export const getSavedObject = <T>(key: string, fallback: T): T => {
	const blob = getBlob(key)

	if (typeof blob === "undefined") {
		saveObject(key, fallback)
		return fallback
	}

	return JSON.parse(blob)
}
