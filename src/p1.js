
const LS='atelier-de-marque-v2';
/* ---------- données ---------- */
const PAIRS=[
  {name:'Bricolage Grotesque + Instrument Sans',d:'AM_bricolage',b:'AM_instrument'},
  {name:'Lora + Work Sans',d:'AM_lora',b:'AM_work'},
  {name:'Poppins + Inter',d:'AM_poppins',b:'AM_inter'},
  {name:'Big Shoulders + Work Sans',d:'AM_bigshoulders',b:'AM_work'},
  {name:'Young Serif + Outfit',d:'AM_young',b:'AM_outfit'},
  {name:'Gloock + Instrument Sans',d:'AM_gloock',b:'AM_instrument'},
  {name:'Erica One + Outfit',d:'AM_erica',b:'AM_outfit'},
  {name:'Smooch Sans + Inter',d:'AM_smooch',b:'AM_inter'},
  {name:'Libre Baskerville + Work Sans',d:'AM_baskerville',b:'AM_work'},
  {name:'Italiana + Outfit',d:'AM_italiana',b:'AM_outfit'},
  {name:'Instrument Serif + Inter',d:'AM_instserif',b:'AM_inter'},
  {name:'Tektur + Inter',d:'AM_tektur',b:'AM_inter'},
  {name:'Poiret One + Lora',d:'AM_poiret',b:'AM_lora'},
  {name:'Crimson Pro + Poppins',d:'AM_crimson',b:'AM_poppins'},
  {name:'Nothing You Could Do + Work Sans',d:'AM_nothing',b:'AM_work'}
];
const FIELDS=[
  ['phone','Téléphone','+236 70 00 00 00','tel'],['whatsapp','WhatsApp','+236 70 00 00 00','tel'],
  ['email','E-mail','contact@votremarque.com','email'],['web','Site web','www.votremarque.com','text'],
  ['address','Adresse','Rue, quartier','text'],['city','Ville / pays','Bangui, Centrafrique','text'],['hours','Horaires','Lun-Sam 8h-18h','text'],['legal','Mention légale','RCCM 00-0000','text'],
  ['instagram','Instagram','@votremarque','text'],
  ['facebook','Facebook','VotreMarque','text'],['linkedin','LinkedIn','votre-marque','text'],
  ['x','X (Twitter)','@votremarque','text'],['tiktok','TikTok','@votremarque','text'],['youtube','YouTube','@votremarque','text'],
  ['snapchat','Snapchat','votremarque','text'],['pinterest','Pinterest','votremarque','text']
];
const EXTRA=[['sector','Secteur d\'activité','Boutique, restaurant, cabinet…'],['desc','Description courte','Ce que fait l\'entreprise'],['founder','Fondateur / contact','Prénom Nom'],['year','Année de création','2020'],['mentions','Autres mentions','Livraison gratuite dès 20 000']];
const LABEL=Object.fromEntries(FIELDS.map(f=>[f[0],f[1]]));
const ORDER=['instagram','facebook','linkedin','x','tiktok','youtube','snapchat','pinterest','whatsapp','phone','email','web','address','city','hours','legal'];
const SOCIAL=['instagram','facebook','linkedin','x','tiktok','youtube','snapchat','pinterest','whatsapp'];
const DEMO_INFO={instagram:'@votremarque',facebook:'VotreMarque',web:'www.votremarque.com'};
const POS=[['tl','Haut gauche'],['tc','Haut centre'],['tr','Haut droite'],['bl','Bas gauche'],['bc','Bas centre'],['br','Bas droite']];
const ICONSTYLES=[['contour','Contour'],['plein','Plein'],['pastille','Pastille']];
const FORMATS={
  post:{label:'Post carré',w:1080,h:1080,note:'Instagram, Facebook'},
  portrait:{label:'Post portrait',w:1080,h:1350,note:'Instagram 4:5'},
  story:{label:'Story',w:1080,h:1920,note:"Instagram, Facebook, WhatsApp. Le haut et le bas restent libres pour l'interface de l'application."},
  affiche:{label:'Affiche 2:3',w:1080,h:1620,note:'Affiche, flyer, impression A4 ou A3'},
  rollup:{label:'Roll-up',w:1080,h:2160,note:'Kakémono, roll-up 85 × 200 cm (ratio 1:2)'},
  linkedin:{label:'LinkedIn',w:1200,h:627,note:'Publication LinkedIn'},
  banniere:{label:'Bannière',w:1500,h:500,note:'En-tête de profil X ou LinkedIn'}
};
const TPLS={
  affiche:{label:'Affiche',info:'Photo plein cadre, grand titre sur dégradé.'},
  bandeau:{label:'Bandeau',info:'Photo plein cadre, bandeau de marque en bas avec les coordonnées.'},
  cadre:{label:'Cadre',info:'Photo encadrée sur fond de marque, texte dessous ou à gauche.'},
  carte:{label:'Carte',info:'Carte de marque posée sur la photo.'},
  split:{label:'Moitié',info:"Photo d'un côté, panneau de marque de l'autre."},
  minimal:{label:'Minimal',info:'Petit texte discret au bas de la photo.'},
  centre:{label:'Centré',info:'Titre centré sur la photo assombrie.'},
  cercle:{label:'Cercle',info:'Photo en cercle sur fond de marque.'},
  arche:{label:'Arche',info:'Photo en arche sur fond de marque.'},
  ruban:{label:'Ruban',info:'Ruban de marque posé en travers de la photo.'},
  magazine:{label:'Magazine',info:'Titre en majuscules et filet de couverture.'},
  lisere:{label:'Liseré',info:'Photo plein cadre avec un fin contour arrondi de la couleur de la marque.',tag:1},
  panneau:{label:'Panneau',info:"Photo plein cadre, grand panneau de couleur en bas avec une encoche arrondie.",tag:1},
  encoches:{label:'Encoches',info:"Cadre de couleur, photo aux coins creusés, onglet pour la date ou le thème.",tag:1},
  cartecta:{label:'Carte + bouton',info:'Photo en haut, carte de couleur vive avec titre, sous-titre et bouton.',tag:1},
  courbe:{label:'Courbe',info:'Fond de couleur, photo à bord ondulé et trait courbe qui traverse le visuel.',tag:1},
  bulle:{label:'Bulle',info:'Photo plein cadre, texte dans une bulle de dialogue colorée.',tag:1},
  diagonale:{label:'Diagonale',info:'Photo coupée en biais, texte sur fond de marque.',tag:1},
  vague:{label:'Vague',info:'Photo à bord bas ondulé, texte sur fond de marque.',tag:1},
  nuage:{label:'Nuage',info:'Photo à bord bas en nuage, texte centré dessous.',tag:1},
  citation:{label:'Citation',info:'Grande citation centrée avec petit portrait rond.',tag:1},
  offre:{label:'Offre',info:'Photo, pastille de promotion en étoile et bouton. Saisissez la pastille dans « Texte ».',tag:1},
  conseil:{label:'Conseil',info:'Fond de couleur, photo arrondie, pastille de rubrique et liste.',tag:1},
  etiquettes:{label:'Étiquettes',info:'Photo avec titre et étiquettes empilées.',tag:1},
  marque:{label:'Marque',info:'Grand logo centré sur la photo assombrie, titre court dessous.',tag:1}
};
const CATS=[['all','Tous'],['post','Post'],['affiche','Affiche'],['invitation','Invitation'],['promo','Promo'],['rollup','Roll-up'],['recrut','Recrutement'],['digital','Digital'],['citation','Citation'],['multi','Multi-photos']];
CATS.splice(1,0,['libre','Libre']);
const TALL=['portrait','affiche','story'],SQ=['post','portrait'];
Object.entries({post:['bandeau','cadre','carte','split','minimal','centre','cercle','arche','lisere','bulle','vague','nuage','marque'],affiche:['affiche','magazine','panneau','courbe','diagonale'],invitation:['encoches'],promo:['offre','cartecta','ruban','etiquettes'],citation:['citation','conseil']}).forEach(([c,ks])=>ks.forEach(k=>{TPLS[k].cat=c}));
/* modèles construits entièrement par code (voir CUSTOM) */
const NEWT={
  libre:['libre','Composition libre','Point de départ vierge : photo plein cadre, puis gérez chaque élément (logo, titre, date, lieu, bouton, coordonnées, personne détourée) dans l\'onglet Éléments.',SQ.concat(['affiche','story','rollup','linkedin','banniere']),1],
  webinaire:['digital','Webinaire','Intervenant détouré devant une forme colorée, thème, date, heure et lieu. Champ « Intervenant » dans l\'onglet Texte ; photo à détourer dans l\'onglet Photo.',SQ.concat(['affiche','story']),1],
  urbain:['affiche','Affiche urbaine','Grand titre, décor de ville, deux personnes détourées, ruban et cases date et heure.',['portrait','affiche','story'],2],
  soleil:['affiche','Soleil','Grand titre derrière la personne détourée, disque de soleil, infos sur les côtés et mots-clés.',['portrait','affiche','story'],1],
  trio:['multi','Trio','Trois photos en colonnes avec légendes (mots-clés), titre en haut.',SQ.concat(['affiche','story']),3],
  collage2:['multi','Collage','Deux photos façon tirages superposés, titre dessous.',SQ.concat(['affiche','story']),2],
  avant_apres:['multi','Avant / Après','Deux photos côte à côte avec étiquettes Avant et Après, titre en bandeau.',SQ.concat(['affiche','story']),2],
  grille4:['multi','Grille de 4','Quatre photos en grille avec le titre au centre.',SQ.concat(['affiche']),4],
  equipe:['multi','Équipe','Trois portraits en cercle avec noms et fonctions (saisis dans « Liste A », un par ligne : Nom | fonction).',SQ.concat(['affiche']),3],
  duo_cut:['multi','Duo détouré','Deux personnes détourées sur fond de couleur, noms en bandeaux.',SQ.concat(['affiche','story']),2],
  trio_cut:['multi','Trio détouré','Trois personnes détourées, celle du milieu plus grande, noms en bandeaux.',SQ.concat(['affiche','story']),3],
  polaroid:['post','Polaroïd','Photo façon tirage instantané sur fond de couleur, légèrement inclinée.',SQ],
  typo:['post','Typographique','Grand titre sur fond de couleur, photo en médaillon.',SQ],
  coin:['post','Coin','Photo plein cadre, grand quart de cercle de couleur dans le coin avec le titre.',SQ.concat(['story'])],
  bandes:['post','Bandes','Photo coupée en deux, bandes de couleur obliques et titre sur la bande.',SQ.concat(['story'])],
  duo:['post','Duo','Deux photos côte à côte (la même, cadrée différemment), titre dessous.',SQ.concat(['story'])],
  chiffre:['promo','Chiffre clé','Un grand chiffre ou prix (saisi dans « Pastille de promotion ») avec le titre.',SQ.concat(['story'])],
  prix:['promo','Prix','Photo, grande étiquette de prix ou de réduction et liste d\'avantages.',SQ.concat(['affiche'])],
  invit_nuit:['invitation','Invitation nuit','Invitation élégante sur fond sombre : titre, encadré date et heure, lieu.',TALL],
  invit_rideau:['invitation','Invitation rideau','Photo teintée en haut, bandeau de date, lieu sur fond blanc.',SQ.concat(['affiche','story'])],
  invit_gala:['invitation','Invitation gala','Photo teintée plein cadre, titre en gras, bandeau date et heure, lieu.',TALL],
  invit_voile:['invitation','Invitation clair','Fond clair avec formes de couleur, grand titre, cases pointillées, date et lieu.',TALL],
  evenement:['invitation','Événement','Photo sous un voile de couleur, titre, thème surligné, date, lieu et contacts.',SQ.concat(['affiche'])],
  flyer_lancement:['affiche','Flyer lancement','En-tête de marque, titre en rubans, photo, texte de présentation, date, lieu.',['affiche','portrait']],
  flyer_services:['affiche','Flyer services','Accroche, photo, services en icônes et liste « Pourquoi nous choisir ».',['affiche','portrait']],
  infographie:['rollup','Infographie','Qui sommes-nous, domaines d\'expertise, valeurs et pied de marque.',['affiche','rollup']],
  rollup_mission:['rollup','Roll-up mission','Logo et photo, grand nom, bandeau mission, objectifs, services et contacts.',['rollup','affiche']],
  recrutement:['recrut','Recrutement','Annonce de poste : titre sur bloc de couleur, missions, profil recherché, contact.',SQ.concat(['affiche'])],
  tech_sombre:['digital','Tech sombre','Fond sombre, titre dégradé, écran d\'ordinateur avec votre photo, cartes de services.',['affiche','portrait','rollup']],
  tech_bureau:['digital','Tech bureau','Fond bleuté, titre centré, écran d\'ordinateur, cartes en verre et chiffres.',['affiche','portrait']]
};
Object.entries(NEWT).forEach(([k,a])=>{TPLS[k]={cat:a[0],label:a[1],info:a[2]+(['affiche','invitation','rollup','recrut','digital'].includes(a[0])?' Contenu à saisir dans l\'onglet Texte, « Contenu détaillé ».':''),fmts:a[3],custom:1,tag:1,photos:a[4]||1}});
const tplOK=(t,f)=>!TPLS[t].fmts||TPLS[t].fmts.includes(f);
const CUSTOM={};
const FALLBACK={affiche:'affiche',rollup:'rollup_mission',story:'affiche',portrait:'affiche',post:'affiche',linkedin:'affiche',banniere:'affiche'};
const fixTpl=()=>{if(!tplOK(v.tpl,v.fmt))v.tpl=FALLBACK[v.fmt]||'affiche'};
const FONTS=[['auto','Selon la charte','']].concat(__FONTS__.map(f=>['AM_'+f.id,f.label,f.cat]));
const FILTERS={none:['Naturel',''],bw:['Noir et blanc','grayscale(1) contrast(1.1)'],sepia:['Sépia','sepia(.85)'],warm:['Chaud','sepia(.25) saturate(1.3) hue-rotate(-8deg)'],cool:['Froid','saturate(1.05) hue-rotate(14deg) brightness(.98)'],contrast:['Contrasté','contrast(1.25) saturate(1.1)'],fade:['Délavé','contrast(.85) brightness(1.1) saturate(.8)'],vivid:['Vif','saturate(1.6) contrast(1.08)']};
const DUOS={none:['Aucun'],brand:['Couleurs de la marque'],warm:['Chaud','#2B0F1E','#FFC48A'],cool:['Froid','#07203A','#9FE3F0'],mono:['Noir et crème','#0C0C0C','#F2EBDD'],neon:['Néon','#1A0B3D','#43F0D2']};
const EFFECTS=[['none','Aucun'],['shadow','Ombre douce'],['outline','Contour'],['glow','Halo'],['hard','Ombre dure']];
const TBOXES=[['none','Aucun'],['dark','Fond sombre'],['light','Fond clair'],['accent','Fond couleur d\'accent'],['glass','Verre']];
const TXT0={tFont:'auto',bFont:'auto',upper:'auto',tSize:1,sSize:1,lh:1,ls:0,tEffect:'none',accentBar:true};
const TXTSTYLES={
  classic:['Classique',{}],
  maj:['Majuscules',{upper:'upper',tSize:.9,ls:.04}],
  impact:['Impact',{upper:'upper',tSize:1.2,lh:.95,tEffect:'shadow',tFont:'AM_bigshoulders'}],
  discret:['Discret',{tSize:.78,lh:1.1,accentBar:false}],
  elegant:['Élégant',{tFont:'AM_young',bFont:'AM_outfit'}],
  moderne:['Moderne',{tFont:'AM_bricolage',bFont:'AM_instrument',tSize:1.05}],
  affiche:['Affiche',{tFont:'AM_poppins',bFont:'AM_inter',upper:'upper',tSize:.95,tEffect:'shadow'}],
  luxe:['Luxe',{tFont:'AM_italiana',bFont:'AM_outfit',upper:'upper',tSize:.85,ls:.12,accentBar:false}],
  cond:['Condensé',{tFont:'AM_smooch',bFont:'AM_inter',upper:'upper',tSize:1.3,lh:.92}],
  tech:['Tech',{tFont:'AM_tektur',bFont:'AM_jetbrains',tSize:.95,ls:.02}],
  main:['À la main',{tFont:'AM_nothing',bFont:'AM_work',tSize:1,accentBar:false}]
};
/* styles prêts : combinent modèle, ambiance photo et texte */
const PRESETS=[
  {name:'Vif et jeune',s:{tpl:'panneau',filter:'vivid',duo:'none',vig:0,tFont:'AM_poppins',bFont:'AM_inter',tEffect:'none',upper:'normal',tSize:.9}},
  {name:'Néon nocturne',s:{tpl:'lisere',filter:'contrast',duo:'neon',vig:.5,tFont:'AM_bigshoulders',upper:'upper',tEffect:'glow',tSize:1.1}},
  {name:'Annonce événement',s:{tpl:'encoches',filter:'none',duo:'none',vig:0,tFont:'AM_bigshoulders',upper:'upper',tEffect:'none',tSize:1.3,lh:.92}},
  {name:'Appli et services',s:{tpl:'cartecta',filter:'none',duo:'none',vig:0,tFont:'AM_bricolage',upper:'normal',tEffect:'none'}},
  {name:'Fintech courbe',s:{tpl:'courbe',filter:'none',duo:'none',vig:0,tFont:'AM_instrument',upper:'normal',tEffect:'none'}},
  {name:'Éditorial chic',s:{tpl:'magazine',filter:'bw',duo:'none',vig:.25,tFont:'AM_gloock',bFont:'AM_work',upper:'upper',ls:.06,tEffect:'none'}},
  {name:'Promo choc',s:{tpl:'offre',filter:'vivid',duo:'none',vig:.2,tFont:'AM_erica',bFont:'AM_outfit',upper:'upper',tEffect:'hard',tSize:1}},
  {name:'Duotone de marque',s:{tpl:'vague',filter:'none',duo:'brand',vig:.15,tFont:'AM_young',upper:'normal',tEffect:'none'}},
  {name:'Sobre et doux',s:{tpl:'cadre',filter:'fade',duo:'none',vig:0,tFont:'AM_lora',bFont:'AM_work',upper:'normal',tEffect:'none'}},
  {name:'Conseil du jour',s:{tpl:'conseil',filter:'none',duo:'none',vig:0,tFont:'AM_poppins',upper:'normal',tEffect:'none'}}
];
const PKEYS=['tpl','filter','duo','vig','wash','tFont','bFont','tSize','sSize','lh','ls','tWidth','upper','tColor','tEffect','tBox','accentBar','hl','align','ty','margin','footerPos','icons','accent','logoScale','plate','logoShape','logoTint','logoOpacity','logoMargin','shadow','logoRot','logoRad','logoGray','bright','contr','sat','blur','radius','ov','ovColor','ovAmount'];
const CAN_FILTER=(()=>{try{return'filter'in CanvasRenderingContext2D.prototype}catch(e){return false}})();
const DEFOPT=()=>({rm:false,tol:40,mode:'edge',bg:'#ffffff'});
const DEMO_TAGS='Idée, Action, Résultat';

