const { Img } = require('./artlib.js');
const OUT = '/root/杀戮尖塔/game/ui/src/assets/img';
function rng(seed){ let a=seed>>>0; return ()=>{ a=(a+0x6D2B79F5)>>>0; let t=Math.imul(a^(a>>>15),1|a); t=(t+Math.imul(t^(t>>>7),61|t))^t; return ((t^(t>>>14))>>>0)/4294967296; }; }
const W=800, H=254;

function stones(im, y0, y1, seed, base){
  const r=rng(seed);
  for(let y=y0;y<y1;y+=26){
    const off=(Math.floor(y/26)%2)*22;
    for(let x=-24;x<W;x+=44){
      const g=Math.floor((r()-0.5)*18);
      const c=[Math.max(0,Math.min(255,base[0]+g)),Math.max(0,Math.min(255,base[1]+g)),Math.max(0,Math.min(255,base[2]+g))];
      im.rrect(x+off+1,y+1,42,24,4,'rgb('+c[0]+','+c[1]+','+c[2]+')');
    }
  }
}
function vignette(im){
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const dx=(x-W/2)/(W/2), dy=(y-H/2)/(H/2);
    const d=Math.sqrt(dx*dx+dy*dy)/1.42;
    const k=Math.max(0,d-0.5)*1.15;
    im.blend(x,y,0,0,0,Math.min(0.6,k));
  }
}
function tower(im,cx,baseY,h,wd,col){
  const seg=Math.max(4,Math.floor(h/24));
  for(let i=0;i<seg;i++){
    const t=i/seg, w=wd*(1-t*0.45);
    const y=baseY-h*(i+1)/seg;
    im.rect(cx-w/2,y,w,h/seg+1,col);
  }
  const wt=wd*0.55;
  im.rect(cx-wt/2,baseY-h-13,wt,13,col);
  for(let i=0;i<4;i++) im.rect(cx-wt/2+i*(wt/4),baseY-h-21,wt/8,9,col);
}
function save(name,fn){ const im=new Img(W,H); fn(im); const n=im.save(OUT+'/'+name+'.png'); console.log(name,n); }

save('bg_title', im=>{
  im.gradV(0,0,W,H,'#07070f','#241436');
  const r=rng(7);
  for(let i=0;i<260;i++){ const x=r()*W,y=r()*170,s=r()*1.6+0.4;
    im.circle(x,y,s,'rgba(255,255,255,'+(0.25+r()*0.6).toFixed(2)+')'); }
  im.glow(628,64,60,'#c8324a',0.55);
  im.circle(628,64,36,'#8e1f33'); im.circle(620,57,30,'#a72a40');
  im.circle(636,71,6,'#6d1526'); im.circle(622,63,5,'#6d1526');
  tower(im,560,254,200,86,'#0b0b14');
  im.glow(548,150,34,'#e8a030',0.4); im.rect(542,140,6,11,'#e8b040');
  im.glow(574,196,30,'#e8a030',0.35); im.rect(570,188,6,11,'#e8b040');
  im.rect(0,236,W,18,'#08080e');
  const r2=rng(19);
  for(let i=0;i<26;i++){ const x=r2()*W; im.poly([[x,254],[x+26,254-14-r2()*26],[x+56,254]],'#0d0d16'); }
  vignette(im);
});

save('bg_map', im=>{
  im.gradV(0,0,W,H,'#141420','#0c0c14');
  stones(im,0,H,11,[58,56,66]);
  im.gradV(0,0,W,90,'#000000aa','#00000000');
  for(let i=0;i<5;i++){
    const x=80+i*160;
    im.glow(x,64,46,'#ff9a3c',0.42);
    im.rect(x-4,44,8,22,'#5a4632');
    im.ellipse(x,40,6,10,'#ffb347'); im.ellipse(x,36,3,6,'#ffe08a');
  }
  const r=rng(23);
  for(let i=0;i<24;i++){ const x=r()*W,y=100+r()*(H-130);
    im.line(x,y,x+8+r()*18,y+8+r()*14,2,'rgba(20,18,26,0.75)'); }
  vignette(im);
});

save('bg_battle', im=>{
  im.gradV(0,0,W,150,'#1a1626','#3a3350');
  im.glow(120,50,70,'#6a5a8a',0.4);
  im.glow(660,60,80,'#7a5a6a',0.35);
  for(let i=0;i<12;i++){ const x=8+i*66; const hh=60+(i%3)*30;
    im.rect(x,150-hh,44,hh,'#241f36'); if(i%2===0) im.rect(x+10,150-hh-14,24,14,'#241f36'); }
  im.rect(0,148,W,14,'#1d1a2c');
  stones(im,162,H,31,[74,70,84]);
  const r=rng(41);
  for(let i=0;i<18;i++){ const x=r()*W,y=170+r()*76;
    im.line(x,y,x+10+r()*22,y+4+r()*8,2,'rgba(30,26,40,0.6)'); }
  im.gradV(0,H-70,W,70,'#00000000','#00000088');
  vignette(im);
});

