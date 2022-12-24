import { useAlexandria } from "../logic"

const Home = () => {
	const alexandria = useAlexandria()

	if (!alexandria.ready) return null

	return (
		<section className="section">
			<div className="container">
				<h1>Alexandria</h1>

				<div className="w-100p">
					<pre>
						<code>{JSON.stringify(alexandria)}</code>
					</pre>

					<div className="flex">
						<a
							className="j-link underline mt-2r"
							onClick={() => alexandria.set("accent", "red")}
						>
							set
						</a>
						<a
							className="j-link underline mt-2r"
							onClick={() =>
								alexandria.toggleBetween("accent", [
									"blue",
									"red",
								])
							}
						>
							toggleBetween("accent", ["blue", "red"])
						</a>
						<a
							className="j-link underline mt-2r"
							onClick={() => alexandria.toggle("darkMode")}
						>
							toggle("darkMode")
						</a>
						<a
							className="j-link underline mt-2r"
							onClick={() => alexandria.set("unknown", "value")}
						>
							set("unknown", "value")
						</a>
						<a
							className="j-link underline mt-2r"
							onClick={() =>
								alexandria.cycleBetween("theme", [
									"light",
									"dark",
									"system",
								])
							}
						>
							cycleBetween
						</a>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Home
