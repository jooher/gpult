"use strict";

const

round = Math.round, // n => .1 * Math.round(n*10),//n => n, // 

norm = (cur,last) => {
	const 
		x = cur.x - last.x,
		y = cur.y - last.y,
		n = 1/Math.sqrt(x*x+y*y);
		
	return [x*n,y*n];
},

offset = setup => corners => {
		
	let
	last = corners.at(-2),
	[cxn,cyn] = norm( last, corners.at(-3) );
	
	const S = setup.tool + setup.allowance;
		
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
	});
},

smooth = setup => corners => {
		
	let
	last = corners.at(-2),
	[cxn,cyn] = norm( last, corners.at(-3));
	
	const R = setup.allowance + setup.tool;
	
	return corners.map( corner => { 
		const
			[xn,yn] = norm(corner,last),
			
			ctg = (cyn-yn)/(cxn+xn),
			
			abs = Math.abs(ctg), //
			sgn = Math.sign(ctg),
			
			r = round(R + setup.tolerance/abs), //(sgn*S>0?S:0)), + abs
			rx = r*(sgn*cyn-abs*cxn),
			ry = r*(abs*cyn+sgn*cxn),
			
			// trim
			s = Math.sqrt(rx*rx + ry*ry - r*r),
			
			// cx & cy here from previous step
			lx = round(last.x - s*cxn), //
			ly = round(last.y - s*cyn),
			
			ax = round(s*(xn+cxn)),
			ay = round(s*(yn+cyn));
			
		last = corner;
		cxn = xn;
		cyn = yn;

		return {lx,ly,ax,ay,r:r*sgn}; 
	});
}