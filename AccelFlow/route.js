/*
V: 60 m/min = 1 m/s = 1000 um/ms
A: 1 g = 10 m/s2 = 10 e6 um/ e6 ms2 = 10 um/ms2
*/

const

router = (A,V) => {
	
	const
	I = 1/A, // inertivity
	
	round = n => .01 * Math.round(n*100),// n=>n, //
	log = console.log;
	
	return {
		
		span	:(d,v1,v2) =>{
			
			const
				w = d*A + ( v1*v1 + v2*v2 )/2, // reachable speed
				v = V*V < w ? V : Math.sqrt( w ) ,
				
				t1 = round( I*(v-v1) ), // acceleration time
				t2 = round( I*(v-v2) ), // decceleration time
				
				d0 = d - (t1*(v1+v)+t2*(v2+v))/2,
				t0 = round(d0/v); // cruise time
			
			log(`max speed: ${v}`);//, t=${t}
			
			return [t1,t0,t2]; // accel, cruise, deccel

		},

		arc	:(r,u1,u2) =>{
			let v = A*r
		}
		
	}

};

let	v = 0,
	vd = 0;

const

retreat = ([[t1,t0,t2],n*x,n*y,r,u]) => (t0 ? V : v+t2*A ) - t1*A,

makeplan = path => {
	
	const plan=[];
	
	for(let i=0; i<path.length; ){
		
		const [x,y,r,u] = path[i],
			vr = A*r+vd, // desired arc speed
			n = 1/Math.sqrt(x*x+y*y),
			d = 1/n,
			[t1,t0,t2] = span(d,v,vr);
						
		if(t1<0){ // exit speed is too high, need to deccelerate in earlier steps
			vd = t1*A;
			v = retreat(plan[--i]); // recovered speed and step back 
			
		}else{ // otherwise, okay
			vd = 0;
			v = vr;
			if(t2<0){ // exit speed lower than allowed, no problem
				v += A*t2; // simply reduce next step's entry speed
				t2 = 0;
			} 
			plan[i++] = [[t1,t0,t2],n*x,n*y,r,u]; // nx = cos, ny = sin
		}
	}
	return plan;
}