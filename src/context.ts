import { createContext } from "react"

import { TAlexandriaContext } from "./types"

// Consumers must cast this to TAlexandriaContext<TypedSettings>
export const AlexandriaContext = createContext<TAlexandriaContext<any>>(
	{} as never
)
