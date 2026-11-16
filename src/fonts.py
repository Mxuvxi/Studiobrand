import base64, io, sys, json
from fontTools import subset
from fontTools.ttLib import TTFont
CF='/mnt/skills/examples/canvas-design/canvas-fonts/'
GF='/usr/share/fonts/truetype/google-fonts/'
IN='/usr/share/fonts/opentype/inter/'
# id: (label, cat, {weight: path})
F={
 'bricolage':('Bricolage Grotesque','Sobres',{400:CF+'BricolageGrotesque-Regular.ttf',700:CF+'BricolageGrotesque-Bold.ttf'}),
 'instrument':('Instrument Sans','Sobres',{400:CF+'InstrumentSans-Regular.ttf',700:CF+'InstrumentSans-Bold.ttf'}),
 'poppins':('Poppins','Sobres',{400:GF+'Poppins-Regular.ttf',700:GF+'Poppins-Bold.ttf'}),
 'inter':('Inter','Sobres',{400:IN+'Inter-Regular.otf',700:IN+'Inter-Bold.otf'}),
 'work':('Work Sans','Sobres',{400:CF+'WorkSans-Regular.ttf',700:CF+'WorkSans-Bold.ttf'}),
 'outfit':('Outfit','Sobres',{400:CF+'Outfit-Regular.ttf',700:CF+'Outfit-Bold.ttf'}),
 'nationalpark':('National Park','Sobres',{400:CF+'NationalPark-Regular.ttf',700:CF+'NationalPark-Bold.ttf'}),
 'jura':('Jura','Sobres',{0:CF+'Jura-Medium.ttf'}),
 'bigshoulders':('Big Shoulders','Percutantes',{400:CF+'BigShoulders-Regular.ttf',700:CF+'BigShoulders-Bold.ttf'}),
 'smooch':('Smooch Sans','Percutantes',{0:CF+'SmoochSans-Medium.ttf'}),
 'erica':('Erica One','Percutantes',{0:CF+'EricaOne-Regular.ttf'}),
 'boldonse':('Boldonse','Percutantes',{0:CF+'Boldonse-Regular.ttf'}),
 'tektur':('Tektur','Percutantes',{0:CF+'Tektur-Medium.ttf'}),
 'jetbrains':('JetBrains Mono','Percutantes',{400:CF+'JetBrainsMono-Regular.ttf',700:CF+'JetBrainsMono-Bold.ttf'}),
 'lora':('Lora','Élégantes',{400:CF+'Lora-Regular.ttf',700:CF+'Lora-Bold.ttf'}),
 'crimson':('Crimson Pro','Élégantes',{400:CF+'CrimsonPro-Regular.ttf',700:CF+'CrimsonPro-Bold.ttf'}),
 'plexserif':('IBM Plex Serif','Élégantes',{400:CF+'IBMPlexSerif-Regular.ttf',700:CF+'IBMPlexSerif-Bold.ttf'}),
 'young':('Young Serif','Élégantes',{0:CF+'YoungSerif-Regular.ttf'}),
 'gloock':('Gloock','Élégantes',{0:CF+'Gloock-Regular.ttf'}),
 'baskerville':('Libre Baskerville','Élégantes',{0:CF+'LibreBaskerville-Regular.ttf'}),
 'instserif':('Instrument Serif','Élégantes',{0:CF+'InstrumentSerif-Regular.ttf'}),
 'italiana':('Italiana','Élégantes',{0:CF+'Italiana-Regular.ttf'}),
 'poiret':('Poiret One','Élégantes',{0:CF+'PoiretOne-Regular.ttf'}),
 'nothing':('Nothing You Could Do','Manuscrites',{0:CF+'NothingYouCouldDo-Regular.ttf'}),
}
UNI=list(range(0x20,0x7F))+list(range(0xA0,0x100))+[0x152,0x153,0x2013,0x2014,0x2018,0x2019,0x201A,0x201C,0x201D,0x201E,0x2022,0x2026,0x20AC,0x2122,0x2192,0x2190,0x2191,0x2193]
css=[];tot=0;meta=[]
for fid,(label,cat,files) in F.items():
    meta.append({'id':fid,'label':label,'cat':cat,'two':0 not in files})
    for w,path in files.items():
        opts=subset.Options(); opts.flavor='woff'; opts.layout_features=['kern','liga','calt']; opts.notdef_outline=True; opts.hinting=False
        f=TTFont(path); s=subset.Subsetter(opts); s.populate(unicodes=UNI); s.subset(f)
        f.flavor='woff'; b=io.BytesIO(); f.save(b); data=b.getvalue(); tot+=len(data)
        wt='100 900' if w==0 else str(w)
        css.append('@font-face{font-family:"AM_%s";src:url(data:font/woff;base64,%s) format("woff");font-weight:%s;font-style:normal;font-display:block}'%(fid,base64.b64encode(data).decode(),wt))
open('fonts.css','w').write('\n'.join(css))
json.dump(meta,open('fonts.json','w'),ensure_ascii=False)
print('total woff KB',tot//1024,'css KB',sum(len(c) for c in css)//1024,file=sys.stderr)