let saved=[],current=null,chartes=[],presets=[];
const V0=()=>({fmt:'post',tpl:'affiche',title:'Notre nouvelle collection arrive',sub:'Disponible dès lundi, en boutique et en ligne',kicker:'',cta:'',badge:'',tags:'',slogan:'',org:'',person:'',date:'',time:'',place:'',secA:'',listA:'',secB:'',listB:'',body:'',foot:'',
  tFont:'auto',bFont:'auto',tSize:1,sSize:1,lh:1,ls:0,tWidth:1,upper:'auto',tColor:null,tEffect:'none',tBox:'none',accentBar:true,hl:true,
  align:'auto',ty:'auto',dx:0,dy:0,margin:1,footerPos:'auto',icons:true,accent:null,
  logoScale:1,plate:'light',logoShape:'round',logoTint:'orig',logoOpacity:1,logoMargin:1,logoFree:null,shadow:true,logoRot:0,logoRad:1,logoGray:false,
  zoom:1,fx:.5,fy:.5,flip:false,filter:'none',bright:0,contr:0,sat:0,blur:0,radius:.022,ov:'auto',ovColor:'brand',ovAmount:1,vig:0,duo:'none',wash:0,washColor:'accent'});
const v=Object.assign(V0(),{photo:null,photoSm:null,pf:{},drag:'photo',geom:null});
