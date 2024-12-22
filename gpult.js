//	'jog'	.d("btn @Xup'X+ @Xdn'X- @Yup'Y+ @Ydn'Y- @Zup`Z- @Zdn`Z-").u("cmd (jog $feed $step)")

import {stylize,prep,command,div,numpad,keypad,filepick,upload} from "./controls.js";
import _ from "./state.js";

stylize("lang/default.json", ([key,label]) =>`${key}::before{content:"${label}"}`)

const app =[

div("connect pad",[
]),

div("idle pad", [
	
	numpad("pos", prep( axis => num => command(`G0 F${_.jog_feed} ${axis}${num}`), "X Y Z")),
	
	keypad("jog", prep( axis => () => command(`$J=G91 G21 F${_.jog_feed} ${axis}${_.jog_step}`), {
		Xup: 'X+',
		Xdn: 'X-',
		Yup: 'Y+',
		Ydn: 'Y-',
		Zup: 'Z+',
		Zdn: 'Z-'
	})),
	
	//jumper("jog_step", step => _.jog_step=step, "0.01 0.10 1.00 10.0"), 
	
	numpad("jog", prep( param => num => {_[param]=num}, "jog_feed jog_step" )),
	 
	keypad("home", {
		x: 'G0 X0',
		y: 'G0 Y0',
		z: 'G0 Z0'
	}),
	
	div("files",[
		filepick("job"),
		upload("upload"),
	]),
	
]),

div("run pad",

	progress("job"),
	
	keypad('overrides', {
	}),
	
	keypad('mcodes', {
		mist:'M'
	})
	
];



document.body.append(app); //documentElement.
