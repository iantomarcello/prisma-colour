"use strict";module.exports=class{constructor(t){if("string"!=typeof t)throw Error("Prisma Error: Value passed in constructor must be a string of CSS colour value.");this.raw=t,this.rgb=new Array,this.alpha=1,this.convert(this.raw)}get r(){return this.rgb[0]}get g(){return this.rgb[1]}get b(){return this.rgb[2]}get a(){return this.alpha}setRGBA(t,s,r,e){return this.rgb=[t,s,r],this.alpha=e,this}reset(){this.convert(this.raw)}clone(){return new this.constructor(this.raw).setRGBA(...this.rgb,this.alpha)}clamp(t,s){return Math.min(Math.max(t,0),s)}_splitBetter(t){if((t=t.trim().replaceAll(", ",",")).includes(","))return t.split(",");if(t.includes(" "))return t.split(" ");throw Error("Param doesn't seem to be a colour.")}convert(t){switch(!0){case t.includes("#"):let p;t.length>7?(p=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t),this.alpha=parseInt(p[4],16)/255):(p=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t),this.alpha=1),this.rgb[0]=parseInt(p[1],16),this.rgb[1]=parseInt(p[2],16),this.rgb[2]=parseInt(p[3],16);break;case t.includes("hsl"):t.includes("a")?(c=this._splitBetter(t.substr(5).slice(0,-1)).map((t=>parseFloat(t))),this.alpha=c.pop()):c=this._splitBetter(t.substr(4).slice(0,-1)).map((t=>parseFloat(t)));var s,r,e,a=c[0]/360,i=c[1]/100,h=c[2]/100;if(0==i)s=r=e=h;else{function o(t,s,r){return r<0&&(r+=1),r>1&&(r-=1),r<1/6?t+6*(s-t)*r:r<.5?s:r<2/3?t+(s-t)*(2/3-r)*6:t}var l=h<.5?h*(1+i):h+i-h*i,n=2*h-l;s=o(n,l,a+1/3),r=o(n,l,a),e=o(n,l,a-1/3)}this.rgb=[parseInt(255*s),parseInt(255*r),parseInt(255*e)];break;case t.includes("rgb"):t.includes("a")?(c=this._splitBetter(t.substr(5).slice(0,-1)).map((t=>parseFloat(t))),this.alpha=c.pop(),this.rgb=c):this.rgb=this._splitBetter(t.substr(4).slice(0,-1)).map((t=>parseFloat(t)));break;case Array.isArray(t):if(3===t.length)this.rgb=[...t];else if(4===t.length){var c=[...t];this.alpha=c.pop(),this.rgb=[...c]}break;default:throw Error("Param doesn't seem to be a colour.")}}luma(t){this.convert(t);var s=this.rgb[0]/255,r=this.rgb[1]/255,e=this.rgb[2]/255;return.2126*(s=s<=.03928?s/12.92:Math.pow((s+.055)/1.055,2.4))+.7152*(r=r<=.03928?r/12.92:Math.pow((r+.055)/1.055,2.4))+.0722*(e=e<=.03928?e/12.92:Math.pow((e+.055)/1.055,2.4))}toHSL(t){this.convert(t);var s,r,e=this.rgb[0]/255,a=this.rgb[1]/255,i=this.rgb[2]/255,h=this.alpha,o=Math.max(e,a,i),l=Math.min(e,a,i),n=(o+l)/2,c=o-l;if(o===l)s=r=0;else{switch(r=n>.5?c/(2-o-l):c/(o+l),o){case e:s=(a-i)/c+(a<i?6:0);break;case a:s=(i-e)/c+2;break;case i:s=(e-a)/c+4}s/=6}return{h:360*s,s:100*r,l:100*n,a:h}}getRGB(t="comma"){switch(t){case"space":return`rgb(${[...this.rgb].join(" ")})`;case"comma":default:return`rgb(${[...this.rgb].join(", ")})`}}getRGBA(t="comma"){switch(t){case"space":return`rgba(${[...this.rgb].join(" ")}  / ${this.alpha})`;case"comma":default:return`rgba(${[...this.rgb,this.alpha].join(", ")})`}}getHex(){let t=this,s="#".concat(this.rgb.map((function(s){return((s=t.clamp(Math.round(s),255))<16?"0":"")+s.toString(16)})).join(""));if(this.alpha<1){let t=Math.round(255*this.alpha);s+=(t<16?"0":"")+t.toString(16)}return s}getHSL(t="comma"){let{h:s,s:r,l:e}=this.toHSL(this.rgb);switch(t){case"space":return`hsl(${s.toFixed(2)} ${r.toFixed(2)}% ${e.toFixed(2)}%)`;case"comma":default:return`hsl(${s.toFixed(2)}, ${r.toFixed(2)}%, ${e.toFixed(2)}%)`}}getHSLA(t="comma"){let{h:s,s:r,l:e}=this.toHSL(this.rgb);switch(t){case"space":return`hsla(${s.toFixed(2)} ${r.toFixed(2)}% ${e.toFixed(2)}% / ${this.a.toFixed(2)})`;case"comma":default:return`hsla(${s.toFixed(2)}, ${r.toFixed(2)}%, ${e.toFixed(2)}%, ${this.a.toFixed(2)})`}}hslaToString({h:t,s:s,l:r,a:e},a=2){return`hsla(${t.toFixed(a)}, ${s.toFixed(a)}%, ${r.toFixed(a)}%, ${e.toFixed(a)})`}spin(t=0){let s=this.toHSL(this.rgb),r=(s.h+parseFloat(t))%360;return s.h=r<0?360+r:r,this.convert(this.hslaToString(s)),this}fade(t=this.alpha){let s=this.toHSL(this.rgb);return s.a=1-parseFloat(t)/100,s.a=this.clamp(s.a,1),this.convert(this.hslaToString(s)),this}fadeIn(t=0){let s=this.toHSL(this.rgb);return s.a+=parseFloat(t)/100,s.a=this.clamp(s.a,1),this.convert(this.hslaToString(s)),this}fadeOut(t=0){let s=this.toHSL(this.rgb);return s.a-=parseFloat(t)/100,s.a=this.clamp(s.a,1),this.convert(this.hslaToString(s)),this}lighten(t=0){let s=this.toHSL(this.rgb);return s.l+=parseFloat(t),s.l=this.clamp(s.l,100),this.convert(this.hslaToString(s)),this}darken(t=0){let s=this.toHSL(this.rgb);return s.l-=parseFloat(t),s.l=this.clamp(s.l,100),this.convert(this.hslaToString(s)),this}saturate(t=0){let s=this.toHSL(this.rgb);return s.s+=parseFloat(t),s.s=this.clamp(s.s,100),this.convert(this.hslaToString(s)),this}desaturate(t=0){let s=this.toHSL(this.rgb);return s.s-=parseFloat(t),s.s=this.clamp(s.s,100),this.convert(this.hslaToString(s)),this}};