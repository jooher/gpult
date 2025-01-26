"use strict";

let	cx=0, // 
	cy=0, // absolute y
	cxn=0, // past normalized x,y and length
	cyn=1,
	absx=0,
	absy=0,
	;
	
const

round = n => n, // Math.round, // n => .1 * Math.round(n*10),//

len = (x,y) => Math.sqrt(x*x+y*y),


offset = (R,side) => ([x,y]) =>{
	const
		n = 1/len(x,y),
		xn = x*n,
		yn = y*n,
		
		ctg = (cyn-yn)/(cxn+xn),
		
		abs = Math.abs(ctg), //
		sgn = Math.sign(ctg),
		
		r = sgn == side ? R : round(R/abs),
		
		rx = + r*(sgn*cyn-abs*cxn), // relative
		ry = - r*(abs*cyn+sgn*cxn),
		
		// trim
		s = Math.sqrt(rx*rx + ry*ry - r*r),
		
		// cx & cy here from previous step
		lx = round(cx - s*cxn),
		ly = round(cy - s*cyn),
		
		ax = round(s*(xn+cxn)),
		ay = round(s*(yn+cyn)),
		
		color = ctg > 0 ? "green" : "red";
		
	absx+=x;
	absy+=y;
		
	cx = x-s*xn;
	cy = y-s*yn;
	cxn = xn;
	cyn = yn;
/*	
	return [
		["circle",{title:`ctg=${ctg}`,cx,cy,r,style:`fill:${color};stroke:none`}],
		["line",{x1,y1,x2,y2,stroke:"black"}]
	];
*/

	return [
		"l",lx,ly,
		"a",r,r,0,0,sgn>0?0:1,ax,ay
		].join(" "); // a rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
	//
},

rounds = (R,side) => ([x,y]) => {
	const
		n = 1/len(x,y),
		xn = x*n,
		yn = y*n,
		
		ctg = (cyn-yn)/(cxn+xn),
		
		abs = Math.abs(ctg), //
		sgn = Math.sign(ctg),
		
		r = sgn == side ? R : round(R/abs),
		
		rx = + r*(sgn*cyn-abs*cxn), // relative
		ry = - r*(abs*cyn+sgn*cxn),
		
		// trim
		s = Math.sqrt(rx*rx + ry*ry - r*r),
		
		// cx & cy here from previous step
		lx = round(cx - s*cxn),
		ly = round(cy - s*cyn),
		
		ax = round(s*(xn+cxn)),
		ay = round(s*(yn+cyn)),
		
		color = ctg > 0 ? "green" : "red";
		
	absx+=x;
	absy+=y;
		
	cx = x-s*xn;
	cy = y-s*yn;
	cxn = xn;
	cyn = yn;
/*	
	return [
		["circle",{title:`ctg=${ctg}`,cx,cy,r,style:`fill:${color};stroke:none`}],
		["line",{x1,y1,x2,y2,stroke:"black"}]
	];
*/

	return [
		"l",lx,ly,
		"a",r,r,0,0,sgn>0?0:1,ax,ay
		].join(" "); // a rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
	//
}
