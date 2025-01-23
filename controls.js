import machine from "./machines/grbl.js";

const controls = {};

window.updates = new Proxy(controls, {
	get(tgt,prop){
		const c = tgt[prop] || (tgt[prop]=document.getElementById(prop));
		if(c) return c["value" in c ? "value" : "textContent"]; 
	},
	set(tgt,prop,value){
		const c = tgt[prop] || (tgt[prop]=document.getElementById(prop));
		if(c) 
			if("value" in c)c.value = value;
			else c.append(T(value));
		return true;
	}
});

export const

	o = (tag,props,ch) => {
		const head = tag.split(" "),
			el = document.createElement(head.shift()||'div' );
		if(head.length)
			el.classList.add(...head);
		if(props)for(const p in props)
			if(p in el) el[p] = props[p];
			else el.setAttribute(p,props[p]);
		if(ch)
			el.append(...ch);
		else
			if(el.id)
				controls[el.id]=el;
		return el;
	},
	
	T = txt => document.createTextElement(txt),
	
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

	Pages = pages => {
		
		let current = o("div");
		
		const	go = page => {
				const p = pages[tabs.value = page];
				if( p && p!=current )  //{ && pages[page]!=container.firstChild
					current.replaceWith(current = p);//    container.replaceChild(,container.firstChild);
			},
			
			tabs = o(`select pages`,
				{ onchange: e => go(e.target.value) },
				Object.keys(pages).map( page => o(`option ${page}`,{value:page,textContent:page}) )
			);
		
		document.body.firstChild.before(o("div app",{},[tabs,current]));//
		
		return go;
	},
		
	Numpad = (title,inputs,action)  => o(`div numpad ${title}`, null,
		prep(inputs).map(([title,arg]) => o(`input ${title}`,{
			id:title, //
			value: machine.vars[arg],
			onchange: e => action(arg,e.target.value)
		}))
	),

	Keypad = (title,buttons,action) => o(`div keypad ${title}`, null,
		prep(buttons).map( ([title,arg]) => o(`button ${title}`,{
			onmousedown: action ? e => action(arg,e.target) : e => machine.command(arg)
		}))
	),
	
	Macros = group => 
		machine.macros[group] ? keypad(group,machine.macros[group],machine.command) : o(`div nomacro`), 
	
	Commandpad = (recent =>{
		const 
			inp = o(`input`,{
				onchange: e => {
					const cmd = e.target.value;
					if(cmd && confirm("Execute?\n\n"+cmd)){
						machine.command(cmd);
						hist.value += "\n"+cmd;
					}
				}
			}),
			hist = o(`textarea`,{value:recent});
		
		return o(`div commandpad`, null, [ hist, inp ])
	})("recent"),

	Filepick = (title,action,fill) => o(`select ${title}`,{
		onchange: e => e.target.value && action(e.target.value),
		onfocus: e => (!e.target.options.length)&&
			fill().then(options=>e.target.replaceChildren(...options.map(o(=>o("option",o())))
	}),

	Upload = (title,action) => o(`label button ${title}`,null,[
		o(`input`,{
			type		: "file",
			multiple	: "multiple",
			accept	: machine.accept,
			onchange	: e => e.target.files && action(e.target.files)
		})
	]),
		
	Progress = (title,action) => o(`progress ${title}`,{id:title}),
	
	Rheo = (title,action) => o(`label ${title}`, null, [
		o(`input`, { id:title, type:"range", min:0, max:200, value:100, onchange: e=>action(e.target.value) } )
	]),

	Msglog = title => o(`pre ${title}`,{id:title})

;