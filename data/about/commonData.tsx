import { prefix } from '@/utils/prefix';

const commonData = {
  uk: {
    detailed_text_information: {
      top: [
        "Всеамериканська громадська організація",
        "«Нова Українська Хвиля» — ",
        "національно-патріотична та освітньо-культурна спільнота, що",
        "об'єднує вихідців з України, передусім представників",
        "4-ї хвилі еміграції."
      ],
      bottom: [
        "Ми працюємо над збереженням української культури, традицій та",
        "національної ідентичності, сприяємо",
        "єднанню української громади та підтримуємо розвиток",
        "української освіти й громадської активності"
      ]
    },
    history_card: {
      title: 'Наша історія',
      card: {
        carousel: [
          `${prefix}/about/about-us-history-card.png`,
          `${prefix}/about/about-us-history-card.png`,
          `${prefix}/about/about-us-history-card.png`,
          `${prefix}/about/about-us-history-card.png`,
          `${prefix}/about/about-us-history-card.png`,
          `${prefix}/about/about-us-history-card.png`,
          `${prefix}/about/about-us-history-card.png`,
        ],
        title: '"Нова Українська Хвиля" – це Всеамериканське громадське об\'єднання, яке з 2006 року об’єднує українців у США, допомагаючи їм адаптуватися, зберігати національну ідентичність та підтримувати Україну.',
        items: [
          'Протягом свого становлення Організація стала важливим голосом громади, ініціювала законодавчі зміни, відкрила школу українознавства "Нова хвилька" та активно підтримує гуманітарні ініціативи',
          'З початком повномасштабного вторгнення РФ у 2022 році "Нова Українська Хвиля" створила Комітет допомоги Україні, зібравши понад пів мільйона доларів на гуманітарні та медичні потреби',
          'Сьогодні організація щороку проводить фестивалі в Брукліні, підтримує освітні та культурні ініціативи й продовжує допомагати українцям у США та за кордоном'
        ]
      }
    },
    history_formation: {
      title: 'Історія становлення',
      timeline: [
        {
          date: '2006',
          title: 'Початок',
          text: 'Перше зібрання представників, початок створення організації'
        },
        {
          date: '2007',
          title: 'Презентація',
          text: 'Презентація організації "Нова Українська Хвиля" в Нью-Йорку'
        },
        {
          date: '2008',
          title: 'Світовий Конгрес',
          text: 'Організація стала членом Світового Конгресу Українців'
        },
        {
          date: '2010',
          title: 'Проєкт до ВР',
          text: 'Представлення проєкту до Верховної Ради України щодо виборчих прав'
        },
        {
          date: '2016',
          title: '“Нова Хвилька”',
          text: 'Заснування школи українознавства "Нова хвилька" у Брукліні, Нью-Йорк'
        },
        {
          date: '2022',
          title: 'Комітет допомоги',
          text: 'Створення Комітету допомоги Україні, організація табору для дітей-біженців'
        }
      ]
      
    }
  },
  en: {
    detailed_text_information:  {
      top: ["The All-American public organization «New Ukrainian Wave» is a national-patriotic and educational-cultural community that unites people from Ukraine, primarily representatives of the 4th wave of emigration."],
      bottom: ["We work to preserve Ukrainian culture, traditions, and national identity, promote the unity of the Ukrainian community, and support the development of Ukrainian education and civic activism"]
    },
  }
};

export { commonData };
