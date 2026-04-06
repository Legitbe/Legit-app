// ============================================================
// Legit — Mock Data
// Realistic Belgian legislative measures for development/demo.
// This replaces Supabase queries until the backend is connected.
// ============================================================

import { MeasureWithSlides, MeasureVoteSummary } from '@/types/database';

const mockVoteSummaries: Record<string, MeasureVoteSummary> = {
  'measure-1': {
    measure_id: 'measure-1',
    total_votes: 1247,
    average_score: 3.8,
    positive_votes: 687,
    negative_votes: 198,
    neutral_votes: 362,
  },
  'measure-2': {
    measure_id: 'measure-2',
    total_votes: 892,
    average_score: 2.4,
    positive_votes: 201,
    negative_votes: 489,
    neutral_votes: 202,
  },
  'measure-3': {
    measure_id: 'measure-3',
    total_votes: 2103,
    average_score: 4.2,
    positive_votes: 1456,
    negative_votes: 187,
    neutral_votes: 460,
  },
  'measure-4': {
    measure_id: 'measure-4',
    total_votes: 634,
    average_score: 3.1,
    positive_votes: 245,
    negative_votes: 189,
    neutral_votes: 200,
  },
  'measure-5': {
    measure_id: 'measure-5',
    total_votes: 1567,
    average_score: 4.5,
    positive_votes: 1201,
    negative_votes: 89,
    neutral_votes: 277,
  },
};

