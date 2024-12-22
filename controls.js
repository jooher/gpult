import _ from "./state.js";
import {http,wsocket} from "./connection.js";

export const

stylize = (url,fun) => fetch(url)
	.then( r => r.ok && r.json() )
	.then( obj => new CSSStyleSheet().replace(Object.entries(obj).map( fun ).join("\n")))
	.then( stylesheet => document.adoptedStyleSheets.push(stylesheet)),
	
//cmd = txt => console.log(txt),
request = http(_.http),
replies = wsocket(_.ws),

command = t => request (`command?commandText=`+encodeURIComponent(t)),

makeCommand = action => () => command(action),
	
elem = (tag,title) =>{
	const el = document.createElement(tag);
	if(title)el.className=title;
	return el;
},

prep = (fun,obj) => Object.fromEntries(
	typeof obj === 'string' ? obj.split(" ").map( key=>[key,fun(key)] ) :
	typeof obj === 'object' ? Object.entries(obj).map(([key,value]) => [key,fun(value)]) :
	null
),

div = (title,stuff,fun) => {
	const group = elem("div",title),
		elems = fun ? Object.entries(stuff).map(fun) : stuff;
	group.append( ...elems );
	return group;
},

Button = ([key,action]) => {
	const btn=elem("button",key);
	btn.addEventListener("mousedown", typeof action == 'function' ? action : makeCommand(action));
	return btn;
},

Input = ([key,action]) => {
	const inp = elem("input",key);
	inp.setAttribute("data-ref",key);
	inp.value = _[key];
	return inp;
},

FileSelect = (title,action) =>{
	const sel=elem("select",title);
	sel.addEventListener("change", action);
	fetch(_.upload) //"mock/files.json"
		.then( response => response.json() )
		.then( json => sel.append(...json.files.filter(f=>f.size>0).map(FileItem)) );
	return sel;
},

FileItem = f =>{
	const opt = elem("option");
	opt.value = f.name;
	opt.textContent = f.shortname;
	return opt;
},

Upload = (title,action) =>{
	const inp = elem("input",title);
	inp.type="file";
	inp.setAttribute("accept",_.accept);
	inp.setAttribute("multiple","multiple");
	inp.addEventListener("change", action );
	return inp;
},

Jumper = (title,action,options) => {
	const inp = elem("input",title);
},

change = action => e => action(e.target.value),

keypad = (title,buttons) => div( "keypad "+title, buttons, Button ),
numpad = (title,params)  => div( "numpad "+title, params, Input ),
filepick = (title) => FileSelect( title, e => console.log(e.target.value) ),
upload = (title) => Upload(title,e => {[...e.target.files].forEach( f => console.log(f.name) );})
;