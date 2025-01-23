import {o,stylize,Pages,Msglog,Numpad,Keypad,Commandpad,Rheo,Filepick,Upload,Macros,Progress} from "./controls.js";
import machine from "./machines/grbl.js";

stylize("lang/default.json", ([selector,label]) =>`${selector}::before{content:"${label}"}`);

const	_ = machine.vars,
	command = machine.command,
	axes = "x y z";

window.gpult = Pages({

	Connect
	:o("section connect",null,[
	
		Msglog("msg"),
	
		o("div bar", null, [
			o("select",
				{ onchange: e => machine.connect(e.target.value) },
				_.urls.map(url=>o("option",{textContent:url}))
			),
			o("button connect",
				{ onclick: e => machine.connect(e.target.previousSibling.value) }
			)
		])
		
	]),

	Idle
	:o("section idle", null, [
	
		o('input state',{id:"gc",disabled:"disabled"}),
		
		Commandpad,
		
		Macros("idle"),				
		 
		Keypad("home bar", axes, axis => 
			confirm(`Home axis ${axis}?`) && command(`G53 G0 ${axis}0`)
		),
		
		Numpad("pos", axes, (axis,num) => command(`G92 ${axis}${num}`) ), // F${_.jog_feed}
		
		Keypad("jog", {
			Xup: 'X+',
			Xdn: 'X-',
			Yup: 'Y+',
			Ydn: 'Y-',
			Zup: 'Z+',
			Zdn: 'Z-'
			},
			axis => machine.jog(`G91 G21 F${_.jog_feed} ${axis}${_.jog_step}`)
		),
		
		//jumper("jog_step", step => _.jog_step=step, "0.01 0.10 1.00 10.0"), 
		
		Numpad("jog", "jog_feed jog_step", (param,num) => {_[param]=num} ),
		o("div jobs bar", null, [
			Filepick("job", machine.run, machine.jobs ),
			Upload("Upload", machine.Upload )
		])
	]),
	
	Run
	:o("section run", null, [

		//fileinfo("jobinfo"),

		Progress("jobProgress"),
			
		Rheo("feed", percent => {} ),
		Rheo("spindle", percent => {} ),
		
		Keypad("runcontrol", {
			pause	: "$pause",
			stop	: "$stop"
		}, command),
		
		Keypad('mcodes', {
			mist:'M'
		})
	
	]),
	
	Alarm
	:o("section alarm", null, [
		
	])
});

machine.go("Connect");