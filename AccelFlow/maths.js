"use strict";

const

round = Math.round, // n => .1 * Math.round(n*10),//n => n, // 

parse = d => {
	
	const shape = d.split(" ")
		.filter(str=>str.match(/^[0-9.,\-]+$/))
		.map(str=>str.split(","))
		.map( ([x,y])=>({x:1.0*x, y:1.0*y}) );
	
	if("Z")shape.push(shape[0]);
	
	return shape;
},

norm = (cur,last) => {
	const 
		x = cur.x - last.x,
		y = cur.y - last.y,
		n = 1/Math.sqrt(x*x+y*y);
		
	return [x*n,y*n];
},

offset = S => // offSet = tool radius+allowance
	corners => {
		
		let
		last = corners.at(-2),
		[cxn,cyn] = norm( last, corners.at(-3) );
			
		return corners.map( corner => {
			
			const
				[xn,yn] = norm(corner,last),
				ctg = (cyn-yn)/(cxn+xn),
				hx = -S*(cyn-ctg*cxn),
				hy = +S*(cxn+ctg*cyn),
				point = { x:round(last.x+hx), y:round(last.y+hy) };

			last = corner;
			cxn = xn;
			cyn = yn;
					
			return point;
		}
	);
},

smooth = (S,E) => // Tool radius, tolErance
	corners => {
		
		let
		last = corners.at(-2),
		[cxn,cyn] = norm( last, corners.at(-3));
		
		
		return corners.map( corner => { 
			const
				[xn,yn] = norm(corner,last),
				
				ctg = (cyn-yn)/(cxn+xn),
				
				abs = Math.abs(ctg), //
				sgn = Math.sign(ctg),
				
				r = round(E + S), //(sgn*S>0?S:0)),
				rx = r*(sgn*cyn-abs*cxn),
				ry = r*(abs*cyn+sgn*cxn),
				
				// trim
				s = Math.sqrt(rx*rx + ry*ry - r*r),
				
				// cx & cy here from previous step
				lx = round(last.x - s*cxn),
				ly = round(last.y - s*cyn),
				
				ax = round(s*(xn+cxn)),
				ay = round(s*(yn+cyn));
				
			last = corner;
			cxn = xn;
			cyn = yn;

			return [ lx,ly,r*sgn,ax,ay ]; 
		}
	);
}