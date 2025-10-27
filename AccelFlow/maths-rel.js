"use strict";

const

round = Math.round, // n => .1 * Math.round(n*10),//n => n, // 

corners2edges = corners => {
	let x=0,y=0;
	const edges = corners.map( corner => ({ dx: -x+(x=corner.x), dy: -y+(y=corner.y) }) );
	//if("z") edges.push( { dx:corners.at(0).x-corners.at(-1).x, dy:corners.at(0).y-corners.at(-1).y } );
	return {
		origin:edges.shift(),
		edges
	}
},

norm = ({dx,dy}) => {
	const n = 1/Math.sqrt(dx*dx+dy*dy);
	return [dx*n,dy*n];
},

offset = setup => ({origin,edges}) => {
		
	let [cxn,cyn] = norm( edges.at(-1) );
	
	const	S = setup.tool + setup.allowance,
	
	bevels = edges.map( edge => {
		
		const
			[xn,yn] = norm(edge),
			ctg = (cyn-yn)/(cxn+xn),
			
			x = -S*(cyn-ctg*cxn),
			y = +S*(cxn+ctg*cyn);
		
		cxn = xn;
		cyn = yn;

		return {x,y};
	});
	
	let b = bevels[0];
	
	origin.dx += b.x;
	origin.dy += b.y;
	
	bevels.push(bevels[0]);
	
	return { 
		origin,
		edges: edges.map( ({dx,dy},i) => {
			const tail = bevels[i],
				head = bevels[i+1];
			return {
				dx: dx - tail.x + head.x,
				dy: dy - tail.y + head.y
			};
		})
	};
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