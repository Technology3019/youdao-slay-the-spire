const { Img } = require('./artlib.js');
const OUT = '/root/杀戮尖塔/game/ui/src/assets/img';
const OL = '#151320';
function rng(seed){ let a=seed>>>0; return ()=>{ a=(a+0x6D2B79F5)>>>0; let t=Math.imul(a^(a>>>15),1|a); t=(t+Math.imul(t^(t>>>7),61|t))^t; return ((t^(t>>>14))>>>0)/4294967296; }; }
function sp(im, pts, fill, stroke, th){
  im.poly(pts, fill);
  const t = th || 3;
  for(let i=0;i<pts.length;i++){ const a=pts[i], b=pts[(i+1)%pts.length]; im.line(a[0],a[1],b[0],b[1],t,stroke||OL); }
}
function circO(im,cx,cy,r,fill,stroke){ im.circle(cx,cy,r+1.5,stroke||OL); im.circle(cx,cy,r,fill); }
function eye(im,cx,cy,r,c){ circO(im,cx,cy,r,'#ffffff'); im.circle(cx,cy,r*0.5,c); }

/* ---------- 铁甲战士 ---------- */
function ironcladHead(im,cx,cy,s){
  sp(im,[[cx-34*s,cy-14*s],[cx-26*s,cy-40*s],[cx-44*s,cy-56*s]],'#7a1f24'); // 左角
  sp(im,[[cx+34*s,cy-14*s],[cx+26*s,cy-40*s],[cx+44*s,cy-56*s]],'#7a1f24');
  circO(im,cx,cy,34*s,'#c8503f');
  im.rect(cx-34*s,cy+6*s,68*s,30*s*0+2*s,'#00000000');
  im.circle(cx,cy+10*s,26*s,'#b8453a');
  sp(im,[[cx-34*s,cy-6*s],[cx-20*s,cy-30*s],[cx-6*s,cy-6*s]],'#8a2f2a'); // 鬓角阴影
  im.ellipse(cx,cy+16*s,20*s,12*s,'#a83c33');
  eye(im,cx-13*s,cy-4*s,6*s,'#ffd24a'); eye(im,cx+13*s,cy-4*s,6*s,'#ffd24a');
  im.rect(cx-20*s,cy+14*s,40*s,4*s,'#5a1f1c'); // 嘴
  im.line(cx-8*s,cy+22*s,cx+8*s,cy+22*s,3*s,'#5a1f1c');
}
function ironcladBattle(){
  const im=new Img(128,152);
  sp(im,[[40,152],[52,104],[76,104],[88,152]],'#2c2c3a'); // 腿
  sp(im,[[44,140],[64,140],[64,152],[44,152]],'#1e1e2a');
  sp(im,[[64,140],[84,140],[84,152],[64,152]],'#1e1e2a');
  sp(im,[[34,58],[94,58],[88,110],[40,110]],'#33333f'); // 躯干甲
  sp(im,[[34,58],[94,58],[90,74],[38,74]],'#8a2f2a');
  sp(im,[[46,74],[82,74],[80,96],[48,96]],'#454552');
  sp(im,[[30,46],[44,44],[46,64],[32,66]],'#3d3d4a'); // 肩甲
  sp(im,[[84,44],[98,46],[96,66],[82,64]],'#3d3d4a');
  sp(im,[[26,60],[40,58],[46,102],[34,104]],'#c8503f'); // 左臂
  sp(im,[[88,58],[102,60],[96,104],[84,102]],'#c8503f');
  sp(im,[[96,96],[110,92],[124,20],[116,16]],'#9aa0b0'); // 剑
  sp(im,[[110,26],[126,22],[120,8],[106,12]],'#c8ccd8');
  im.rect(92,92,24,10,'#6a4a2a'); // 剑柄
  const hx=64,hy=32;
  sp(im,[[hx-30,hy-10],[hx-22,hy-34],[hx-40,hy-50]],'#7a1f24');
  sp(im,[[hx+30,hy-10],[hx+22,hy-34],[hx+40,hy-50]],'#7a1f24');
  circO(im,hx,hy,28,'#c8503f');
  eye(im,hx-10,hy-3,5,'#ffd24a'); eye(im,hx+10,hy-3,5,'#ffd24a');
  im.rect(hx-16,hy+10,32,3,'#5a1f1c');
  return im;
}
/* ---------- 静默猎手 ---------- */
function silentHead(im,cx,cy,s){
  sp(im,[[cx-40*s,cy+34*s],[cx-34*s,cy-16*s],[cx,cy-46*s],[cx+34*s,cy-16*s],[cx+40*s,cy+34*s]],'#2e5a3a');
  sp(im,[[cx-30*s,cy+30*s],[cx-26*s,cy-8*s],[cx,cy-34*s],[cx+26*s,cy-8*s],[cx+30*s,cy+30*s]],'#12241a');
  im.ellipse(cx,cy+18*s,14*s,10*s,'#d8b08a'); // 下巴
  eye(im,cx-11*s,cy-2*s,4.5*s,'#7dffb0'); eye(im,cx+11*s,cy-2*s,4.5*s,'#7dffb0');
  sp(im,[[cx-42*s,cy+30*s],[cx-20*s,cy+20*s],[cx-24*s,cy+44*s],[cx-46*s,cy+48*s]],'#254a30');
  sp(im,[[cx+42*s,cy+30*s],[cx+20*s,cy+20*s],[cx+24*s,cy+44*s],[cx+46*s,cy+48*s]],'#254a30');
}
function silentBattle(){
  const im=new Img(128,152);
  sp(im,[[44,152],[54,108],[74,108],[84,152]],'#1c3325');
  sp(im,[[40,52],[88,52],[96,146],[32,146]],'#2e5a3a'); // 斗篷
  sp(im,[[52,52],[76,52],[80,120],[48,120]],'#12241a');
  sp(im,[[46,54],[64,44],[82,54],[78,74],[50,74]],'#2e5a3a'); // 兜帽
  sp(im,[[52,56],[64,50],[76,56],[72,70],[56,70]],'#0c1a12');
  eye(im,58,62,3.5,'#7dffb0'); eye(im,70,62,3.5,'#7dffb0');
  im.ellipse(64,70,7,4,'#d8b08a');
  sp(im,[[36,70],[48,66],[34,120],[26,116]],'#2e5a3a'); // 左臂
  sp(im,[[92,70],[80,66],[94,120],[102,116]],'#2e5a3a');
  sp(im,[[24,112],[34,116],[18,148],[12,142]],'#b8c4cc'); // 左匕
  sp(im,[[104,112],[94,116],[110,148],[116,142]],'#b8c4cc');
  im.rect(24,110,12,6,'#5a4a32'); im.rect(92,110,12,6,'#5a4a32');
  return im;
}
/* ---------- 故障机器人 ---------- */
function defectHead(im,cx,cy,s){
  circO(im,cx,cy,30*s,'#5a7a96');
  im.rrect(cx-24*s,cy-16*s,48*s,22*s,8*s,'#1c2c3c');
  im.ellipse(cx-10*s,cy-5*s,7*s,5*s,'#5ef0ff'); im.ellipse(cx+10*s,cy-5*s,7*s,5*s,'#5ef0ff');
  im.rect(cx-14*s,cy+10*s,28*s,5*s,'#2c4256');
  im.rect(cx-4*s,cy-40*s,8*s,12*s,'#5a7a96'); im.circle(cx,cy-42*s,5*s,'#ff7a4a');
  im.glow(cx,cy-42*s,10*s,'#ff7a4a',0.7);
}
function defectBattle(){
  const im=new Img(128,152);
  sp(im,[[46,152],[50,124],[62,124],[60,152]],'#3d5468');
  sp(im,[[68,124],[78,124],[82,152],[70,152]],'#3d5468');
  sp(im,[[40,58],[88,58],[84,126],[44,126]],'#5a7a96');
  sp(im,[[46,66],[82,66],[80,118],[48,118]],'#3d5468');
  im.circle(64,92,16,'#10202c'); im.circle(64,92,12,'#5ef0ff');
  im.glow(64,92,26,'#5ef0ff',0.9);
  sp(im,[[34,60],[44,56],[48,104],[38,106]],'#4a6880'); // 左臂
  sp(im,[[94,60],[84,56],[80,104],[90,106]],'#4a6880');
  circO(im,40,110,8,'#3d5468'); circO(im,88,110,8,'#3d5468');
  sp(im,[[44,34],[84,34],[86,60],[42,60]],'#5a7a96'); // 头
  im.rrect(48,38,32,14,5,'#101c28');
  im.ellipse(57,45,5,4,'#5ef0ff'); im.ellipse(71,45,5,4,'#5ef0ff');
  im.rect(62,24,4,12,'#4a6880'); im.circle(64,22,5,'#ff7a4a'); im.glow(64,22,9,'#ff7a4a',0.8);
  circO(im,104,44,11,'#3d5468'); im.circle(104,44,7,'#8ad8f0'); // 悬浮球
  im.glow(104,44,16,'#8ad8f0',0.7);
  return im;
}
/* ---------- 观者 ---------- */
function watcherHead(im,cx,cy,s){
  im.ellipse(cx,cy+6*s,32*s,34*s,'#e8e2ee'); // 头/发
  sp(im,[[cx-34*s,cy-2*s],[cx,cy-44*s],[cx+34*s,cy-2*s],[cx+22*s,cy-14*s],[cx,cy-30*s],[cx-22*s,cy-14*s]],'#7a5ab8');
  im.ellipse(cx,cy+14*s,20*s,20*s,'#f0e8dc');
  eye(im,cx-11*s,cy+6*s,5*s,'#4a3a8a'); eye(im,cx+11*s,cy+6*s,5*s,'#4a3a8a');
  im.ellipse(cx,cy-8*s,5*s,7*s,'#e8b830'); // 第三眼
  im.glow(cx,cy-8*s,10*s,'#e8b830',0.8);
  im.line(cx-8*s,cy+26*s,cx+8*s,cy+26*s,3*s,'#a06a5a');
}
function watcherBattle(){
  const im=new Img(128,152);
  sp(im,[[38,44],[90,44],[102,146],[26,146]],'#e8e2ee'); // 长袍
  sp(im,[[52,44],[76,44],[80,146],[48,146]],'#c9c0dd');
  sp(im,[[38,44],[90,44],[88,64],[40,64]],'#7a5ab8');
  sp(im,[[46,88],[82,88],[84,104],[44,104]],'#5a3f9a'); // 腰带
  sp(im,[[34,60],[46,56],[52,110],[40,112]],'#e8e2ee');
  sp(im,[[94,60],[82,56],[78,110],[90,112]],'#e8e2ee');
  im.circle(100,116,8,'#f0e8dc'); im.circle(28,116,8,'#f0e8dc');
  im.rect(96,20,6,100,'#6a4a2a'); // 法杖
  im.circle(99,16,11,'#8a5ad8'); im.glow(99,16,20,'#b08aff',0.9);
  im.ellipse(64,32,22,24,'#f0e8dc');
  sp(im,[[42,30],[64,4],[86,30],[78,20],[64,12],[50,20]],'#7a5ab8');
  eye(im,56,32,4.5,'#4a3a8a'); eye(im,72,32,4.5,'#4a3a8a');
  im.ellipse(64,22,4,5.5,'#e8b830'); im.glow(64,22,8,'#e8b830',0.8);
  return im;
}

const POR = { ironclad:ironcladHead, silent:silentHead, defect:defectHead, watcher:watcherHead };
const BAT = { ironclad:ironcladBattle, silent:silentBattle, defect:defectBattle, watcher:watcherBattle };
const BG  = { ironclad:'#3a1418', silent:'#12291c', defect:'#132430', watcher:'#241a3a' };

for(const id of Object.keys(POR)){
  const im=new Img(100,100);
  im.fill(BG[id]);
  im.glow(50,50,56,'#ffffff',0.10);
  im.ring(50,50,46,4,'#00000066');
  POR[id](im,50,54,1);
  const n=im.save(OUT+'/char_'+id+'_portrait.png');
  const b=BAT[id]();
  b.save(OUT+'/char_'+id+'.png');
  console.log(id,n);
}
console.log('chars done');
