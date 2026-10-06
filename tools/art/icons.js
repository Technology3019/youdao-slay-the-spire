const { Img } = require('./artlib.js');
const OUT = '/root/杀戮尖塔/game/ui/src/assets/img';
const OL = '#151320';
function sp(im, pts, fill, th){
  im.poly(pts, fill);
  const t = th === undefined ? 2.5 : th;
  if (t > 0) for(let i=0;i<pts.length;i++){ const a=pts[i], b=pts[(i+1)%pts.length]; im.line(a[0],a[1],b[0],b[1],t,OL); }
}
function shield(im,cx,cy,w,h,c){
  sp(im,[[cx-w/2,cy-h/2],[cx+w/2,cy-h/2],[cx+w/2,cy+h*0.1],[cx,cy+h/2],[cx-w/2,cy+h*0.1]],c);
}
function drop(im,cx,cy,r,c){
  im.circle(cx,cy+r*0.3,r*0.8,c);
  sp(im,[[cx,cy-r],[cx+r*0.7,cy+r*0.1],[cx-r*0.7,cy+r*0.1]],c,0);
  im.circle(cx,cy+r*0.3,r*0.8,c);
  im.circle(cx-r*0.25,cy+r*0.15,r*0.28,'rgba(255,255,255,0.55)');
}
function heart(im,cx,cy,r,c){
  im.circle(cx-r*0.45,cy-r*0.2,r*0.6,c);
  im.circle(cx+r*0.45,cy-r*0.2,r*0.6,c);
  sp(im,[[cx-r*0.98,cy],[cx+r*0.98,cy],[cx,cy+r*1.05]],c,0);
  im.circle(cx,cy,r*0.5,c);
}
function bolt(im,cx,cy,s,c){
  sp(im,[[cx+s*0.25,cy-s],[cx-s*0.45,cy+s*0.15],[cx-s*0.05,cy+s*0.15],[cx-s*0.25,cy+s],[cx+s*0.45,cy-s*0.15],[cx+s*0.05,cy-s*0.15]],c,0);
}
function swordD(im,x1,y1,x2,y2,th,c,gl){
  im.line(x1,y1,x2,y2,th,c);
  const dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy)||1;
  const nx=-dy/L, ny=dx/L;
  const mx=x1+dx*0.22, my=y1+dy*0.22;
  im.line(mx+nx*th*1.6,my+ny*th*1.6,mx-nx*th*1.6,my-ny*th*1.6,th*0.9,'#6a4a2a');
  if(gl) im.line(x1,y1,x1+dx*0.7,y1+dy*0.7,th*0.35,'rgba(255,255,255,0.7)');
}
function ic(name,w,h,fn){ const im=new Img(w,h); fn(im,w,h); const n=im.save(OUT+'/'+name+'.png'); return n; }

/* ===== 卡牌框 88x124 ===== */
const FR=[['frame_attack','#c84040'],['frame_skill','#4a7fd0'],['frame_power','#8a4ad0'],['frame_colorless','#9a8a5a']];
for(const [name,bar] of FR){
  ic(name,88,124,(im)=>{
    im.rrect(1,1,86,122,8,'#26222e');
    im.rrect(1,1,86,122,8,'#00000000',0);
    for(let x=2;x<86;x++) { im.blend(x,2,0,0,0,1); im.blend(x,121,0,0,0,1); }
    for(let y=2;y<122;y++) { im.blend(2,y,0,0,0,1); im.blend(85,y,0,0,0,1); }
    im.rrect(4,4,80,16,6,bar);
    im.rrect(6,23,76,54,5,'#191622');
    im.rrect(6,80,76,38,5,'#1d1a26');
    for(let x=8;x<80;x++) im.blend(x,79,120,110,160,0.35);
    im.circle(14,12,9,'#f0ead0');
    for(let x=2;x<86;x++){ im.blend(x,1,21,19,32,1); im.blend(x,122,21,19,32,1); }
    for(let y=2;y<122;y++){ im.blend(1,y,21,19,32,1); im.blend(86,y,21,19,32,1); }
  });
}

