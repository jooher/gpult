const
	path = vector[],
	x,y,z,
	vx,vy,vz,
	ax,ay,az,
	ex,ey; // =0


smooth = vin,path,vout =>{
	
}
	
	
straightLine = (dx,dy,dz) {
	const
		dxy2=dx*dx+dy*dy,
		tx = dx/vx
		time=max(dx/vx)
		
	time = dxy2%feed2
	
	
}



ax= 4000 mm/s2 = 4 um/ms2

G1 F100(mm/s)
X0Y0
X100
Y100
X0Y0

typedef motion={p,v,a};
path = [p]=>[v]=>[a]

const

chain = ofs[]=> ofs.map(([x,y,z]) => let norm = feed/dist(x,y,z) in [x*norm,y*norm,z*norm])


arc = (v1,v2,r) => {
	const
	n1 = norm(v1),
	n2 = norm(v2),
	tg = (n1.x+n2.x)/(n1.y+n2.y),
	cut = tg*r,
	
	v = min(feed,sqrt(r*a));	
	
	xacc = sine(r,t,a1,a2);
}


spanxyz = [{v1,ofs,v2}]xyz =>{
	const

	d = distance(ofs),
		
	d1 = max([(vm^2-v1^2)/2a]),
	d2 = max([(vm-v2)/a]),
	
	t12=abs(v1-v2)/a, // time needed for changing speed
	d12=(v1+v2)*t12/2, // distance needed
	df = d-d12 // free acceleration run
	;
		
	if(df<0){
		if(v2<v1) // deccelerating
			retrofitSlowdown( v1=df/t12 );
		else //accelerating
			promoteSlowdown( v2=v1+a*t12 );
		
		return [accel(v2-v1,t12)];
		
	}
	
	va = max(v1,v2); // acceleration base speed
	ta = min( // accelerated time limited by
		2*(vmax-va)/a, // either vmax
		df/(va+vmax) // or available distance
	); 
	
	da = (va+vmax)*ta; // distance to max speed
	ds = df-da; // distance at max speed
	
	return [ // xyz!
		accel(...),
		ta && flat(...),
		accel(...)
	]
	
}
	
	
	
	acc,
	run,
	dcc
	
}


corner = (v1:xyz, v2:xyz) => {
	let
	dvx = v2.x-v1.x,
	dvy = v2.y-v1.y,
	
	ticks = max( abs(dvx/ax), abs(dvy/ay), abs(dvz/az) ), // different accel/brake?
	
	return {
		x: accel(ticks,dvx),
		y: accel(ticks,dvy),
		z: accel(ticks,dvz,)
	}
},

accel = (dv,ticks) ={
	const
	imps=[],
	while(ticks){
		let a = dv/ticks;
		imps.push(a);
		dv-=a;
		ticks--;
	}
	return imps;
}
 
