import { createAlexandria } from "@xplato/alexandria"
import { schema } from "./schema"

interface Settings {
	count: number
	isDark: boolean
}

const Alexandria = createAlexandria<Settings>(schema)
export const AlexandriaProvider = Alexandria.Provider
export const useAlexandria = Alexandria.useConsumer
