-- ============================================================
-- Legit — Seed Data
-- 5 realistic Belgian legislative measures with 3 slides each
-- Run: supabase db seed (or paste into SQL Editor)
-- ============================================================

-- Measure 1: Mobilité
INSERT INTO measures (id, chamber_doc_id, tag_id, title, status) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-000000000001', 'DOC-55-2847', 'mobilite', 'Réforme de la mobilité urbaine durable', 'processed');

INSERT INTO measure_slides (measure_id, slide_order, content_html, unsplash_image_url) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-000000000001', 1,
   'Les grandes villes belges font face à une <legit-gradient>congestion chronique</legit-gradient> qui coûte 8 milliards d''euros par an à l''économie. Le temps moyen passé dans les embouteillages à Bruxelles atteint 195 heures par an, soit le pire score d''Europe. La qualité de l''air dépasse régulièrement les <legit-gradient>seuils critiques</legit-gradient> de l''OMS.',
   'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=1200&fit=crop'),
  ('a1b2c3d4-e5f6-7890-abcd-000000000001', 2,
   'Ce projet de loi instaure des <legit-gradient>zones à faibles émissions</legit-gradient> élargies dans les 10 plus grandes communes et impose un quota de 40% de véhicules électriques dans les flottes d''entreprise d''ici 2030. Un fonds fédéral de 500 millions d''euros financera l''extension des <legit-gradient>pistes cyclables sécurisées</legit-gradient>.',
   'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=1200&fit=crop'),
  ('a1b2c3d4-e5f6-7890-abcd-000000000001', 3,
   'Réduction estimée de 30% des <legit-gradient>émissions de CO₂</legit-gradient> liées aux transports d''ici 2032. Création de 15 000 emplois dans le secteur de la mobilité verte. Les navetteurs devraient économiser en moyenne 45 minutes par jour grâce au <legit-gradient>réseau intermodal</legit-gradient> intégré.',
   'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop');

-- Measure 2: Fiscalité
INSERT INTO measures (id, chamber_doc_id, tag_id, title, status) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-000000000002', 'DOC-55-3102', 'fiscalite', 'Réforme de la taxation des plus-values mobilières', 'processed');

INSERT INTO measure_slides (measure_id, slide_order, content_html, unsplash_image_url) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-000000000002', 1,
   'La Belgique est l''un des derniers pays européens à ne pas taxer les <legit-gradient>plus-values sur actions</legit-gradient>. Cette exception profite essentiellement aux 5% les plus fortunés, creusant un écart fiscal estimé à 2,3 milliards d''euros par an, selon la <legit-gradient>Cour des comptes</legit-gradient>.',
   'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=1200&fit=crop'),
  ('a1b2c3d4-e5f6-7890-abcd-000000000002', 2,
   'La proposition instaure une <legit-gradient>taxe de 15%</legit-gradient> sur les plus-values mobilières dépassant 10 000 euros par an, avec exonération totale de la résidence principale et des plans d''épargne-pension. Un mécanisme de <legit-gradient>lissage triennal</legit-gradient> permet de répartir les gains exceptionnels sur 3 ans.',
   'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=1200&fit=crop'),
  ('a1b2c3d4-e5f6-7890-abcd-000000000002', 3,
   'Recettes estimées de 1,8 milliard d''euros par an, fléchées vers le renforcement de la <legit-gradient>sécurité sociale</legit-gradient>. 97% des citoyens ne seront pas impactés. Les associations patronales craignent cependant un potentiel <legit-gradient>exode fiscal</legit-gradient> vers le Luxembourg.',
   'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=1200&fit=crop');

-- Measure 3: Santé
INSERT INTO measures (id, chamber_doc_id, tag_id, title, status) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-000000000003', 'DOC-55-2956', 'sante', 'Plan national de santé mentale des jeunes', 'processed');

