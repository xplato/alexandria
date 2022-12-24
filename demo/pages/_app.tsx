import { AlexandriaProvider } from "@xplato/alexandria"

import type { AppProps } from "next/app"

import "../styles/jupiterui.css"
import "../styles/global.css"
import { Alexandria } from "../logic"

interface Settings {
	accent: "blue" | "red"
	darkMode: boolean
	theme: "light" | "dark" | "system"
}

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<Alexandria.Provider>
			<Component {...pageProps} />
		</Alexandria.Provider>
	)
}

export default App
