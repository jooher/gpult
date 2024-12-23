import _ from "./state.js";
import {http,wsocket} from "./connection.js";

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
	request = stub, //http(_.http),
	replies = stub, //wsocket(_.ws),

	command = stub, //t => request (`command?commandText=`+encodeURIComponent(t)),

	prep = obj =>
		typeof obj === 'string' ? obj.split(" ").map( key=>[key,key] ) :
		typeof obj === 'object' ? Object.entries(obj) : //.map(([key,value])=>[key,fun(value)]) :
		null,




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

	filepick = (title,action) => E(`select ${title}`,{
		onfocus: e => {
			fetch(_.upload) //"mock/files.json"
				.then( response => response.json() )
				.then( json => e.target.append(...json.files.filter(f=>f.size>0).map(
					f =>E("option",{value:f.name, textContent:f.shortname})
				)));
		},
		onchange: e => e.target.value && action(e.target.value)
	}),

	upload = (title,action) => E(`input ${title}`,{
		type		: "file",
		multiple	: "multiple",
		accept	: _.accept,
		onchange	: e => e.target.files && action(e.target.files)
	}),

	progress = (title,action) => E("progress ${title}")

;