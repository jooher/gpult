"use strict";

const

round = n => n, // Math.round, // n => .1 * Math.round(n*10),//

parse = d => {
	
	const shape = d.split(" ")
		.filter(str=>str.match(/^[0-9.,\-]+$/))
		.map(str=>str.split(","))
		.map( ([x,y])=>[1.0*x,1.0*y] );
	
	if("Z")
		shape.push(shape[0]);
	
	return shape;
};


let absx,absy,cxn,cyn,cx,cy;
	
const

norm = ([X,Y]) => {
	const 
		x = X - absx,
		y = Y - absy,
		n = 1/Math.sqrt(x*x+y*y);
		
	return [x*n,y*n];
},

start = corners => {
	[absx,absy] = corners.at(-2);
	[cxn,cyn] = norm( corners.at(-1) );
	[cx,cy] = corners.at(-1);	
	return corners;
},

offset = T => // tool radius
corners => start(corners).map( corner => {
	const
		[xn,yn] = norm(corner),
		ctg = (cyn-yn)/(cxn+xn),
		hx = -T*(cyn-ctg*cxn),
		hy = +T*(cxn+ctg*cyn),
		point = [ round(absx+hx), round(absy+hy) ];
		
	[absx,absy] = corner;
	cxn = xn;
	cyn = yn;
			
	return point;
}),

smooth = (R,A) => // tool radius, allowance
corners => start(corners).map( corner => { 
	const
		[xn,yn] = norm(corner),
		
		ctg = (cyn-yn)/(cxn+xn),
		
		abs = Math.abs(ctg), //
		sgn = Math.sign(ctg),
		
		r = (sgn*R)>0 ? R : round(A/abs),
		rx = - r*(sgn*cyn-abs*cxn),
		ry = + r*(abs*cyn+sgn*cxn),
		
		// trim
		s = Math.sqrt(rx*rx + ry*ry - r*r),
		
		// cx & cy here from previous step
		lx = round(absx - s*cxn),
		ly = round(absy - s*cyn),
		
		ax = round(s*(xn+cxn)),
		ay = round(s*(yn+cyn)),
		
		color = ctg > 0 ? "green" : "red";
		
	[absx,absy] = corner;		
	cxn = xn;
	cyn = yn;

	return [
		"L",lx,ly,
		"a",r,r,0,0,sgn>0?0:1,ax,ay	// a rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
	].join(" "); 
});