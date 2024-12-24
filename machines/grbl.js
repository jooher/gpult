import _ from "../state.js";

let
request,
page_id;

const
log = console.log,
stub = log,

connect = (events => url => {
		
	const nocors = {mode:"no-cors"}, //{},//
		ws = new WebSocket(`ws://${url}:81/`,["arduino"]);

	Object.assign(ws,events);
	page_id=-1;
	
	request = (query,specs) => fetch(`http://${url}/${query}`,specs||nocors);
	
	
})((()=>{
	let
	interval_ping,
	last_ping = Date.now();
		
	const
	utf8 = new TextDecoder(),
	un = str => str.substring(1,str.length-3),
	handle = {

		head :(handlers => str => {
			const msg = str.split(":"),
				handler = handlers[msg.shift()];
			if(handler)
				handler(...msg);
		})({
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
				if (!interval_ping)interval_ping = setInterval(
					() => (Date.now()-last_ping > 9e3) && console.log("ping lost"),
					20e3
				);
			}
		}),

		body :(handlers => msg => {
			const key = Object.keys(handlers).find( key => msg.startsWith(key) );
			if(key)handlers[key](msg);
		})({
			
			"<"
			:( parse => str => {
				const data = un(str).split('|'),
					state = data.shift(); //Idle|Jog|Run|Hold
					
				go(state);
					
				return data.map(tab => {
					const [head,data] = tab.split(":"),
						fun = parse[head];
					return fun && fun(data.split(","));
				})
			})({
				MPos	: ([x,y,z,a]) => update({x,y,z}),
				WCO	: xyza => {},
				Ov	: overrides => {},
				FS	: ([feed,spindle]) => {},
				SD	: ([percent,job]) => {}
			}),
			
			"["
			:str => {
				const data = un(str).split(/\:/);
				switch(data.shift()){
					case "GC" : 
						return update({GC:data});// G-state // GC:G0 G54 G17 G21 G91 G94 M5 M9 T0 F6000 S0
					case "MSG": return update({MSG:data});	// Gcode error // MSG:INFO: MSG:ERR: 
					default: return
				}
			},
			
		/*
			"ok"
			: str => command("?"),
			
				if (socket_is_settings) {
				  //update settings
				  getESPconfigSuccess(socket_response);
				  socket_is_settings = false;
				},
			"$0="		:{
				socket_is_settings = true;
				socket_response = msg;
			    }
			    if (socket_is_settings) socket_response += msg;
				
		}
		*/
		
			"Grbl"
			: str => alert('Machine reset detected:\n'+str)
			

		})

	};

	return {
		binaryType: "arraybuffer",
		onopen:	e => { console.log("Connected"); command("?"); }, //
		onclose:	e => go("Connect"),
		onerror:	e => go("Connect"),
		onmessage:	e => (e.data instanceof ArrayBuffer) ? handle.body(utf8.decode(e.data)) : handle.head(e.data)
	}
	
})()),

pageid = () => page_id>0?"&PAGEID="+page_id:"",
command = t => request(`command?commandText=${encodeURI(t)}${pageid()}`), //Component

update = updates => Object.assign(window.updates,updates), 
go = (same => state => window.gpult(same[state]||state))({Jog:"Idle",Hold:"Run"})
;

export default {
	
	vars: _,
	
	go,
	
	connect, // url =>
	command, // commandText =>
	jog	: t => command("$J="+t),
	
	run	: filename => confirm(`Run ${filename}?`) && command(`$SD/Run=/${filename}`),
	jobs	: () => request('upload?path=/')
			.then( response => response.json() )
			.then( json => json.files
				.filter(f=>f.size>0)
				.map(f=>({value:f.name, textContent:f.shortname}))
			),
					
	upload: file => request("upload?path=/", {method:"POST",body:file,mode:"no-cors"}),
	
	macros:{
		
		idle:{
			md	: '$MD', // Motors disable
			me	: '$ME', // Motors enable
		}
		
	}
	
}
