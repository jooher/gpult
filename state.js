export default { // const state = 
	
	x:10,
	y:20,
	z:30,
	a:0,
	
	jog_feed: 100,
	jog_step: 1000,
	
	urls	:[
		"fluidnc.local",
		"192.168.2.77"
	],
	
	http	:"http://fluidnc.local/",
	ws	:"ws://fluidnc.local:81/"

/*
	upload:"http://192.168.2.77/upload?path=/",
	
	http	:"http://192.168.2.77/", // "http://fluidnc.local/",
	ws	:"ws://192.168.2.77:81/", //"ws://fluidnc.local:81/"
*/

}
/*
commands = {
	
	G54: (val,axis) => console.log(`G0 ${axis}${val}`)
	
}

export default new Proxy(state, {
	
	get(tgt,ref){
		return tgt[ref.split(" ").join("_")];
	},
	
	set(tgt,ref,val){
		const p = ref.split(" ");
		
		if(p.length>1){
			const cmd = commands[p.shift()];
			if(cmd)cmd(val,...p);
			ref=p.join("_");
		};
		
		tgt[ref] = val;
		return true;
	}

});
*/