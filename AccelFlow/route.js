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
	log = console.log,
	round = i => i, //Math.round,

	ramp = (v,w) => {
		const
		t = I*(w-v),
		d = t*(w+v)/2; // = (w2-v2)/2A //   (w2-v12+w2-v22)/2A = 2w2-(v12+v22) / 2A = ( w*w - ( v1*v1 + v2*v2 )/2 )*I
		return [t,d];
	},
	
	cruise = (d,v,v1,v2) => d - ( v*v - ( v1*v1 + v2*v2 )/2 )*I;
	
	
	return {
		
		span	:(d,v1,v2) =>{
			
			let
			v = V,
			d0 = cruise(d,v,v1,v2);
			
			if(d0<0){ // not enough distance for cruise
				const t = T + Math.sqrt(TT+d0/A);
				v -= A*t;
				log(`speed truncated to: ${v}, t=${t}`);
			}else log(`cruise distance:${d0}`);
			
			const
			[t1,d1] = ramp(v1,v),
			[t2,d2] = ramp(v2,v),
			t0 = (d-d1-d2)/v;
						
			assert(d+1 > d1+d2, `${d} still less than ${d1} + ${d2}`);
			
			return [t1,t0,t2]; // accel, cruise, deccel

		},

		arc	:(u0,u,r) =>{
			let v = A/r
		}
		
	}

}

