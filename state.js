const state = {
	
	JOG: {
		feed: 100,
		step: 1000
	},

	G54_x:10,
	G54_y:20,
	G54_z:30,
	G54_a:0
},

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
