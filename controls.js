import _ from "./state.js";
import {http,wsocket} from "./connection.js";
import machine from "./machines/grbl.js";

export const

	E = (tag,props,ch) => {
		const head = tag.split(" "),
			el = document.createElement(head.shift()||'div' );
		if(head.length)
			el.classList.add(...head);
		if(props)for(const p in props)
			if(p in el) el[p] = props[p];
			else el.setAttribute(p,props[p]);
		if(ch)
			el.append(...ch);
		return el;
	},
	
	S = (cache => sel => cache[sel]||(cache[sel]=document.querySelector(sel)))({}),

	stylize = (url,fun) => fetch(url)
		.then( r => r.ok && r.json() )
		.then( obj => new CSSStyleSheet().replace(Object.entries(obj).map( fun ).join("\n")))
		.then( stylesheet => document.adoptedStyleSheets.push(stylesheet)),
		
	stub = txt => console.log(txt),
	
	prep = obj =>
		typeof obj === 'string' ? obj.split(" ").map( key=>[key,key] ) :
		typeof obj === 'object' ? Object.entries(obj) :
		null,

	Paged = (pages,container) => {
		
		if(!container)container=document.body;
		container.appendChild(pages[""]);
		
		return page => pages[page] && pages[page]!=container.firstChild &&
			container.replaceChild(pages[page],container.firstChild)
	},

	update = (controls => obj => {
		for(const i in obj){
			const c = controls[i]||(controls[i]=document.getElementById(i));
			c.textContent=obj[i];
		}
	}) ({}),


	numpad = (title,inputs,action)  => E(`div numpad ${title}`, null,
		prep(inputs).map(([title,arg]) => E(`input ${title}`,{
			value:_[arg],
			onchange:e=>action(arg,e.target.value)
		}))
	),

	keypad = (title,buttons,action) => E(`div keypad ${title}`, null,
		prep(buttons).map( ([title,arg]) => E(`button ${title}`,{
			onmousedown: action ? e => action(arg,e.target) : e => command(arg)
		}))
	),

	filepick = (title,action,fill) => E(`select ${title}`,{
		onchange: e => e.target.value && action(e.target.value),
		onfocus: e => (!e.target.options.length)&&
			fill().then(options=>e.target.replaceChildren(...options.map(o=>E("option",o))))
	}),

	upload = (title,action) => E(`input ${title}`,{
		type		: "file",
		multiple	: "multiple",
		accept	: _.accept,
		onchange	: e => e.target.files && action(e.target.files)
	}),

	progress = (title,action) => E("progress ${title}")

;