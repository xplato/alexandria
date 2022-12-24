import { createContext } from "react"

import { TAlexandriaContext } from "./types"

// export const AlexandriaContext = createContext<TAlexandriaContext<any>>({} as never)

export const createAlexandriaContext = <TypedSettings extends {}>() => {
	return createContext<TAlexandriaContext<TypedSettings>>({} as never)
}