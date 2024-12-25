import {Pages,E,stylize,msglog,numpad,keypad,rheo,commandpad,filepick,upload,macros,progress} from "./controls.js";
import machine from "./machines/grbl.js";

stylize("lang/default.json", ([selector,label]) =>`${selector}::before{content:"${label}"}`);

const

axes = "x y z",
_ = machine.vars,
command = machine.command;

window.gpult = Pages({

	Connect
	:E("section connect",null,[
	
		msglog("msg"),
	
		E("div bar", null, [
			E("select",
				{ onchange: e => machine.connect(e.target.value) },
				_.urls.map(url=>E("option",{textContent:url}))
			),
			E("button connect",
				{ onclick: e => machine.connect(e.target.previousSibling.value) }
			)
		])
		
	]),

	Idle
	:E("section idle", null, [
	
		E('input state',{id:"gc",disabled:"disabled"}),
		
		commandpad,
		
		macros("idle"),				
		 
		keypad("home bar", axes, axis => 
			confirm(`Home axis ${axis}?`) && command(`G0 ${axis}0`)
		),
		
		numpad("pos", axes, (axis,num) => command(`G92 ${axis}${num}`) ), // F${_.jog_feed}
		
		keypad("jog", {
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
		
		numpad("jog", "jog_feed jog_step", (param,num) => {_[param]=num} ),
		E("div jobs bar", null, [
			filepick("job", machine.run, machine.jobs ),
			upload("upload", machine.upload )
		])
	]),
	
	Run
	:E("section run", null, [

		//fileinfo("jobinfo"),

		progress("jobprogress"),
			
		rheo("feed", percent => {} ),
		rheo("spindle", percent => {} ),
		
		keypad("runcontrol", {
			pause	: "$pause",
			stop	: "$stop"
		}, command),
		
		keypad('mcodes', {
			mist:'M'
		})
	
	]),
	
	Alarm
	:E("section alarm", null, [
		
	])
});

machine.go("Connect");