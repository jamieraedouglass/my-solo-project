// client/pages/Diseases.ts

export type Disease = {
  name: string;
  symptoms: string[];
};

const DISEASES: Disease[] = [
  {
    name: 'Ebola virus disease',
    symptoms: ['High fever', 'Severe headache', 'Vomiting/diarrhea'],
  },
  {
    name: 'Marburg virus disease',
    symptoms: ['Sudden fever', 'Severe malaise', 'Vomiting/diarrhea'],
  },
  {
    name: 'Lassa fever',
    symptoms: ['Fever', 'Weakness/malaise', 'Sore throat or chest pain'],
  },
  {
    name: 'Nipah virus infection',
    symptoms: ['Fever', 'Headache', 'Confusion/encephalitis'],
  },
  {
    name: 'Hantavirus pulmonary syndrome',
    symptoms: [
      'Fever',
      'Muscle aches',
      'Rapidly worsening shortness of breath',
    ],
  },
  {
    name: 'Rabies (encephalitic form)',
    symptoms: [
      'Fever',
      'Tingling at bite site',
      'Hydrophobia/difficulty swallowing',
    ],
  },
  {
    name: 'Plague (bubonic)',
    symptoms: ['Painful swollen lymph nodes (buboes)', 'Fever', 'Chills'],
  },
  {
    name: 'Tularemia (ulceroglandular)',
    symptoms: [
      'Skin ulcer at bite/contact site',
      'Swollen lymph nodes',
      'Fever',
    ],
  },
  {
    name: 'Anthrax (inhalational)',
    symptoms: ['Fever', 'Cough', 'Chest discomfort'],
  },
  {
    name: 'Botulism (foodborne)',
    symptoms: [
      'Blurred/double vision',
      'Drooping eyelids',
      'Difficulty swallowing',
    ],
  },
  {
    name: 'Diphtheria',
    symptoms: ['Sore throat', 'Low-grade fever', 'Gray throat pseudomembrane'],
  },
  {
    name: 'Tetanus',
    symptoms: [
      'Jaw stiffness (trismus)',
      'Painful muscle spasms',
      'Difficulty swallowing',
    ],
  },
  {
    name: 'Creutzfeldt–Jakob disease',
    symptoms: ['Rapidly progressive dementia', 'Myoclonus', 'Ataxia'],
  },
  {
    name: 'Primary amebic meningoencephalitis (Naegleria fowleri)',
    symptoms: ['Severe headache', 'Fever', 'Stiff neck'],
  },
  {
    name: 'Acanthamoeba keratitis',
    symptoms: ['Eye pain', 'Redness', 'Blurred vision'],
  },
  {
    name: 'Crimean–Congo hemorrhagic fever',
    symptoms: ['Fever', 'Muscle aches', 'Bleeding tendency'],
  },
  {
    name: 'Rift Valley fever (severe)',
    symptoms: ['Fever', 'Headache', 'Eye pain/photophobia'],
  },
  {
    name: 'Brucellosis',
    symptoms: ['Undulating fever', 'Night sweats', 'Joint pain'],
  },
  {
    name: 'Melioidosis',
    symptoms: ['Fever', 'Cough or localized abscesses', 'Weight loss'],
  },
  {
    name: 'Leptospirosis',
    symptoms: ['High fever', 'Severe headache', 'Muscle pain (calves)'],
  },
  {
    name: 'Hendra virus disease',
    symptoms: ['Fever', 'Cough/shortness of breath', 'Confusion/encephalitis'],
  },
  {
    name: 'MERS-CoV infection',
    symptoms: ['Fever', 'Cough', 'Shortness of breath'],
  },
  {
    name: 'Avian influenza A(H5N1)',
    symptoms: ['High fever', 'Cough', 'Shortness of breath'],
  },
  {
    name: 'Q fever (acute)',
    symptoms: ['High fever', 'Severe headache', 'Dry cough'],
  },
  {
    name: 'Visceral leishmaniasis (kala-azar)',
    symptoms: ['Prolonged fever', 'Weight loss', 'Enlarged spleen'],
  },
];

export default DISEASES;
