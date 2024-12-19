import "dap.js";

const
utf8=new TextDecoder(),
endpoint = async_webcommunication ? `${document.location.host}/ws` : `${ip}:${port}/`,

socket = endpoint => {
	
	const

	commands = {
		
		CURRENT_ID: id => { console.log("connection id = " + page_id=id ); },
		ACTIVE_ID:	id => { if(page_id != id) Disable_interface(); },
		DHT: Handle_DHT,
		
		MSG: (code,message) => {
		    console.log(`MSG ${code}: ${message}`);
		    CancelCurrentUpload();
		},

		ERROR: (code,message) => {
		    console.log(`ERROR ${code}: ${message}`);
		    CancelCurrentUpload();
		},
		
		PING:		id => { 
			if (!enable_ping)return;
			page_id = id;
			console.log("ping from id = " + page_id);
			last_ping = Date.now();
			
			if (!interval_ping)
			  interval_ping = setInterval( check_ping, 10e3 );
		}
	},

	handle = {
		binaryType: "arraybuffer",
		onopen:	e => console.log("Connected"),
		onclose:	e => console.log("Disonnected"),
		onerror:	e => console.log("ws error", e),
		onmessage:	e => {
			
			if (e.data instanceof ArrayBuffer) {
				const msgs = utf8.decode(e.data).split(/\n/g);
				msgs.forEach(msg=>{
				    Monitor_output_Update(wsmsg);
				    process_socket_response(wsmsg);
				})
			}else{
				const msg = e.data.split(":"),
					command = commands[msg.shift()];
				if(command)
					command(...msg);
			}
		}
	};

	try { return Object.assign(new WebSocket ("ws://"+endpoint, ["arduino"]), handle); }
	catch(e){ console.error(e); }
},

http = endpoint => {
	
	command = text=> `?commandText=$`
	
	return command => fetch(endpoint).then
}