INSERT INTO measure_slides (measure_id, slide_order, content_html, unsplash_image_url) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-000000000003', 1,
   'Depuis 2020, les consultations psychiatriques chez les 12-25 ans ont augmenté de 68%. Un jeune sur quatre déclare souffrir d''<legit-gradient>anxiété chronique</legit-gradient>. Les listes d''attente pour un suivi psychologique dépassent 9 mois dans plusieurs provinces, créant un véritable <legit-gradient>désert thérapeutique</legit-gradient>.',
   'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=1200&fit=crop'),
  ('a1b2c3d4-e5f6-7890-abcd-000000000003', 2,
   'Ce plan prévoit le remboursement intégral de 10 séances de <legit-gradient>psychothérapie par an</legit-gradient> pour les moins de 25 ans, la création de 200 postes de psychologues scolaires, et le lancement d''une plateforme numérique de premiers secours en <legit-gradient>santé mentale</legit-gradient> accessible 24h/24.',
   'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=1200&fit=crop'),
  ('a1b2c3d4-e5f6-7890-abcd-000000000003', 3,
   'Budget prévu : 350 millions d''euros sur 4 ans. Objectif : réduire les <legit-gradient>tentatives de suicide</legit-gradient> de 25% d''ici 2030 chez les jeunes. Les mutuelles estiment que chaque euro investi en prévention en économise 4 en soins curatifs. Le plan inclut aussi la formation de 5 000 <legit-gradient>sentinelles</legit-gradient> en milieu scolaire.',
   'https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?w=800&h=1200&fit=crop');

-- Measure 4: Environnement
INSERT INTO measures (id, chamber_doc_id, tag_id, title, status) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-000000000004', 'DOC-55-3201', 'environnement', 'Interdiction des PFAS dans les produits de consommation', 'processed');

INSERT INTO measure_slides (measure_id, slide_order, content_html, unsplash_image_url) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-000000000004', 1,
   'Les <legit-gradient>PFAS</legit-gradient> (substances per- et polyfluoroalkylées), surnommés « polluants éternels », contaminent les nappes phréatiques de 3 provinces belges. À Zwijndrecht, les taux sanguins de la population dépassent de 8 fois les <legit-gradient>normes européennes</legit-gradient>. Ces substances sont liées à des cancers et troubles endocriniens.',
   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1200&fit=crop'),
  ('a1b2c3d4-e5f6-7890-abcd-000000000004', 2,
   'Ce texte impose l''interdiction progressive des PFAS dans les emballages alimentaires (2027), les cosmétiques (2028) et les textiles (2029). Il crée un <legit-gradient>fonds de dépollution</legit-gradient> de 200 millions d''euros financé par le principe pollueur-payeur. Les industriels disposent de <legit-gradient>délais de transition</legit-gradient> de 18 à 36 mois.',
   'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&h=1200&fit=crop'),
  ('a1b2c3d4-e5f6-7890-abcd-000000000004', 3,
   'Impact attendu : élimination de 85% des <legit-gradient>sources de contamination</legit-gradient> domestiques d''ici 2031. L''industrie chimique prévient de possibles pertes d''emplois (environ 2 000 postes). Mais les coûts sanitaires évités sont estimés à 1,2 milliard d''euros selon l''<legit-gradient>Agence européenne de l''environnement</legit-gradient>.',
   'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=1200&fit=crop');

-- Measure 5: Éducation
INSERT INTO measures (id, chamber_doc_id, tag_id, title, status) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-000000000005', 'DOC-55-3089', 'education', 'Obligation du cours de citoyenneté numérique', 'processed');

INSERT INTO measure_slides (measure_id, slide_order, content_html, unsplash_image_url) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-000000000005', 1,
   '72% des adolescents belges ne savent pas identifier une <legit-gradient>fausse information</legit-gradient> en ligne. Le cyberharcèlement touche 1 élève sur 5 en secondaire. Malgré l''omniprésence du numérique, aucun cursus obligatoire n''enseigne la <legit-gradient>pensée critique digitale</legit-gradient> dans les écoles francophones.',
   'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=1200&fit=crop'),
  ('a1b2c3d4-e5f6-7890-abcd-000000000005', 2,
   'Ce projet de loi rend obligatoire un cours de <legit-gradient>citoyenneté numérique</legit-gradient> d''1 heure par semaine dès la 5ème primaire. Le programme couvre : fact-checking, protection des données personnelles, intelligence artificielle et éthique en ligne. 2 000 enseignants seront formés via un <legit-gradient>certificat universitaire</legit-gradient> dédié.',
   'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=1200&fit=crop'),
  ('a1b2c3d4-e5f6-7890-abcd-000000000005', 3,
   'Budget : 85 millions d''euros sur 5 ans. Objectif : faire de la Belgique un modèle européen en <legit-gradient>littératie numérique</legit-gradient>. Les études finlandaises montrent qu''un programme similaire a réduit la propagation de désinformation de 40% chez les jeunes. Le cours intègre aussi des exercices pratiques de <legit-gradient>participation démocratique</legit-gradient> en ligne.',
   'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=1200&fit=crop');
