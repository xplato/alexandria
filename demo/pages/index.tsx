import { useAlexandria } from "../logic"

const Home = () => {
	const alexandria = useAlexandria()

	const onButton1Click = () => {
		alexandria.set("color", "blue")
	}

	const onButton2Click = () => {
		alexandria.toggleBetween("color", ["blue", "red"])
	}

	if (!alexandria.ready) return null

	return (
		<div className="p-2r">
			<code>{JSON.stringify(alexandria)}</code>

			<div className="mt-2r">
				<button onClick={onButton1Click}>Button 1</button>
				<button onClick={onButton2Click}>Button 2</button>
			</div>
		</div>
	)
}

export default Home
