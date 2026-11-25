import json,re,sys,os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
rd=lambda f:open(f,encoding='utf-8').read()
p1=rd('p1.js').replace('__FONTS__',rd('fonts.json'))
js='\n'.join([rd('p0.js'),p1,rd('p2.js'),open('p3a.js').read(),rd('p3h.js'),open('p3b.js').read(),open('p3c.js').read(),open('p3e.js').read(),open('p3f.js').read(),open('p3g.js').read(),open('p3d.js').read(),open('p5a.js').read(),open('p5b.js').read(),open('p4a.js').read(),open('p4b.js').read()])
open('app.js','w').write(js)
body=open('base_body.html').read().split('\n')
mq='\n'.join(body[:111])
mq=mq.replace('<div id="infos" class="infos"></div>','<div id="infos" class="infos"></div>\n      <div class="field" style="margin-top:6px"><span class="lbl">Autres informations (non affichées en bas, utilisables comme sous-titre)</span></div>\n      <div id="extra" class="infos"></div>')
bodyh=mq+'\n'+open('body_visuel.html').read()
css=open('base.css').read().replace('AMInter','AM_inter').replace('AMBricolage','AM_bricolage')
css+='''
.ctabs{display:flex;flex-wrap:wrap;gap:6px;position:sticky;top:8px;z-index:5;padding:6px;border-radius:999px;background:rgba(5,14,22,.82);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--line)}
.ctabs button{font:inherit;font-size:14px;cursor:pointer;padding:8px 14px;border-radius:999px;border:1px solid transparent;background:transparent;color:var(--muted);flex:1 1 auto}
.ctabs button[aria-pressed="true"]{color:#FFE9D9;border-color:rgba(255,160,90,.7);background:linear-gradient(180deg,rgba(255,138,61,.34),rgba(255,138,61,.1));box-shadow:0 0 18px rgba(255,138,61,.28)}
.panel h3+.pbody{margin-top:14px}
.chips .chip .ap{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0}
textarea{font:inherit;width:100%;border-radius:12px;border:1px solid var(--line);background:rgba(255,255,255,.05);color:var(--fg);padding:9px 11px;resize:vertical}
.el-list{display:flex;flex-direction:column;gap:6px}
.el{display:flex;gap:6px;align-items:stretch}
.el .el-n{flex:1;text-align:left;font:inherit;cursor:pointer;padding:9px 12px;border-radius:12px;border:1px solid var(--line);background:var(--glass);color:var(--fg);display:flex;flex-direction:column}
.el .el-n small{color:var(--muted);font-size:12px}
.el.on .el-n{border-color:rgba(255,160,90,.7);background:rgba(255,138,61,.16)}
.el.off .el-n{opacity:.55}
.el .el-eye{font:inherit;font-size:13px;cursor:pointer;padding:0 12px;border-radius:12px;border:1px solid var(--line);background:var(--glass);color:var(--fg);min-width:84px}
.el-edit{display:flex;flex-direction:column;gap:10px;padding:12px;border-radius:14px;border:1px solid rgba(255,160,90,.5);background:rgba(255,138,61,.08)}
.cats{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
.cats button{font:inherit;font-size:13px;cursor:pointer;padding:6px 12px;border-radius:999px;border:1px solid var(--line);background:var(--glass);color:var(--muted)}
.cats button small{opacity:.65;margin-left:3px}
.cats button[aria-pressed="true"]{color:#FFE9D9;border-color:rgba(255,160,90,.7);background:rgba(255,138,61,.2)}
/* ===== habillage application mobile ===== */
html{background:#02070C;-webkit-tap-highlight-color:transparent}
body{padding:0 0 calc(84px + env(safe-area-inset-bottom,0px));padding-left:0;padding-right:0;font-size:15px}
.wrap{max-width:480px;gap:14px;padding:0 14px}
#view-marque.wrap,#view-visuel.wrap{padding:0}
.nav.appbar{position:sticky;top:0;z-index:40;margin:0 -14px;border-radius:0;border:0;border-bottom:1px solid var(--line);padding:calc(10px + env(safe-area-inset-top,0px)) 16px 10px;background:rgba(5,14,22,.86);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:none;flex-wrap:nowrap}
.mark{gap:12px}.mark i{display:none}
.applogo{display:block;width:38px;height:38px;border-radius:11px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.1)}
.applogo svg{display:block;width:100%;height:100%}
.mt{display:flex;flex-direction:column;line-height:1.15}.mt b{font-weight:600;font-size:16px;letter-spacing:.01em}.mt small{font-size:12px;color:var(--muted)}
.tabs{display:none}
.intro{align-items:flex-start;text-align:left;gap:6px;padding:14px 2px 2px}
.intro .eyebrow{display:none}#view-visuel .intro{display:none}.intro h1{font-size:24px;font-weight:600}.intro p{font-size:13.5px}
.panel{padding:16px;border-radius:20px;gap:12px}
.studio{grid-template-columns:minmax(0,1fr)!important;gap:12px}
.stage-col{position:sticky;top:calc(58px + env(safe-area-inset-top,0px));z-index:30;margin:0 -14px;padding:8px 14px 8px;background:rgba(5,14,22,.94);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--line);gap:8px}
.stage{padding:6px;min-height:0;border-radius:16px}
.stage canvas{max-height:27dvh;max-width:100%;border-radius:6px}
#stage-info{display:none}
.stage-col .row{gap:8px!important}.stage-col .row .lbl{display:none}
#drag-seg{flex-wrap:nowrap;gap:6px}#drag-seg button{padding:6px 14px;font-size:13px}
.ctabs{position:static;display:flex;flex-wrap:nowrap;overflow-x:auto;gap:6px;padding:0;border:0;background:none;border-radius:0;backdrop-filter:none;-webkit-backdrop-filter:none;scrollbar-width:none;margin:0 -14px;padding:0 14px}
.ctabs::-webkit-scrollbar{display:none}
.ctabs button{flex:0 0 auto;padding:9px 16px;font-size:14px;border:1px solid var(--line);background:var(--glass)}
.btn,.seg button,.cats button,.chip button{min-height:40px}
input[type=text],input[type=tel],input[type=email],input[type=url],input:not([type]),select,textarea{font-size:16px}
.bottomnav{position:fixed;left:50%;bottom:0;transform:translateX(-50%);width:min(100%,480px);z-index:50;display:flex;justify-content:space-around;align-items:stretch;padding:8px 10px calc(8px + env(safe-area-inset-bottom,0px));background:rgba(8,18,28,.92);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-top:1px solid var(--line);border-radius:22px 22px 0 0;box-shadow:0 -10px 34px rgba(0,0,0,.45)}
.bottomnav a,.bottomnav button{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:7px 4px;border:0;background:none;color:var(--muted);font:inherit;font-size:11.5px;letter-spacing:.02em;text-decoration:none;border-radius:16px;cursor:pointer}
.bottomnav svg{width:24px;height:24px}
.bottomnav [aria-current="page"]{color:#FFE9D9;background:linear-gradient(180deg,rgba(255,138,61,.3),rgba(255,138,61,.08));box-shadow:inset 0 1px 0 rgba(255,255,255,.2)}
.bottomnav [aria-current="page"] svg{filter:drop-shadow(0 0 8px rgba(255,138,61,.7))}
@media (min-width:600px){body{background:radial-gradient(60% 40% at 50% 0,#0A2638,transparent 70%),#02070C}.wrap{box-shadow:0 0 0 1px rgba(255,255,255,.06),0 30px 80px rgba(0,0,0,.6);background:rgba(5,14,22,.72);min-height:100vh;border-radius:0}}
.gal.tall{grid-template-columns:repeat(auto-fill,minmax(98px,1fr))}
.gal.tall canvas{max-height:210px}
input[type=text],input[type=tel],input[type=email]{min-width:0}
.slots{display:flex;flex-direction:column;gap:10px}
.slot{display:flex;gap:10px;padding:10px;border-radius:14px;border:1px solid var(--line);background:var(--glass)}
.slot-th{width:64px;height:64px;border-radius:10px;flex:none}
.slot-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.slot-main small{color:var(--muted)}
.slot-btns{display:flex;flex-wrap:wrap;gap:6px}.slot-adj{margin-top:4px}
.slot-add{display:flex;flex-direction:column;gap:6px;align-items:flex-start}.slot-add small{color:var(--muted)}
.cutov{z-index:70;overflow:auto;justify-content:flex-start;padding-top:calc(14px + env(safe-area-inset-top,0px))}
.cut-box{width:min(100%,460px);display:flex;flex-direction:column;gap:10px}
#cutcv{width:100%;max-height:52dvh;object-fit:contain;border-radius:10px;touch-action:none;background:#888;cursor:crosshair}
'''
fc=open('fonts.css').read()

