const
stub = m => console.log(m),
utf8=new TextDecoder();

let
page_id=-1;

export const

http = endpoint => query => fetch(endpoint+query+ (page_id>0?"&PAGEID="+page_id:"") ).then(response=>response.text()),

wsocket = endpoint => {
	
	let
	interval_ping,
	last_ping = Date.now()
	;
	
	const

	commands = {
		
		CURRENT_ID: id => page_id=id,
		ACTIVE_ID:	id => { if(page_id != id) stub('Disable_interface()'); },
		// DHT: Handle_DHT,
		
		MSG: (code,message) => {
		    console.log(`MSG ${code}: ${message}`);
		    stub('CancelCurrentUpload()');
		},

		ERROR: (code,message) => {
		    console.warn(`ERROR ${code}: ${message}`);
		    stub('CancelCurrentUpload()');
		},
		
		PING:	id => { 
			//if (!enable_ping)return;
			page_id = id;
			last_ping = Date.now();
			if (!interval_ping)
			interval_ping = setInterval(
				() => (Date.now()-last_ping > 9e3) && console.log("ping lost"),
				20e3
			);
		}
	},

	handle = {
		binaryType: "arraybuffer",
		onopen:	e => console.log("Connected"),
		onclose:	e => console.log("Disonnected"),
		onerror:	e => console.warn("ws error", e),
		onmessage:	e => {
			
			if (e.data instanceof ArrayBuffer) {
				const msgs = utf8.decode(e.data);
				msgs.forEach(msg=>{
					msg && console.log("Yay! "+msg);
				    //Monitor_output_Update(wsmsg);
				    //process_socket_response(wsmsg);
				})
			}else{
				const msg = e.data.split(":"),
					command = commands[msg.shift()];
				if(command)
					command(...msg);
			}
		}
	};

	return Object.assign(new WebSocket(endpoint,["arduino"]), handle);
};