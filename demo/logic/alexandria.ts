import { createAlexandria } from "@xplato/alexandria"
import { schema } from "./schema"

interface Settings {
	accent: string
	darkMode: boolean
	theme: string
}

export const Alexandria = createAlexandria<Settings>(schema)

export const useAlexandria = Alexandria.Consumer
