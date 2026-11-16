
function draw(ctx,W,H,opt){
  opt=opt||{};const tpl=opt.tpl||v.tpl,main=!opt.thumb,kS=opt.k||1,ph=opt.thumb&&v.photoSm?v.photoSm:v.photo;
  const b=current,C={...b.colors};if(v.accent)C.accent=v.accent;
  const base=Math.min(W,H),wide=W/H>1.5;
  const m=Math.round(base*.06*v.margin),safeY=v.fmt==='story'?Math.round(H*.09):0;
  const items=footerItems(),hasFooter=items.length>0,pos=b.logoPos||'tl';
  const nF=items.length,rowsE=Math.min(wide?2:3,nF<=2?1:nF<=6?2:3),iS=Math.round(base*(wide?.085:.056)),footEst=nF?rowsE*iS*1.2+(rowsE-1)*iS*.35:0;
  const L=layoutFor(tpl,W,H,{base,wide,m,safeY,hasFooter,footEst,pos}),pf=L.panelFit;
  const P0=curPair(),P=(v.tFont==='auto'&&L.font)?{...P0,d:L.font.d}:P0;
  const align=v.align!=='auto'?v.align:(L.align||(pos[1]==='c'?'center':'left'));
  const ty=v.ty!=='auto'?v.ty:(L.ty||(pos[0]==='b'?'t':'b'));
  let mode=v.footerPos!=='auto'?v.footerPos:L.footer;
  if(pf&&(mode==='bottom'||mode==='bar'))mode='under';
  /* fond derrière le texte et couleur du texte */
  let boxFill=null;
  if(v.tBox!=='none'&&!pf)boxFill=v.tBox==='dark'?'#10151A':v.tBox==='light'?'#FFFFFF':v.tBox==='accent'?C.accent:'rgba(14,20,26,.58)';
  let backdrop=null;
  if(boxFill)backdrop=v.tBox==='glass'?'#10151A':boxFill;
  else if(pf)backdrop=pf.color==='accent'?C.accent:C.bg;
  else if(L.panelCol==='accent'||L.bgColor==='accent')backdrop=C.accent;
  else if(!L.textOnPhoto)backdrop=C.bg;
  const photoDark=v.ovColor==='white'?false:true;
  let tcol;
  if(v.tColor)tcol=v.tColor;
  else if(backdrop)tcol=backdrop===C.bg&&!boxFill?C.text:readableOn(backdrop,'#FFFFFF','#11171A');
  else tcol=v.ovColor==='black'?'#FFFFFF':v.ovColor==='white'?'#11171A':C.text;
  const refBg=backdrop||(lum(tcol)>.5?'#222222':'#EEEEEE');
  const hlColor=contrast(C.accent,refBg)>=2.2?C.accent:(contrast(C.second,refBg)>=2.2?C.second:(lum(tcol)>.5?'#11171A':'#FFFFFF'));
  const ctaFill=contrast(C.accent,refBg)>=2.2?C.accent:tcol,ctaText=readableOn(ctaFill);
  const iconSize=Math.round(base*(wide?.085:.056)),maxRows=wide?2:3,gapF=Math.round(base*.025);
  const area={x:pf?pf.x+pf.pad:L.content.x,w:pf?pf.w-2*pf.pad:L.content.w};
  const bpad=boxFill?Math.round(base*.035):0;
  const tW=Math.max(40,area.w*clamp(v.tWidth,.4,1)-2*bpad),offX=v.dx*W;
  const tx0=(align==='center'?area.x+(area.w-tW)/2:align==='right'?area.x+area.w-tW-bpad:area.x+bpad);
  const ffg=(L.footOnBg&&mode!=='under')?C.text:tcol;
  const fx=L.footArea&&mode==='bottom'?L.footArea.x:area.x,fw=L.footArea&&mode==='bottom'?L.footArea.w:area.w;
  const fl=layoutFooter(ctx,items,{x:mode==='under'?area.x+offX:fx,maxW:mode==='under'?area.w:fw,align,size:iconSize,maxRows,pair:P,style:b.iconStyle,fg:ffg,accent:(L.footOnBg&&mode!=='under')?C.accent:hlColor});
  let bar=null;
  if(mode==='bar'&&hasFooter){const pad=Math.round(base*.025),bh=Math.round(fl.height+pad*2);bar={y:H-safeY-bh,h:bh,pad}}
  let top=L.content.y,bot=L.content.y+L.content.h,footY=0;
  if(bar)bot=Math.min(bot,bar.y-Math.round(m*.6));
  if(hasFooter&&mode==='bottom'){
    if(L.footArea){footY=H-safeY-Math.round(m*.75)-fl.height}
    else{footY=bot-fl.height;bot=footY-Math.round(gapF*1.4)}}
  else if(hasFooter&&mode==='top'){footY=top;top=top+fl.height+Math.round(gapF*1.4)}
  const reachesBottom=L.logoArea.y+L.logoArea.h>=H-1;
  const logoO={img:b.logoImg,pos,area:L.logoArea,base,mm:Math.round((L.logoMM||base*.06)*v.logoMargin),resTop:L.logoArea.y<1?safeY:0,resBottom:reachesBottom?(bar?H-bar.y:(hasFooter&&mode==='bottom'?H-footY:safeY)):0,lum:b.logoLum,C,W,H,mul:L.logoMul,center:L.logoCenter};
  if(!v.logoFree){
    const lg=logoGeom(logoO),gapL=Math.round(base*.025),ox=lg.x<tx0+offX+tW&&lg.x+lg.bw>tx0+offX;
    if(L.logoCenter!=null){if(ty!=='t')bot=Math.min(bot,Math.max(top+base*.2,lg.y+lg.bh+base*.4))}
    else if(ty==='t'&&ox&&L.logoArea.y<1&&lg.y+lg.bh/2<H*.5)top=Math.max(top,lg.y+lg.bh+gapL);
    else if(ty==='b'&&ox&&reachesBottom&&lg.y+lg.bh/2>=H*.5)bot=Math.min(bot,lg.y-gapL);
  }
  const underH=(hasFooter&&mode==='under')?fl.height+Math.round(gapF*1.3):0;
  let avail=Math.max(20,bot-top);
  const size=(wide?base*.16:base*.105)*L.sizeK*v.tSize;
  const upper=v.upper==='upper'||(v.upper==='auto'&&!!L.upper);
  const kick=(v.kicker||'').trim();
  let tagsStr=(v.tags||'').trim();if(!tagsStr&&L.demoTags)tagsStr=L.demoTags;if(tagsStr==='-')tagsStr='';
  const tags=tagsStr?tagsStr.split(/[,;\n]+/).map(s=>s.trim()).filter(Boolean).slice(0,8):[];
  const tagFill=L.tagFill==='accent'?C.accent:L.tagFill==='soft'?rgba(tcol,.22):null;
  const tagText=L.tagFill==='accent'?readableOn(C.accent):tcol;
  const pillFill=contrast(C.accent,refBg)>=2.2?C.accent:tcol;
  const fitOpts={x:tx0+offX,maxW:tW,size,maxLines:L.lines,align,base,wide,pair:P,C:{...C,text:tcol},title:v.title,sub:v.sub,lhK:v.lh,sK:v.sSize,upper,bar:v.accentBar,effect:v.tEffect,ls:v.ls,hl:v.hl,hlColor,
    kicker:L.ownKicker?'':kick,pillFill,pillText:readableOn(pillFill),tags,tagsStack:L.tagsStack,tagsNum:L.tagsNum,tagFill,tagText,cta:(v.cta||'').trim(),ctaFill,ctaText};
  let tb=fitBlock(ctx,fitOpts,avail-underH-2*bpad);
  let groupH=tb.height+underH;
  let gy=ty==='t'?top+bpad:ty==='m'?top+(avail-groupH-2*bpad)/2+bpad:bot-groupH-bpad;
  if(!v.logoFree&&L.logoCenter==null&&!pf&&L.logoArea.y<1&&ty!=='t'){
    const lg=logoGeom(logoO),gapL=Math.round(base*.025),ox=lg.x<tx0+offX+tW&&lg.x+lg.bw>tx0+offX;
    if(ox&&lg.y+lg.bh/2<H*.5&&gy<lg.y+lg.bh+gapL){
      top=Math.max(top,lg.y+lg.bh+gapL);avail=Math.max(20,bot-top);
      tb=fitBlock(ctx,fitOpts,avail-underH-2*bpad);groupH=tb.height+underH;
      gy=ty==='m'?top+(avail-groupH-2*bpad)/2+bpad:bot-groupH-bpad;
    }
  }
  gy+=v.dy*H;
  let panel=null;
  if(pf){const ph2=groupH+2*pf.pad;const py=clamp(gy-pf.pad,safeY,Math.max(safeY,H-safeY-ph2));gy=py+pf.pad;panel={x:pf.x,y:py,w:pf.w,h:ph2}}
  const box=boxFill?{x:tx0+offX-bpad,y:gy-bpad,w:tW+2*bpad,h:groupH+2*bpad}:null;

  ctx.clearRect(0,0,W,H);ctx.fillStyle=L.bgColor==='accent'?C.accent:C.bg;ctx.fillRect(0,0,W,H);
  const rad=L.shape==='round'?v.radius*base*L.radMul:0;
  const e={W,H,base,m,safeY,C,tcol,L,hlColor,kick:kick||(opt.thumb&&tpl==='encoches'?'12 JAN · 18H':''),pair:P,pos,rad,wide};
  if(L.before)L.before(ctx,e);
  drawPhoto(ctx,ph,L.photo,L.shape,rad,base,main,kS,C);
  const ovType=v.ov==='auto'?L.ovType:v.ov;
  if(ovType!=='none'){
    const baseA=ovType===L.ovType?L.ovAlpha:(ovType==='solid'?.5:.95),A=baseA*v.ovAmount;
    const hex=v.ovColor==='black'?'#000000':v.ovColor==='white'?'#FFFFFF':C.bg;
    const rectO=bar?{...L.photo,h:Math.max(1,bar.y-L.photo.y)}:L.photo;
    const clipFn=()=>shapePath(ctx,L.photo,L.shape,rad);
    if(ovType==='gradient'&&ty==='m')overlay(ctx,rectO,'solid','bottom',hex,A*.55,0,clipFn);
    else{
      const reach=clamp((groupH+((hasFooter&&(mode==='bottom'||mode==='top'))?fl.height:0)+m*3)/rectO.h,.35,.92);
      overlay(ctx,rectO,ovType,ty==='t'?'top':'bottom',hex,A,reach,clipFn);
    }
  }
  if(L.frame){ctx.save();ctx.strokeStyle=tcol;ctx.globalAlpha=.92;ctx.lineWidth=L.frame.lw;ctx.strokeRect(L.frame.inset,L.frame.inset+safeY*.3,W-2*L.frame.inset,H-2*L.frame.inset-safeY*.6);ctx.restore()}
  if(L.after)L.after(ctx,e);
  if(panel){
    ctx.save();ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=base*.04;ctx.shadowOffsetY=base*.01;
    const pc=pf.color==='accent'?C.accent:C.bg;ctx.fillStyle=pf.alpha>=1?pc:rgba(pc,pf.alpha);ctx.beginPath();rrPath(ctx,panel.x,panel.y,panel.w,panel.h,pf.radius||0);
    if(pf.tail){const tx=panel.x+pf.radius*1.3,ty0=panel.y+panel.h-1,th=base*.04;ctx.moveTo(tx,ty0);ctx.lineTo(tx+th*1.3,ty0);ctx.lineTo(tx,ty0+th)}
    ctx.fill();ctx.restore()}
  if(box){ctx.save();if(v.tBox!=='glass'){ctx.shadowColor='rgba(0,0,0,.25)';ctx.shadowBlur=base*.03}ctx.fillStyle=boxFill;ctx.beginPath();rrPath(ctx,box.x,box.y,box.w,box.h,base*.03);ctx.fill();
    if(v.tBox==='glass'){ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=Math.max(2,base*.003);ctx.stroke()}ctx.restore()}
  if(bar){ctx.fillStyle=C.bg;ctx.fillRect(0,bar.y,W,H-bar.y);fl.paint(bar.y+bar.pad)}
  tb.paint(gy);
  if(hasFooter){
    if(mode==='bottom'||mode==='top')fl.paint(footY);
    else if(mode==='under')fl.paint(gy+tb.height+Math.round(gapF*1.3));
  }
  let badge=(v.badge||'').trim();if(!badge)badge=L.badgeDef||'';if(badge==='-')badge='';
  if(badge)drawBadge(ctx,e,badge);
  drawLogo(ctx,logoO);
}
