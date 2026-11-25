
(function(){
'use strict';
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>'m'+Math.random().toString(36).slice(2,9);
const slug=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'').slice(0,30);
/* ---------- couleurs ---------- */
function hexToRgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255]}
function rgbToHex(r,g,b){return'#'+[r,g,b].map(v=>clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('')}
function rgbToHsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let h=0,s=0;const l=(mx+mn)/2,d=mx-mn;
  if(d){s=d/(1-Math.abs(2*l-1));if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;if(h<0)h+=360}return[h,s,l]}
function hslToHex(h,s,l){h=((h%360)+360)%360;s=clamp(s,0,1);l=clamp(l,0,1);const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;let r=0,g=0,b=0;
  if(h<60){r=c;g=x}else if(h<120){r=x;g=c}else if(h<180){g=c;b=x}else if(h<240){g=x;b=c}else if(h<300){r=x;b=c}else{r=c;b=x}
  return rgbToHex((r+m)*255,(g+m)*255,(b+m)*255)}
const hsl=hex=>rgbToHsl(...hexToRgb(hex));
function lum(hex){const a=hexToRgb(hex).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*a[0]+.7152*a[1]+.0722*a[2]}
function contrast(a,b){const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
function readableOn(bg,light='#FFFFFF',dark='#11171A'){return contrast(bg,light)>=contrast(bg,dark)?light:dark}
function ensureContrast(c,bg,min){let[h,s,l]=hsl(c);const dir=lum(bg)>.4?-1:1;let n=0;while(contrast(hslToHex(h,s,l),bg)<min&&n<24){l=clamp(l+dir*.04,0,1);n++}return hslToHex(h,s,l)}
const rgba=(hex,a)=>{const[r,g,b]=hexToRgb(hex);return`rgba(${r},${g},${b},${a})`};
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);