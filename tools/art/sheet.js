const fs=require('fs'), zlib=require('zlib'), path=require('path');
const { Img } = require('./artlib.js');
function decode(file){
  const b=fs.readFileSync(file);
  const w=b.readUInt32BE(16), h=b.readUInt32BE(20);
  let p=8, idat=[];
  while(p<b.length){ const len=b.readUInt32BE(p), t=b.slice(p+4,p+8).toString('latin1');
    if(t==='IDAT') idat.push(b.slice(p+8,p+8+len)); p+=12+len; }
  const raw=zlib.inflateSync(Buffer.concat(idat));
  const stride=w*4+1;
  for(let y=0;y<h;y++){ const f=raw[y*stride];
    if(f!==0) throw new Error('filter '+f+' not supported in '+file);
    raw.copy? null:null;
  }
  const px=Buffer.alloc(w*h*4);
  for(let y=0;y<h;y++) raw.copy(px, y*w*4, y*stride+1, y*stride+1+w*4);
  return {w,h,px};
}
function blit(dst, src, dx, dy, sw, sh){
  for(let y=0;y<sh;y++)for(let x=0;x<sw;x++){
    const sx=Math.floor(x*src.w/sw), sy=Math.floor(y*src.h/sh);
    const si=(sy*src.w+sx)*4;
    dst.blend(dx+x, dy+y, src.px[si], src.px[si+1], src.px[si+2], src.px[si+3]/255);
  }
}
function sheet(files, cols, cw, ch, out, bg){
  const rows=Math.ceil(files.length/cols);
  const im=new Img(cols*cw, rows*ch, bg||'#000000');
  files.forEach((f,i)=>{
    const src=decode(f);
    blit(im, src, (i%cols)*cw, Math.floor(i/cols)*ch, cw-4, ch-4);
  });
  im.save(out);
  console.log('sheet:', out, files.length);
}
module.exports={sheet, decode, blit};
if(require.main===module){
  const D='/root/杀戮尖塔/game/ui/src/assets/img';
  sheet(['ironclad','silent','defect','watcher'].map(n=>D+'/char_'+n+'_portrait.png')
    .concat(['ironclad','silent','defect','watcher'].map(n=>D+'/char_'+n+'.png')),
    4, 132, 156, '/root/杀戮尖塔/tools/art/sheet_chars.png', '#202030');
}
