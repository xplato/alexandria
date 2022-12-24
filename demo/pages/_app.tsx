import { AlexandriaProvider } from "@xplato/alexandria"

import type { AppProps } from "next/app"

import "../styles/jupiterui.css"
import "../styles/global.css"

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<AlexandriaProvider
			schema={{
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
				}
			}}
			config={{
				key: "alexandria",
			}}
		>
			<Component {...pageProps} />
		</AlexandriaProvider>
	)
}

export default App
