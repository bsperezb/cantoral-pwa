/**
 * Plantillas predefinidas para crear Repertorios.
 * Cada momento acepta 1..N cantos en orden libre.
 */
export const TEMPLATES = {
  mass: {
    id: 'mass',
    name: 'Misa',
    description: '10 momentos de la celebración eucarística',
    icon: 'church',
    moments: [
      'Entrada',
      'Piedad',
      'Gloria',
      'Salmo',
      'Aleluya',
      'Ofertorio',
      'Santo',
      'Cordero',
      'Comunión',
      'Salida',
    ],
  },
  adoration: {
    id: 'adoration',
    name: 'Adoración',
    description: 'Hora Santa: Exposición → Reserva',
    icon: 'flame',
    moments: ['Exposición', 'Adoración', 'Bendición', 'Reserva'],
  },
  blank: {
    id: 'blank',
    name: 'En blanco',
    description: 'Crea momentos a tu medida',
    icon: 'square-pen',
    moments: [],
  },
};

export const TEMPLATE_LIST = Object.values(TEMPLATES);

export function getTemplate(id) {
  return TEMPLATES[id] ?? TEMPLATES.blank;
}