/* ===== 卡面图案 56x56 ===== */
ic('ic_card_strike',56,56,(im)=>{
  swordD(im,8,48,46,10,6,'#c8ccd8',true);
  im.line(30,44,50,26,3,'rgba(255,255,255,0.55)');
  im.line(34,50,52,34,3,'rgba(255,255,255,0.35)');
});
ic('ic_card_block',56,56,(im)=>{ shield(im,28,30,34,40,'#4a7fd0'); im.line(28,12,28,44,3,'#8ec4f4'); });
ic('ic_card_flame',56,56,(im)=>{
  sp(im,[[28,6],[42,26],[40,44],[16,44],[14,26]],'#ff7a1a',0);
  sp(im,[[28,18],[36,30],[34,44],[22,44],[20,30]],'#ffc02e',0);
  im.ellipse(28,42,7,6,'#ffe9a0');
});
ic('ic_card_poison',56,56,(im)=>{
  drop(im,28,32,16,'#4fbf4a');
  im.circle(23,32,3,'#123a16'); im.circle(33,32,3,'#123a16');
  im.line(24,41,32,41,2,'#123a16');
  drop(im,45,44,6,'#7adf70');
});
ic('ic_card_blade',56,56,(im)=>{
  swordD(im,8,48,40,14,5,'#b8c4cc',true);
  swordD(im,48,48,16,14,5,'#b8c4cc',true);
});
ic('ic_card_orb',56,56,(im)=>{
  im.glow(28,28,24,'#ffe04a',0.8);
  im.circle(28,28,16,'#f0c020');
  bolt(im,28,28,13,'#fff8d0');
});
ic('ic_card_beam',56,56,(im)=>{
  for(let i=0;i<5;i++){ const a=-Math.PI/2+(i-2)*0.42;
    im.line(28,28,28+Math.cos(a)*26,28+Math.sin(a)*26,3.5,'#6ee8f0'); }
  im.circle(28,28,8,'#d8fbff'); im.glow(28,28,18,'#6ee8f0',0.9);
});
ic('ic_card_fist',56,56,(im)=>{
  im.rrect(14,18,30,26,8,'#d8907a');
  im.rrect(12,24,8,16,4,'#d8907a');
  for(let i=0;i<3;i++) im.line(20,22+i*8,42,22+i*8,2,'#8a5a4a');
  im.rrect(28,12,20,10,5,'#e8a890');
});
ic('ic_card_eye',56,56,(im)=>{
  sp(im,[[6,28],[28,12],[50,28],[28,44]],'#e8e4f0',0);
  im.circle(28,28,10,'#4a7fd0'); im.circle(28,28,5,'#101828');
  im.circle(24,24,2.5,'#ffffff');
});
ic('ic_card_snake',56,56,(im)=>{
  im.line(12,46,30,44,7,'#4fbf4a');
  im.line(30,44,22,30,7,'#4fbf4a');
  im.line(22,30,36,24,7,'#4fbf4a');
  im.line(36,24,44,14,7,'#4fbf4a');
  im.circle(45,13,6,'#4fbf4a'); im.circle(47,11,2,'#ffe04a');
});
ic('ic_card_hammer',56,56,(im)=>{
  im.line(16,48,38,20,6,'#6a4a2a');
  sp(im,[[26,8],[50,16],[46,30],[22,22]],'#9aa0ac');
  sp(im,[[30,12],[46,17],[43,26],[27,21]],'#c8ccd8',0);
});
ic('ic_card_ice',56,56,(im)=>{
  const c='#8ec4f4';
  for(let i=0;i<6;i++){ const a=i*Math.PI/3;
    im.line(28,28,28+Math.cos(a)*22,28+Math.sin(a)*22,3.5,c);
    im.line(28+Math.cos(a)*13,28+Math.sin(a)*13,28+Math.cos(a+0.5)*18,28+Math.sin(a+0.5)*18,3,c);
    im.line(28+Math.cos(a)*13,28+Math.sin(a)*13,28+Math.cos(a-0.5)*18,28+Math.sin(a-0.5)*18,3,c); }
  im.circle(28,28,5,'#d8f0ff');
});
ic('ic_card_dark',56,56,(im)=>{
  for(let i=0;i<3;i++){ const x=12+i*13;
    im.line(x,8,x+6,30,5,'#7a3ad0'); im.line(x+6,30,x+2,48,5,'#7a3ad0'); }
  im.glow(28,28,22,'#7a3ad0',0.5);
});
ic('ic_card_heal',56,56,(im)=>{ heart(im,28,28,18,'#e84a6a'); im.circle(22,22,4,'rgba(255,255,255,0.6)'); });
ic('ic_card_draw',56,56,(im)=>{
  im.ring(28,28,17,5,'#6ee8f0');
  sp(im,[[45,14],[52,24],[40,26]],'#6ee8f0',0);
  sp(im,[[11,42],[4,32],[16,30]],'#6ee8f0',0);
});
ic('ic_card_energy',56,56,(im)=>{ bolt(im,28,28,22,'#ffe04a'); im.glow(28,28,24,'#ffe04a',0.6); });
ic('ic_card_wind',56,56,(im)=>{
  const c='#a8e8d0';
  im.line(8,20,38,20,4,c); im.line(38,20,46,26,4,c); im.circle(44,28,4,c,0);
  im.line(8,32,44,32,4,c); im.line(44,32,50,38,4,c); im.circle(48,40,4,c,0);
  im.line(14,44,40,44,4,c);
});
ic('ic_card_sword2',56,56,(im)=>{
  swordD(im,8,48,46,10,5,'#c8ccd8',true);
  swordD(im,48,48,10,10,5,'#c8ccd8',true);
});
ic('ic_card_blood',56,56,(im)=>{ drop(im,28,26,17,'#c8203a'); drop(im,42,44,7,'#e84a5a'); });
ic('ic_card_star',56,56,(im)=>{
  sp(im,[[28,4],[34,22],[52,28],[34,34],[28,52],[22,34],[4,28],[22,22]],'#e8d06a',0);
  im.glow(28,28,26,'#e8d06a',0.5);
});

