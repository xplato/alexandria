import { useAlexandria } from "../logic"

const Home = () => {
	const alexandria = useAlexandria()

	const decrement = () => {
    alexandria.set("count", alexandria.count - 1)
  }

	const increment = () => {
    alexandria.set("count", alexandria.count + 1)
  }

	if (!alexandria.ready) return null

	return (
		<div className="p-2r">
			<code>{JSON.stringify(alexandria)}</code>

			<div className="mt-2r">
				<button onClick={decrement}>-</button>
				<button onClick={increment}>+</button>
			</div>
		</div>
	)
}

export default Home
