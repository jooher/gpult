//	'jog'	.d("btn @Xup'X+ @Xdn'X- @Yup'Y+ @Ydn'Y- @Zup`Z- @Zdn`Z-").u("cmd (jog $feed $step)")

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
	
	Input = ([key,param]) => {
		const inp = elem("input",key);
		inp.value = param[key];
		return inp;
	},
	
	keypad = (title,buttons) => div( title, buttons, Button ),
	display = (title,params) => div( title, params, Input )
	
	;
	
	
const

$ = {
	JOG: {
		feed: 100,
		step: 1000
	},

	POS: {
		x:10,
		y:20,
		z:30,
		a:0
	}
}

,h ={
	get(tgt,prop){
		tgt[prop]
	},
	put(tgt,prop,val){
		tgt.prop = val;
	}
}

,JOG = new Proxy($.JOG,h)
,POS = new Proxy($.POS,h)

;	

const
idle = div("idle pad", [

	display("pos",POS),

	//display("jog",JOG),
	
	keypad("jog", prep( axis => $ => cmd(`G91 G21 F${JOG.feed} ${axis}${JOG.step}`), {
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