/* ===== 状态图标 32x32 ===== */
ic('ic_str',32,32,(im)=>{
  sp(im,[[16,4],[27,17],[21,17],[21,28],[11,28],[11,17],[5,17]],'#e84a4a',0);
  im.glow(16,18,14,'#e84a4a',0.4);
});
ic('ic_vuln',32,32,(im)=>{
  shield(im,16,16,22,26,'#c85040');
  im.line(16,4,13,14,2.5,'#2a1014'); im.line(13,14,18,18,2.5,'#2a1014'); im.line(18,18,14,28,2.5,'#2a1014');
});
ic('ic_weak',32,32,(im)=>{
  sp(im,[[16,28],[5,15],[11,15],[11,4],[21,4],[21,15],[27,15]],'#7a8ac8',0);
  im.glow(16,18,13,'#7a8ac8',0.4);
});
ic('ic_poison',32,32,(im)=>{
  drop(im,16,15,11,'#4fbf4a');
  im.circle(12,16,2.5,'#0d2a10'); im.circle(20,16,2.5,'#0d2a10');
  im.line(12,23,20,23,2,'#0d2a10');
});
ic('ic_shield',32,32,(im)=>{ shield(im,16,16,22,26,'#4a7fd0'); im.line(16,5,16,26,2.5,'#8ec4f4'); });
ic('ic_dexterity',32,32,(im)=>{
  sp(im,[[6,20],[14,20],[10,28],[22,12],[14,12],[18,4]],'#4fd07a',0);
  im.glow(16,16,13,'#4fd07a',0.4);
});
ic('ic_thorns',32,32,(im)=>{
  im.ring(16,16,10,4,'#8a6a4a');
  for(let i=0;i<8;i++){ const a=i*Math.PI/4;
    im.line(16+Math.cos(a)*10,16+Math.sin(a)*10,16+Math.cos(a)*15,16+Math.sin(a)*15,3,'#b89060'); }
});
ic('ic_focus',32,32,(im)=>{
  im.ring(16,16,12,3,'#6ee8f0');
  im.ring(16,16,7,3,'#6ee8f0');
  im.circle(16,16,3,'#d8fbff');
});
ic('ic_mantra',32,32,(im)=>{
  im.ring(16,16,10,3.5,'#e8b830');
  for(let i=0;i<6;i++){ const a=i*Math.PI/3;
    im.line(16+Math.cos(a)*4,16+Math.sin(a)*4,16+Math.cos(a)*13,16+Math.sin(a)*13,2.5,'#e8b830'); }
  im.circle(16,16,3.5,'#fff0c0');
});

