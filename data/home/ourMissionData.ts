import { prefix } from '@/utils/prefix';

const ourMissionData = {
  uk: {
    title: 'Наша місія',
    items: [
      {
        icon: `${prefix}/icons/wheat.svg`,
        title: 'Збереження української культури в США',
        description: 'збереження української ідентичності у багатокультурному середовищі США'
      },
      {
        icon: `${prefix}/icons/peace-bird.svg`,
        title: 'Гуманітарна допомога та підтримка України',
        description: 'відправляємо гуманітарну допомогу для військових та постраждалих від війни'
      },
      {
        icon: `${prefix}/icons/coat-of-arms.svg`,
        title: 'Міжнародна адвокація українських інтересів',
        description: 'зміцнення української діаспори з фокусом на майбутнє України'
      }
    ]
  }
};

export { ourMissionData };