import re as _re
logo=open('logo_inline.svg').read()
hdr='''<header class="nav appbar"><div class="mark"><span class="applogo">'''+logo+'''</span><span class="mt"><b>Atelier de Marque</b><small id="bar-sub">Logo, charte et visuels</small></span></div></header>'''
bodyh=_re.sub(r'<header class="nav">.*?</header>',lambda m:hdr,bodyh,count=1,flags=_re.S)
ico=lambda d:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>'
bnav='<nav class="bottomnav" aria-label="Navigation"><a href="#marque" id="tab-marque">'+ico('<circle cx="12" cy="12" r="9"/><path d="M8.5 15.5L12 7l3.5 8.5M9.8 12.8h4.4"/>')+'<span>Marque</span></a><a href="#visuel" id="tab-visuel">'+ico('<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4.5 4"/>')+'<span>Visuel</span></a><button type="button" id="nav-export">'+ico('<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5"/><path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/>')+'<span>Exporter</span></button></nav>'

html='<!doctype html>\n<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Atelier de Marque</title>'+open('app_head.txt').read()+'\n<style>\n'+fc+'\n'+css+'\n</style></head><body>\n'+bodyh+bnav+'\n<script>\n'+js+'\n</script></body></html>\n'
open('atelier-de-marque.html','w').write(html)
print(len(html))
# livrable : la version de test garde le crochet window.__atelier, la version hors ligne ne l'a pas
off='\n'.join(l for l in html.split('\n') if 'window.__atelier=' not in l)
assert 'window.__atelier' not in off
open('atelier-de-marque-hors-ligne.html','w').write(off)
open('atelier-de-marque-artifact.html','w').write(off[off.index('<title>'):])