export const MOCK_MEASURES: MeasureWithSlides[] = [
  {
    id: 'measure-1',
    chamber_doc_id: 'DOC-55-2847',
    tag_id: 'mobilite',
    title: 'Réforme de la mobilité urbaine durable',
    raw_text: null,
    status: 'processed',
    created_at: '2026-03-15T10:00:00Z',
    vote_summary: mockVoteSummaries['measure-1'],
    measure_slides: [
      {
        id: 'slide-1-1',
        measure_id: 'measure-1',
        slide_order: 1,
        content_html:
          'Les grandes villes belges font face à une <legit-gradient>congestion chronique</legit-gradient> qui coûte 8 milliards d\'euros par an à l\'économie. Le temps moyen passé dans les embouteillages à Bruxelles atteint 195 heures par an, soit le pire score d\'Europe. La qualité de l\'air dépasse régulièrement les <legit-gradient>seuils critiques</legit-gradient> de l\'OMS.',
        unsplash_image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=1200&fit=crop',
        created_at: '2026-03-15T10:00:00Z',
      },
      {
        id: 'slide-1-2',
        measure_id: 'measure-1',
        slide_order: 2,
        content_html:
          'Ce projet de loi instaure des <legit-gradient>zones à faibles émissions</legit-gradient> élargies dans les 10 plus grandes communes et impose un quota de 40% de véhicules électriques dans les flottes d\'entreprise d\'ici 2030. Un fonds fédéral de 500 millions d\'euros financera l\'extension des <legit-gradient>pistes cyclables sécurisées</legit-gradient>.',
        unsplash_image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=1200&fit=crop',
        created_at: '2026-03-15T10:00:00Z',
      },
      {
        id: 'slide-1-3',
        measure_id: 'measure-1',
        slide_order: 3,
        content_html:
          'Réduction estimée de 30% des <legit-gradient>émissions de CO₂</legit-gradient> liées aux transports d\'ici 2032. Création de 15 000 emplois dans le secteur de la mobilité verte. Les navetteurs devraient économiser en moyenne 45 minutes par jour grâce au <legit-gradient>réseau intermodal</legit-gradient> intégré.',
        unsplash_image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop',
        created_at: '2026-03-15T10:00:00Z',
      },
    ],
  },
  {
    id: 'measure-2',
    chamber_doc_id: 'DOC-55-3102',
    tag_id: 'fiscalite',
    title: 'Réforme de la taxation des plus-values mobilières',
    raw_text: null,
    status: 'processed',
    created_at: '2026-03-18T14:00:00Z',
    vote_summary: mockVoteSummaries['measure-2'],
    measure_slides: [
      {
        id: 'slide-2-1',
        measure_id: 'measure-2',
        slide_order: 1,
        content_html:
          'La Belgique est l\'un des derniers pays européens à ne pas taxer les <legit-gradient>plus-values sur actions</legit-gradient>. Cette exception profite essentiellement aux 5% les plus fortunés, creusant un écart fiscal estimé à 2,3 milliards d\'euros par an, selon la <legit-gradient>Cour des comptes</legit-gradient>.',
        unsplash_image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=1200&fit=crop',
        created_at: '2026-03-18T14:00:00Z',
      },
      {
        id: 'slide-2-2',
        measure_id: 'measure-2',
        slide_order: 2,
        content_html:
          'La proposition instaure une <legit-gradient>taxe de 15%</legit-gradient> sur les plus-values mobilières dépassant 10 000 euros par an, avec exonération totale de la résidence principale et des plans d\'épargne-pension. Un mécanisme de <legit-gradient>lissage triennal</legit-gradient> permet de répartir les gains exceptionnels sur 3 ans.',
        unsplash_image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=1200&fit=crop',
        created_at: '2026-03-18T14:00:00Z',
      },
      {
        id: 'slide-2-3',
        measure_id: 'measure-2',
        slide_order: 3,
        content_html:
          'Recettes estimées de 1,8 milliard d\'euros par an, fléchées vers le renforcement de la <legit-gradient>sécurité sociale</legit-gradient>. 97% des citoyens ne seront pas impactés. Les associations patronales craignent cependant un potentiel <legit-gradient>exode fiscal</legit-gradient> vers le Luxembourg.',
        unsplash_image_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=1200&fit=crop',
        created_at: '2026-03-18T14:00:00Z',
      },
    ],
  },
  {
    id: 'measure-3',
    chamber_doc_id: 'DOC-55-2956',
    tag_id: 'sante',
    title: 'Plan national de santé mentale des jeunes',
    raw_text: null,
    status: 'processed',
    created_at: '2026-03-20T09:00:00Z',
    vote_summary: mockVoteSummaries['measure-3'],
    measure_slides: [
      {
        id: 'slide-3-1',
        measure_id: 'measure-3',
        slide_order: 1,
        content_html:
          'Depuis 2020, les consultations psychiatriques chez les 12-25 ans ont augmenté de 68%. Un jeune sur quatre déclare souffrir d\'<legit-gradient>anxiété chronique</legit-gradient>. Les listes d\'attente pour un suivi psychologique dépassent 9 mois dans plusieurs provinces, créant un véritable <legit-gradient>désert thérapeutique</legit-gradient>.',
        unsplash_image_url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=1200&fit=crop',
        created_at: '2026-03-20T09:00:00Z',
      },
      {
        id: 'slide-3-2',
        measure_id: 'measure-3',
        slide_order: 2,
        content_html:
          'Ce plan prévoit le remboursement intégral de 10 séances de <legit-gradient>psychothérapie par an</legit-gradient> pour les moins de 25 ans, la création de 200 postes de psychologues scolaires, et le lancement d\'une plateforme numérique de premiers secours en <legit-gradient>santé mentale</legit-gradient> accessible 24h/24.',
        unsplash_image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=1200&fit=crop',
        created_at: '2026-03-20T09:00:00Z',
      },
      {
        id: 'slide-3-3',
        measure_id: 'measure-3',
        slide_order: 3,
        content_html:
          'Budget prévu : 350 millions d\'euros sur 4 ans. Objectif : réduire les <legit-gradient>tentatives de suicide</legit-gradient> de 25% d\'ici 2030 chez les jeunes. Les mutuelles estiment que chaque euro investi en prévention en économise 4 en soins curatifs. Le plan inclut aussi la formation de 5 000 <legit-gradient>sentinelles</legit-gradient> en milieu scolaire.',
        unsplash_image_url: 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?w=800&h=1200&fit=crop',
        created_at: '2026-03-20T09:00:00Z',
      },
    ],
  },
  {
    id: 'measure-4',
    chamber_doc_id: 'DOC-55-3201',
    tag_id: 'environnement',
    title: 'Interdiction des PFAS dans les produits de consommation',
    raw_text: null,
    status: 'processed',
    created_at: '2026-03-25T11:00:00Z',
    vote_summary: mockVoteSummaries['measure-4'],
    measure_slides: [
      {
        id: 'slide-4-1',
        measure_id: 'measure-4',
        slide_order: 1,
        content_html:
          'Les <legit-gradient>PFAS</legit-gradient> (substances per- et polyfluoroalkylées), surnommés « polluants éternels », contaminent les nappes phréatiques de 3 provinces belges. À Zwijndrecht, les taux sanguins de la population dépassent de 8 fois les <legit-gradient>normes européennes</legit-gradient>. Ces substances sont liées à des cancers et troubles endocriniens.',
        unsplash_image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1200&fit=crop',
        created_at: '2026-03-25T11:00:00Z',
      },
      {
        id: 'slide-4-2',
        measure_id: 'measure-4',
        slide_order: 2,
        content_html:
          'Ce texte impose l\'interdiction progressive des PFAS dans les emballages alimentaires (2027), les cosmétiques (2028) et les textiles (2029). Il crée un <legit-gradient>fonds de dépollution</legit-gradient> de 200 millions d\'euros financé par le principe pollueur-payeur. Les industriels disposent de <legit-gradient>délais de transition</legit-gradient> de 18 à 36 mois.',
        unsplash_image_url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&h=1200&fit=crop',
        created_at: '2026-03-25T11:00:00Z',
      },
      {
        id: 'slide-4-3',
        measure_id: 'measure-4',
        slide_order: 3,
        content_html:
          'Impact attendu : élimination de 85% des <legit-gradient>sources de contamination</legit-gradient> domestiques d\'ici 2031. L\'industrie chimique prévient de possibles pertes d\'emplois (environ 2 000 postes). Mais les coûts sanitaires évités sont estimés à 1,2 milliard d\'euros selon l\'<legit-gradient>Agence européenne de l\'environnement</legit-gradient>.',
        unsplash_image_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=1200&fit=crop',
        created_at: '2026-03-25T11:00:00Z',
      },
    ],
  },
  {
    id: 'measure-5',
    chamber_doc_id: 'DOC-55-3089',
    tag_id: 'education',
    title: 'Obligation du cours de citoyenneté numérique',
    raw_text: null,
    status: 'processed',
    created_at: '2026-03-28T16:00:00Z',
    vote_summary: mockVoteSummaries['measure-5'],
    measure_slides: [
      {
        id: 'slide-5-1',
        measure_id: 'measure-5',
        slide_order: 1,
        content_html:
          '72% des adolescents belges ne savent pas identifier une <legit-gradient>fausse information</legit-gradient> en ligne. Le cyberharcèlement touche 1 élève sur 5 en secondaire. Malgré l\'omniprésence du numérique, aucun cursus obligatoire n\'enseigne la <legit-gradient>pensée critique digitale</legit-gradient> dans les écoles francophones.',
        unsplash_image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=1200&fit=crop',
        created_at: '2026-03-28T16:00:00Z',
      },
      {
        id: 'slide-5-2',
        measure_id: 'measure-5',
        slide_order: 2,
        content_html:
          'Ce projet de loi rend obligatoire un cours de <legit-gradient>citoyenneté numérique</legit-gradient> d\'1 heure par semaine dès la 5ème primaire. Le programme couvre : fact-checking, protection des données personnelles, intelligence artificielle et éthique en ligne. 2 000 enseignants seront formés via un <legit-gradient>certificat universitaire</legit-gradient> dédié.',
        unsplash_image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=1200&fit=crop',
        created_at: '2026-03-28T16:00:00Z',
      },
      {
        id: 'slide-5-3',
        measure_id: 'measure-5',
        slide_order: 3,
        content_html:
          'Budget : 85 millions d\'euros sur 5 ans. Objectif : faire de la Belgique un modèle européen en <legit-gradient>littératie numérique</legit-gradient>. Les études finlandaises montrent qu\'un programme similaire a réduit la propagation de désinformation de 40% chez les jeunes. Le cours intègre aussi des exercices pratiques de <legit-gradient>participation démocratique</legit-gradient> en ligne.',
        unsplash_image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=1200&fit=crop',
        created_at: '2026-03-28T16:00:00Z',
      },
    ],
  },
];

/** In-memory vote store for mock mode */
const mockVoteStore: Record<string, Record<string, number>> = {};

/**
 * Get all measures with slides and vote summaries (mock).
 */
export async function getMockMeasures(): Promise<MeasureWithSlides[]> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_MEASURES;
}

/**
 * Submit a vote in mock mode (in-memory).
 * Uses UPSERT logic: one device = one vote per measure.
 */
export async function submitMockVote(
  measureId: string,
  deviceFingerprint: string,
  voteValue: number
): Promise<{ success: boolean }> {
  await new Promise((r) => setTimeout(r, 200));

  if (!mockVoteStore[measureId]) {
    mockVoteStore[measureId] = {};
  }
  mockVoteStore[measureId][deviceFingerprint] = voteValue;

  return { success: true };
}

/**
 * Get a user's existing vote for a measure (mock).
 */
export function getMockUserVote(measureId: string, deviceFingerprint: string): number | null {
  return mockVoteStore[measureId]?.[deviceFingerprint] ?? null;
}
