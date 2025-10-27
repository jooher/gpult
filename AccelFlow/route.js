/*
V: 60 m/min = 1 m/s = 1000 um/ms
A: 1 g = 10 m/s2 = 10 um/ms2
*/

const

hyp = (a,b) => a*a+b*b,
round = n => .01 * Math.round(n*100),// n=>n, //
log = console.log,


prepare = (A,V) => {
	
	let	v = 0,
		vd = 0;

	const
	I = 1/A, // inertivity
	
	accel = (d,v1,v2) =>{
				
			const
				w = d*A + hyp(v1,v2)/2, // reachable speed
				v = V*V < w ? V : Math.sqrt( w ) ,
				
				t1 = round( I*(v-v1) ), // acceleration time
				t2 = round( I*(v-v2) ), // decceleration time
				
				d0 = d - (t1*(v1+v)+t2*(v2+v))/2, // cruise distance
				t0 = round(d0/v); // cruise time
			
			log(`max speed: ${v}`);//, t=${t}
			
			return [t1,t0,t2]; // accel, cruise, deccel
		},
		

	retreat = (nn,[[t1,t0,t2],r]) => (t0 ? V : v+t2*A ) - t1*A,

	makeplan = route => {
		
		const plan=[];
		
		for(let i=0; i<route.length; ){
			
			const [x,y,r,u] = route[i],
				vr = A*r+vd, // desired arc speed
				n = 1/Math.sqrt(hyp(x,y)), // reverse root is faster
				d = 1/n,
				[t1,t0,t2] = accel(d,v,vr);

			if(t1<0){ // exit speed is too high, need to decelerate in earlier steps
				vd = t1*A;
				v = retreat(plan[--i]); // recovered speed and step back 
				
			}else{ // otherwise, okay
				vd = 0;
				v = vr;
				if(t2<0){ // exit speed lower than allowed, no problem
					v += A*t2; // simply reduce next step's entry speed
					t2 = 0;
				} 
				plan[i++] = {d:[n*x,n*y],t:[t1,t0,t2],r,u}; // nx = cos, ny = sin
			}
		}
		return plan;
	},
	
	stair = (n,t) => {
		const	// t is rounded
			s = round(t*(1-n)), // steps count
			l = round(t/s), // step length
			r = t-s*l;
		return [s,l,r]
	},

	chew = ([nn,[t1,t0,t2],r]) => nn.map( n => [stair(n,t1),t0,stair(n,t2),r] )
}


execute = _ => { // runs on MCU
	
	const
	
	stair = ([s,l,r],dir) => {
		while(s--){ // steps
			while(r--) // remains
				yield dir;
			r = l; // step length
			yield 0;
		}
	},
	
	
	span = ([ac,t0,de,r]) =>{
		arcfinish(ac);
		stair(ac,+1);
		cruise(t0);
		stair(de,-1);
		arcstart(de,r);
	}
	
	
		arc	:(n1,r,n2) =>{ // n:[nx,ny]
			const W = A*r,
				w1 = hyp(...n1),
				w2 = hyp(...n2);
			
			assert( w1<=W && w2<=W, `Arc speed must not exceed ${W}` )
			
			for( let [nx,ny]=n1
				nx+=
			
		}
	
}