save('bg_rest', im=>{
  im.gradV(0,0,W,H,'#0d0b12','#171019');
  stones(im,0,H,53,[46,42,52]);
  im.gradV(0,0,W,H,'#00000000','#00000088');
  const cx=400, cy=206;
  im.glow(cx,cy-24,130,'#ff8c2a',0.55);
  im.glow(cx,cy-16,70,'#ffb64a',0.6);
  im.line(cx-36,cy+24,cx+32,cy+12,11,'#4a3222');
  im.line(cx-30,cy+12,cx+36,cy+26,11,'#5a3d29');
  im.ellipse(cx,cy+2,24,9,'#2a1c14');
  im.ellipse(cx,cy-14,18,27,'#ff7a1a');
  im.ellipse(cx,cy-21,12,20,'#ffb02e');
  im.ellipse(cx,cy-28,6,13,'#ffe9a0');
  const r=rng(97);
  for(let i=0;i<14;i++){ im.circle(cx-16+r()*32, cy-58-r()*70, 1.4+r()*1.5, '#ffcf6a'); }
  vignette(im);
});

save('bg_shop', im=>{
  im.gradV(0,0,W,H,'#191309','#241a0e');
  stones(im,0,H,67,[64,54,40]);
  im.rect(0,0,W,34,'#2c2113');
  for(let i=0;i<3;i++){ const shelfY=64+i*70;
    im.rect(0,shelfY,W,10,'#3a2c1a');
    const r=rng(71+i);
    for(let k=0;k<22;k++){ const x=14+k*36+r()*8, y=shelfY-30;
      const cols=['#7a3b2e','#3b6b4a','#4a4a7a','#7a6b2e','#5a2e5a'];
      im.rrect(x,y,14,30,5,cols[k%5]); im.rect(x+4,y-6,6,8,'#2e2418'); } }
  im.glow(400,40,80,'#ffd27a',0.6);
  im.line(400,0,400,30,3,'#1a140c');
  im.circle(400,44,15,'#ffdd8a'); im.circle(400,44,9,'#fff3c8');
  im.rrect(724,214,60,36,6,'#5a4430'); im.rect(730,246,48,8,'#4a3826');
  vignette(im);
});

save('bg_chest', im=>{
  im.gradV(0,0,W,H,'#0e0e18','#161626');
  stones(im,0,H,83,[52,52,66]);
  const cx=400;
  im.poly([[cx-52,140],[cx+52,140],[cx+150,0],[cx-150,0]],'rgba(255,214,120,0.20)');
  im.glow(cx,150,120,'#ffd66a',0.55);
  im.rrect(cx-56,150,112,66,8,'#6b4a26');
  im.rrect(cx-56,150,112,24,8,'#7d5830');
  im.rect(cx-58,174,116,9,'#3d2a16');
  im.rrect(cx-15,174,30,24,5,'#d8a63a'); im.circle(cx,185,6,'#8a6520');
  im.rect(cx-3,183,6,11,'#5a4014');
  const r=rng(101);
  for(let i=0;i<16;i++){ const a=r()*Math.PI*2, d=r()*90;
    im.ellipse(cx+Math.cos(a)*d, 224+Math.abs(Math.sin(a))*d*0.3, 5+r()*4, 3+r()*3, '#e8b84a'); }
  vignette(im);
});

save('bg_event', im=>{
  im.gradV(0,0,W,H,'#120c1e','#1e1230');
  const r=rng(113);
  for(let i=0;i<26;i++){ const x=r()*W,y=r()*H,rr=50+r()*90;
    im.glow(x,y,rr,i%2?'#5a3a8a':'#3a2a6a',0.30); }
  const cx=400, cy=127;
  im.glow(cx,cy,130,'#7a4ad0',0.5);
  im.ring(cx,cy,70,5,'#a06ae8');
  im.ring(cx,cy,50,3,'#8a55d8');
  for(let i=0;i<8;i++){ const a=i/8*Math.PI*2;
    const x=cx+Math.cos(a)*70, y=cy+Math.sin(a)*70;
    im.poly([[x,y-9],[x+7,y],[x,y+9],[x-7,y]],'#d8b8ff'); }
  im.ring(cx,cy,26,4,'#e8d0ff');
  vignette(im);
});

save('bg_win', im=>{
  im.gradV(0,0,W,H,'#2a1a3a','#f0a050');
  im.gradV(0,0,W,110,'#1a1030','#4a2a5a');
  im.glow(400,150,170,'#ffd27a',0.75);
  im.circle(400,150,48,'#ffdf9a');
  for(let i=0;i<16;i++){ const a=Math.PI+(i-7.5)*0.15;
    im.line(400,150,400+Math.cos(a)*430,150+Math.sin(a)*300,6,'rgba(255,226,160,0.30)'); }
  tower(im,400,254,210,84,'#150e1e');
  im.rect(0,242,W,12,'#120b18');
  vignette(im);
});
console.log('bg 800x254 done');