/* ===== 意图图标 28x28 ===== */
ic('intent_attack',28,28,(im)=>{ swordD(im,5,24,23,5,4,'#e85a5a',true); });
ic('intent_defend',28,28,(im)=>{ shield(im,14,14,17,21,'#5a9fe8'); });
ic('intent_buff',28,28,(im)=>{
  sp(im,[[14,3],[24,14],[18,14],[18,25],[10,25],[10,14],[4,14]],'#ffa03a',0);
  im.glow(14,15,12,'#ffa03a',0.5);
});
ic('intent_debuff',28,28,(im)=>{
  sp(im,[[14,25],[4,14],[10,14],[10,3],[18,3],[18,14],[24,14]],'#b06aff',0);
  im.glow(14,14,12,'#b06aff',0.5);
});
ic('intent_unknown',28,28,(im)=>{
  im.ring(10,10,6,3,'#e8e4f0');
  im.line(10,16,10,20,3,'#e8e4f0');
  im.circle(10,24,2.5,'#e8e4f0');
});
ic('intent_attack_buff',28,28,(im)=>{
  swordD(im,4,24,18,7,4,'#e85a5a',true);
  sp(im,[[21,4],[26,12],[22,12],[22,20],[18,12],[21,12]],'#ffa03a',0);
});

/* ===== 遗物图标 40x40 ===== */
ic('relic_blood',40,40,(im)=>{
  sp(im,[[20,6],[30,20],[28,32],[12,32],[10,20]],'#ff7a1a',0);
  drop(im,20,20,10,'#c8203a');
});
ic('relic_ring',40,40,(im)=>{
  im.ring(20,24,11,5,'#e8b830');
  im.line(12,14,20,8,5,'#4fbf4a'); im.line(20,8,28,13,5,'#4fbf4a');
  im.circle(29,14,4,'#4fbf4a'); im.circle(30,13,1.5,'#ffe04a');
});
ic('relic_core',40,40,(im)=>{
  sp(im,[[20,5],[33,13],[33,28],[20,36],[7,28],[7,13]],'#3ab8d8',0);
  im.glow(20,20,16,'#3ab8d8',0.7);
  im.line(14,12,24,22,2.5,'#0e2a34'); im.line(24,22,17,32,2.5,'#0e2a34'); im.line(24,22,30,14,2.5,'#0e2a34');
});
ic('relic_water',40,40,(im)=>{ drop(im,20,18,13,'#4a9fe8'); });
ic('relic_energy',40,40,(im)=>{
  im.rrect(9,12,22,22,4,'#4fd07a');
  im.rect(15,7,10,6,'#4fd07a');
  bolt(im,20,23,9,'#fff8d0');
});
ic('relic_anchor',40,40,(im)=>{
  im.ring(20,9,5,3,'#9aa0ac');
  im.line(20,14,20,33,4,'#9aa0ac');
  im.line(9,22,31,22,4,'#9aa0ac');
  im.line(9,22,7,30,3.5,'#9aa0ac'); im.line(31,22,33,30,3.5,'#9aa0ac');
  im.line(7,30,14,34,3.5,'#9aa0ac'); im.line(33,30,26,34,3.5,'#9aa0ac');
});
ic('relic_coin',40,40,(im)=>{
  im.circle(15,25,10,'#e8b830'); im.ring(15,25,6,2,'#b8862a');
  im.circle(26,26,9,'#f0c84a'); im.ring(26,26,5.5,2,'#b8862a');
  im.circle(21,15,8,'#e8b830'); im.ring(21,15,5,2,'#b8862a');
});
ic('relic_feather',40,40,(im)=>{
  im.line(8,34,30,8,3,'#c8ccd8');
  for(let i=0;i<7;i++){ const t=i/7;
    const x=8+22*t, y=34-26*t;
    im.line(x,y,x+8-6*t,y-6,4,'#e8f0f8');
    im.line(x,y,x-6+4*t,y+6,4,'#b8c4d0'); }
});
ic('relic_horn',40,40,(im)=>{
  sp(im,[[8,32],[14,12],[24,8],[32,14],[22,18],[16,26]],'#c8904a',0);
  im.line(14,13,30,13,2,'#8a5a2a');
  im.circle(9,33,4,'#6a4a2a');
});
ic('relic_compass',40,40,(im)=>{
  im.circle(20,20,14,'#e8e0cc'); im.ring(20,20,14,3,'#8a8060');
  sp(im,[[20,8],[25,20],[20,32],[15,20]],'#c84040',0);
  im.circle(20,20,3,'#4a4438');
});
ic('relic_crown',40,40,(im)=>{
  sp(im,[[7,30],[7,13],[15,21],[20,9],[25,21],[33,13],[33,30]],'#e8b830',0);
  im.rect(7,27,26,6,'#e8b830');
  im.circle(20,30,3,'#c8203a');
  im.circle(13,29,2.5,'#4a9fe8'); im.circle(27,29,2.5,'#4a9fe8');
});
ic('relic_charm',40,40,(im)=>{
  shield(im,20,20,24,28,'#e8b830');
  im.line(20,9,20,30,3,'#8a5a2a'); im.line(11,18,29,18,3,'#8a5a2a');
});

