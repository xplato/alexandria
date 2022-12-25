import { AlexandriaProvider } from "../logic"

import type { AppProps } from "next/app"

import "../styles/jupiterui.css"
import "../styles/global.css"

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<AlexandriaProvider>
			<Component {...pageProps} />
		</AlexandriaProvider>
	)
}

export default App
