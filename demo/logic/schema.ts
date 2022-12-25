import { AlexandriaSchema } from "@xplato/alexandria"

export const schema: AlexandriaSchema = {
	count: {
		default: 0,
		validate: (value: any) => typeof value === "number",
	},
	isDark: {
		allow: [true, false],
		default: false,
	},
}
