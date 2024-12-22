//	'jog'	.d("btn @Xup'X+ @Xdn'X- @Yup'Y+ @Ydn'Y- @Zup`Z- @Zdn`Z-").u("cmd (jog $feed $step)")

import {E,stylize,command,numpad,keypad,filepick,upload,progress} from "./controls.js";
import _ from "./state.js";

stylize("lang/default.json", ([selector,label]) =>`${selector}::before{content:"${label}"}`)

const app =[

	E("section connect", null

	),

	E("section idle", null, [
		
		numpad("pos", "X Y Z", (axis,num) => command(`G92 ${axis}${num}`) ), // F${_.jog_feed}
		
		keypad("jog", {
			Xup: 'X+',
			Xdn: 'X-',
			Yup: 'Y+',
			Ydn: 'Y-',
			Zup: 'Z+',
			Zdn: 'Z-'
			},
			axis => command(`$J=G91 G21 F${_.jog_feed} ${axis}${_.jog_step}`)
		),
		
		//jumper("jog_step", step => _.jog_step=step, "0.01 0.10 1.00 10.0"), 
		
		numpad("jog", "jog_feed jog_step", (param,num) => {_[param]=num} ),
		 
		keypad("home", {
			x: 'G0 X0',
			y: 'G0 Y0',
			z: 'G0 Z0'
		}),
		
		//div("files",[
		
			filepick("job", filename => confirm(`Run ${filename}?`) && command(`$SD/Run=/${filename}`)),
			
			upload("upload", file => fetch(_.http+"upload", {method:"POST",body:file}))
		//])
	]),

	E("section run", null, [

		progress("job"),
			
		keypad('overrides', {
			"F": "feed +"
		}),
		
		keypad('mcodes', {
			mist:'M'
		})
		
	])
]


document.body.append(...app); //documentElement.