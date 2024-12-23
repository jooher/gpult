export const
wsocket = (endpoint,handle) => Object.assign(new WebSocket(endpoint,["arduino"]), {
	binaryType: "arraybuffer",
	onopen:	e => console.log("Connected"),
	onclose:	e => console.log("Disonnected"),
	onerror:	e => console.warn("ws error", e),
	onmessage:	e => (e.data instanceof ArrayBuffer) ? handle.body(utf8.decode(e.data)) : handle.head(e.data)
});
