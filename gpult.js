//	'jog'	.d("btn @Xup'X+ @Xdn'X- @Yup'Y+ @Ydn'Y- @Zup`Z- @Zdn`Z-").u("cmd (jog $feed $step)")

import {Paged,E,stylize,numpad,keypad,commandpad,filepick,upload,progress} from "./controls.js";
import machine from "./machines/grbl.js";

//import _ from "./state.js";

stylize("lang/default.json", ([selector,label]) =>`${selector}::before{content:"${label}"}`);

const

_ = machine.vars,

app = Paged({
	
	""
	:E("section start",null),

	Connect
	:E("section connect"),

	Idle
	:E("section idle", null, [
		
		numpad("pos", "x y z", (axis,num) => machine.command.G(`G92 ${axis}${num}`) ), // F${_.jog_feed}
		
		keypad("jog", {
			Xup: 'X+',
			Xdn: 'X-',
			Yup: 'Y+',
			Ydn: 'Y-',
			Zup: 'Z+',
			Zdn: 'Z-'
			},
			axis => machine.command.jog(`G91 G21 F${_.jog_feed} ${axis}${_.jog_step}`)
		),
		
		//jumper("jog_step", step => _.jog_step=step, "0.01 0.10 1.00 10.0"), 
		
		numpad("jog", "jog_feed jog_step", (param,num) => {_[param]=num} ),
		 
		keypad("home", {
			x: 'G0 X0',
			y: 'G0 Y0',
			z: 'G0 Z0'
		}),
		
		commandpad,
		
		keypad("macros", {
			mist:'M'
		}),
		
		E("div jobs",{},[
			filepick("job", machine.run, machine.jobs ),
			upload("upload", machine.upload )
		])
	]),
	
	Run
	:E("section run", null, [

		progress("job"),
			
		keypad('overrides', {
			"F": "feed +"
		}),
		
		keypad('mcodes', {
			mist:'M'
		})
	
	]),
	
	Hold
	:E("section hold"),
	
	Alarm
	:E("section alarm")
});

app("Idle");