import json,re
L=open('old.js').read().split('\n')
sl=lambda a,b:'\n'.join(L[a-1:b])
fonts=open('fonts.json').read()
p1=open('p1.js').read().replace('__FONTS__',fonts)
glyph=sl(238,296)
glyph=glyph.replace("case'address':ctx.beginPath();ctx.arc(0,-h*.22","""case'hours':ctx.beginPath();ctx.arc(0,0,h*.92,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-h*.5);ctx.lineTo(0,0);ctx.lineTo(h*.42,h*.28);ctx.stroke();break;
    case'legal':ctx.font=`700 ${h*2.1}px Arial, sans-serif`;ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText('\\u00A9',0,h*.7);break;
    case'snapchat':ctx.beginPath();ctx.arc(0,-h*.2,h*.68,Math.PI,0);ctx.lineTo(h*.68,h*.82);ctx.lineTo(h*.34,h*.56);ctx.lineTo(0,h*.82);ctx.lineTo(-h*.34,h*.56);ctx.lineTo(-h*.68,h*.82);ctx.closePath();ctx.stroke();break;
    case'pinterest':ctx.beginPath();ctx.arc(0,0,h*.92,0,Math.PI*2);ctx.stroke();ctx.font=`700 ${h*1.3}px Arial, sans-serif`;ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.fillText('P',0,h*.46);break;
    case'city':case'address':ctx.beginPath();ctx.arc(0,-h*.22""",1)
assert "case'city'" in glyph
assert 'rows.length<=o.maxRows&&Math.max' in glyph
glyph=glyph.replace('rows.length<=o.maxRows&&Math.max','rows.length<=(f>=.78?Math.min(o.maxRows,2):o.maxRows)&&Math.max')
glyph=glyph.replace("['facebook','instagram','linkedin','x','tiktok','youtube']","['facebook','instagram','linkedin','x','tiktok','youtube','snapchat','pinterest']")
js='\n'.join([sl(1,8),sl(11,25),p1,sl(91,202),open('p3a.js').read(),glyph,open('p3b.js').read(),open('p3c.js').read(),open('p3e.js').read(),open('p3f.js').read(),open('p3d.js').read(),open('p4a.js').read(),open('p4b.js').read()])
open('app.js','w').write(js)
body=open('old_body.html').read().split('\n')
mq='\n'.join(body[:111])
mq=mq.replace('<div id="infos" class="infos"></div>','<div id="infos" class="infos"></div>\n      <div class="field" style="margin-top:6px"><span class="lbl">Autres informations (non affichées en bas, utilisables comme sous-titre)</span></div>\n      <div id="extra" class="infos"></div>')
bodyh=mq+'\n'+open('body_visuel.html').read()
css=open('old.css').read().replace('AMInter','AM_inter').replace('AMBricolage','AM_bricolage')
css+='''
.ctabs{display:flex;flex-wrap:wrap;gap:6px;position:sticky;top:8px;z-index:5;padding:6px;border-radius:999px;background:rgba(5,14,22,.82);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--line)}
.ctabs button{font:inherit;font-size:14px;cursor:pointer;padding:8px 14px;border-radius:999px;border:1px solid transparent;background:transparent;color:var(--muted);flex:1 1 auto}
.ctabs button[aria-pressed="true"]{color:#FFE9D9;border-color:rgba(255,160,90,.7);background:linear-gradient(180deg,rgba(255,138,61,.34),rgba(255,138,61,.1));box-shadow:0 0 18px rgba(255,138,61,.28)}
.panel h3+.pbody{margin-top:14px}
.chips .chip .ap{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0}
textarea{font:inherit;width:100%;border-radius:12px;border:1px solid var(--line);background:rgba(255,255,255,.05);color:var(--fg);padding:9px 11px;resize:vertical}
.cats{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
.cats button{font:inherit;font-size:13px;cursor:pointer;padding:6px 12px;border-radius:999px;border:1px solid var(--line);background:var(--glass);color:var(--muted)}
.cats button small{opacity:.65;margin-left:3px}
.cats button[aria-pressed="true"]{color:#FFE9D9;border-color:rgba(255,160,90,.7);background:rgba(255,138,61,.2)}
.fab{display:none;position:fixed;right:14px;bottom:14px;z-index:20;font:inherit;font-weight:600;padding:12px 20px;border-radius:999px;border:1px solid rgba(255,160,90,.8);background:linear-gradient(180deg,#FF8A3D,#E2661E);color:#1a0d04;box-shadow:0 8px 24px rgba(0,0,0,.45);cursor:pointer}
@media (max-width:760px){.fab:not([hidden]){display:block}#view-marque~.fab{display:none}}
.gal.tall{grid-template-columns:repeat(auto-fill,minmax(98px,1fr))}
.gal.tall canvas{max-height:210px}
input[type=text],input[type=tel],input[type=email]{min-width:0}
'''
fc=open('fonts.css').read()
html='<!doctype html>\n<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Atelier de Marque</title>\n<style>\n'+fc+'\n'+css+'\n</style></head><body>\n'+bodyh+'\n<script>\n'+js+'\n</script></body></html>\n'
open('atelier-de-marque.html','w').write(html)
print(len(html))
