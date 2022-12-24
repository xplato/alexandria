export const schema = {
	accent: {
		allow: ["blue", "red"],
		default: "blue",
	},
	darkMode: {
		allow: [true, false],
		default: false,
	},
	theme: {
		allow: ["light", "dark", "system"],
		default: "system",
	},
}
