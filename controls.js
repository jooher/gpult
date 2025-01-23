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

	Pages = pages => {
		
		let current = E("div");
		
		const	go = page => {
				const p = pages[tabs.value = page];
				if( p && p!=current )  //{ && pages[page]!=container.firstChild
					current.replaceWith(current = p);//    container.replaceChild(,container.firstChild);
			},
			
			tabs = E(`select pages`,
				{ onchange: e => go(e.target.value) },
				Object.keys(pages).map( page => E(`option ${page}`,{value:page,textContent:page}) )
			);
		
		document.body.firstChild.before(E("div app",{},[tabs,current]));//
		
		return go;
	},
		
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
		else
			if(el.id)
				controls[el.id]=el;
		return el;
	},
	
	T = txt => document.createTextNode(txt+"\n"),
	
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

	numpad = (title,inputs,action)  => E(`div numpad ${title}`, null,
		prep(inputs).map(([title,arg]) => E(`input ${title}`,{
			id:title, //
			value: machine.vars[arg],
			onchange: e => action(arg,e.target.value)
		}))
	),

	keypad = (title,buttons,action) => E(`div keypad ${title}`, null,
		prep(buttons).map( ([title,arg]) => E(`button ${title}`,{
			onmousedown: action ? e => action(arg,e.target) : e => machine.command(arg)
		}))
	),
	
	macros = group => 
		machine.macros[group] ? keypad(group,machine.macros[group],machine.command) : E(`div nomacro`), 
	
	commandpad = (recent =>{
		const 
			inp = E(`input`,{
				onchange: e => {
					const cmd = e.target.value;
					if(cmd && confirm("Execute?\n\n"+cmd)){
						machine.command(cmd);
						hist.value += "\n"+cmd;
					}
				}
			}),
			hist = E(`textarea`,{value:recent});
		
		return E(`div commandpad`, null, [ hist, inp ])
	})("recent"),

	filepick = (title,action,fill) => E(`select ${title}`,{
		onchange: e => e.target.value && action(e.target.value),
		onfocus: e => (!e.target.options.length)&&
			fill().then(options=>e.target.replaceChildren(...options.map(o=>E("option",o))))
	}),

	upload = (title,action) => E(`label button ${title}`,null,[
		E(`input`,{
			type		: "file",
			multiple	: "multiple",
			accept	: machine.accept,
			onchange	: e => e.target.files && action(e.target.files)
		})
	]),
		
	progress = (title,action) => E("progress ${title}",{id:title}),
	
	rheo = (title,action) => E(`label ${title}`, null, [
		E(`input`, { id:title, type:"range", min:0, max:200, value:100, onchange: e=>action(e.target.value) } )
	]),

	msglog = title => E(`pre ${title}`,{id:title})

;