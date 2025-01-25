"use strict";

let	ax=0, // absolute x
	ay=0, // absolute y

	cxn=0, // past normalized x,y and length
	cyn=1
	;
	
const

len = (x,y) => Math.sqrt(x*x+y*y),

rounds = (R,side) => ([x,y]) => {
	const
		n = 1/len(x,y),
		xn = x*n,
		yn = y*n,
		
		ctg = (cyn-yn)/(cxn+xn),
		
		abs = Math.abs(ctg), //
		sgn = Math.sign(ctg),
		
		r = sgn == side ? R : R/abs,
		
		rx = + r*(sgn*cyn-abs*cxn), // relative
		ry = - r*(abs*cyn+sgn*cxn),
		
		// trim
		s = Math.sqrt(rx*rx + ry*ry - r*r),
		
		x1 = ax + s * xn,
		y1 = ay + s * yn,
		
		x2 = ax - s * cxn,
		y2 = ay - s * cyn,
		
			dx = s*(xn+cxn),
			dy = s*(yn+cyn),
		
		cx = ax + rx,
		cy = ay + ry,
		
		color = ctg > 0 ? "green" : "red";
						
	ax += x;
	ay += y;
	
	cxn=xn;
	cyn=yn;
	
/*	
	return [
		["circle",{title:`ctg=${ctg}`,cx,cy,r,style:`fill:${color};stroke:none`}],
		["line",{x1,y1,x2,y2,stroke:"black"}]
	];
*/

	return [
		"L",x2,y2
		,"a",r,r,0,0,sgn>0?0:1,dx,dy
		//,"l",dxdy
		].join(" "); // a rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
	//
}
