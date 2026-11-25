# Atelier de Marque

Outil en un seul fichier HTML, sans connexion nécessaire :

- **Marque** : à partir d'un logo, génère une charte graphique (palette, polices, icônes) et enregistre plusieurs marques.
- **Visuel** : transforme une photo en visuels prêts à publier (post, portrait, story, LinkedIn, bannière, affiche, roll-up) avec 49 modèles, une composition libre, jusqu'à 4 photos par visuel, un détourage de personne dans le navigateur et un onglet « Éléments » (masquer, déplacer, redimensionner chaque élément).
- Export PNG, JPG ou ZIP de tous les formats.

## Fichiers

- `atelier-de-marque-hors-ligne.html` : l'outil complet, à ouvrir dans Chrome.
- `src/` : les sources. `python3 src/build.py` assemble tout et produit, dans `src/` :
  - `atelier-de-marque-hors-ligne.html` (livrable, à copier à la racine) ;
  - `atelier-de-marque.html` (version de test, avec le crochet `window.__atelier`) ;
  - `atelier-de-marque-artifact.html` (version à publier comme page Claude).
- `tests/` : à lancer après `python3 src/build.py` (Node + Playwright) :
  `node tests/cut.test.js` (détourage), `node tests/store.test.js` (marques enregistrées),
  `node tests/t5.js`, `t9.js`, `t10.js` (interface, détourage et éléments ; lancer depuis `tests/out/`), `node tests/t4.js ALL affiche` (rend tous les modèles).
