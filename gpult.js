//	'jog'	.d("btn @Xup'X+ @Xdn'X- @Yup'Y+ @Ydn'Y- @Zup`Z- @Zdn`Z-").u("cmd (jog $feed $step)")

import $ from "./state.js";

const
stylize = (url,fun) => fetch(url)
	.then( r => r.ok && r.json() )
	.then( obj => new CSSStyleSheet().replace(Object.entries(obj).map( fun ).join("\n")))
	.then( stylesheet => document.adoptedStyleSheets.push(stylesheet))
;
stylize("lang/default.json", ([key,label]) =>`${key}::before{content:"${label}"}`)

const
	cmd = txt => console.log(txt),
	command = action => $ => cmd(action);
		
const

	elem = (tag,key) =>{
		const el = document.createElement(tag);
		el.className=key;
		return el;
	},
	
	prep = (fun,obj) => Object.fromEntries(Object.entries(obj).map(([key,value]) => [key,fun(value)])),
	
	div = (title,stuff,fun) => {
		const group = elem("div",title),
			elems = fun ? Object.entries(stuff).map(fun) : stuff;
		elems.forEach( ch => group.appendChild(ch) );
		return group;
	},
	
	Button = ([key,action]) => {
		const btn=elem("button",key);
		btn.addEventListener("mousedown", typeof action == 'function' ? action : command(action));
		return btn;
	},
	
	Input = ([key,ref]) => {
		const inp = elem("input",key);
		inp.addEventListener("change",change);
		inp.setAttribute("data-ref",ref);
		inp.value = $[ref];
		return inp;
	},
	
	change = e => {
		const tgt = e.target,
			ref = tgt.getAttribute("data-ref"),
			val = tgt.value;
		$[ref]=val;
		console.log(`${ref}->${val}`);
	},
	
	keypad = (title,buttons) => div( title, buttons, Button ),
	numpad = (title,params)  => div( title, params, Input )
	;

//const JOG = $.JOG;


const
idle = div("idle pad", [

	numpad("pos", {
		"X":"G54 x",
		"Y":"G54 y",
		"Z":"G54 z",
		"A":"G54 a"
	}),
	
	numpad("jog", {
	}),
	
	keypad("jog", prep( axis => _ => cmd(`G91 G21 F${$.JOG.feed} ${axis}${$.JOG.step}`), {
		Xup: 'X+',
		Xdn: 'X-',
		Yup: 'Y+',
		Ydn: 'Y-',
		Zup: 'Z+',
		Zdn: 'Z-'
	})),
	 
	keypad("home", {
		x: 'G0 X0',
		y: 'G0 Y0',
		z: 'G0 Z0'
	}),
	
	keypad('mcodes',{
		mist:'M'
	})
	
]);
	
document.body.appendChild(idle); //documentElement.
