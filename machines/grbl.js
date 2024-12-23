import {app} from "../gpult.js";
import {update} from "../controls.js";

app("Idle");

const
un = str => str.substing(1,str.length-2),
log = console.log,

states = {Jog:"Idle"},

	request = http(_.http), //stub, //
	replies = wsocket(_.ws), //stub, //
	

handlers = {
	
	"<"
	:( parse => str => {
		const data = un(str).split('|'),
			state = data.shift(); //Idle|Jog|Run|Hold
			
		app(states[state]||state);
			
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
	
	"[":
	str => {
	const data = un(str).split(/\:/);
	switch(data.shift()){
		case "GC" : return // G-state // GC:G0 G54 G17 G21 G91 G94 M5 M9 T0 F6000 S0
		case "MSG": return // Gcode error // MSG:INFO: MSG:ERR: 
		default: return
	},
	
	"Grbl"
	: str => alert('Machine reset detected')
	
/*
{
	"ok"		:
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

},

command = => request (`command?commandText=`+encodeURIComponent(t)),

	
export const

message = {
	
	handle: ((handlers,keys) => msg => {
		const key = keys.find( key => msg.startsWith(key) );
		if(key)handlers[key](msg);
	})(handlers,Object.keys(handlers)),
	
	commands: {
		G	: command,
		jog	: t => command("$J="+t)
	}
	
	command = t => , //stub, //
}
