import { AlexandriaSchema } from "@xplato/alexandria"

export const schema: AlexandriaSchema = {
	color: {
		allow: ["blue", "red"],
		default: "blue",
	},
	isDark: {
		allow: [true, false],
		default: false,
	},
}