/* ===== 充能球 36x36 ===== */
ic('orb_lightning',36,36,(im)=>{
  im.glow(18,18,17,'#ffe04a',0.9);
  im.circle(18,18,13,'#f0c020');
  bolt(im,18,18,11,'#fffbe8');
});
ic('orb_frost',36,36,(im)=>{
  im.glow(18,18,17,'#8ec4f4',0.8);
  im.circle(18,18,13,'#cfe8fa');
  const c='#4a9fe8';
  for(let i=0;i<6;i++){ const a=i*Math.PI/3;
    im.line(18,18,18+Math.cos(a)*11,18+Math.sin(a)*11,2.5,c); }
  im.ring(18,18,7,2,c);
});
ic('orb_dark',36,36,(im)=>{
  im.glow(18,18,17,'#7a3ad0',0.9);
  im.circle(18,18,13,'#3a1a66');
  im.circle(18,18,7,'#140826');
  im.circle(14,14,2.5,'#b06aff');
});

/* ===== 姿态图标 36x36 ===== */
ic('stance_anger',36,36,(im)=>{
  im.glow(18,18,16,'#ff7a1a',0.8);
  im.circle(18,18,13,'#e84a2a');
  sp(im,[[10,14],[16,16],[11,19]],'#2a0e08',0);
  sp(im,[[26,14],[20,16],[25,19]],'#2a0e08',0);
  im.line(12,25,24,25,3,'#2a0e08');
});
ic('stance_calm',36,36,(im)=>{
  im.glow(18,18,16,'#4a9fe8',0.7);
  im.circle(18,18,13,'#2a5a8a');
  im.line(10,16,15,14,2.5,'#8ec4f4'); im.line(15,14,21,17,2.5,'#8ec4f4'); im.line(21,17,26,15,2.5,'#8ec4f4');
  im.line(10,23,15,21,2.5,'#8ec4f4'); im.line(15,21,21,24,2.5,'#8ec4f4'); im.line(21,24,26,22,2.5,'#8ec4f4');
});
ic('stance_divine',36,36,(im)=>{
  im.glow(18,18,17,'#e8b830',1);
  for(let i=0;i<8;i++){ const a=i*Math.PI/4;
    im.line(18+Math.cos(a)*7,18+Math.sin(a)*7,18+Math.cos(a)*16,18+Math.sin(a)*16,3,'#f0d060'); }
  im.circle(18,18,7,'#fff4c8'); im.ring(18,18,7,2,'#c8902a');
});

/* ===== 应用图标 120x120 ===== */
ic('app_icon',120,120,(im)=>{
  im.gradV(0,0,120,120,'#141428','#33204a');
  im.glow(88,32,26,'#c8324a',0.55);
  im.circle(88,32,15,'#8e1f33');
  for(let i=0;i<26;i++){ const x=(i*37)%116+2, y=(i*53)%60+2; im.circle(x,y,1.2,'rgba(255,255,255,0.7)'); }
  for(let i=0;i<6;i++){ const w=44-i*5;
    im.rect(60-w/2, 112-(i+1)*13, w, 13, '#0b0b14'); }
  im.rect(46,30,28,10,'#0b0b14');
  im.rect(50,24,5,8,'#0b0b14'); im.rect(65,24,5,8,'#0b0b14');
  im.glow(56,64,10,'#e8a030',0.7); im.rect(54,60,4,7,'#e8b040');
  sp(im,[[16,74],[46,64],[52,104],[22,114]],'#c8a04a');
  im.line(20,78,48,69,3,'#8a6520'); im.line(25,96,50,88,3,'#8a6520');
  for(let x=2;x<118;x++){ im.blend(x,1,0,0,0,0.5); im.blend(x,118,0,0,0,0.5); }
  for(let y=2;y<118;y++){ im.blend(1,y,0,0,0,0.5); im.blend(118,y,0,0,0,0.5); }
});
console.log('icons done');
