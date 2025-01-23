/*
V: 60 m/min = 1 m/s = 1000 um/ms
A: 1 g = 10 m/s2 = 10 e6 um/ e6 ms2 = 10 um/ms2
*/

const router = (A,V) => {
	
	const
	I = 1/A, // inertivity
	T = V*I,
	TT = T*T,
	
	assert = (what,why) => what||console.warn(why),
	round = n => .01 * Math.round(n*100),// n=>n, //

	ramp = (v,w) => {
		const
		t = I*(w-v),
		d = t*(w+v)/2; // = (w2-v2)/2A //   (w2-v12+w2-v22)/2A = 2w2-(v12+v22) / 2A = ( w*w - ( v1*v1 + v2*v2 )/2 )*I
		return [t,d];
	},
		
	log = console.log;	
	
	return {
		
		span	:(d,v1,v2) =>{
			
			const
				w = d*A + ( v1*v1 + v2*v2 )/2, // reachable speed
				v = V*V < w ? V : Math.sqrt( w ) , //round( )
				
				t1 = round( I*(v-v1) ),
				t2 = round( I*(v-v2) ),
				
				d0 = d - (t1*(v1+v)+t2*(v2+v))/2,
				t0 = round(d0/v) //	 			
				;
			
			log(`max speed: ${v}`);//, t=${t}
			
			return [t1,t0,t2]; // accel, cruise, deccel

		},

		arc	:(u0,u,r) =>{
			let v = A/r
		}
		
	}

}

