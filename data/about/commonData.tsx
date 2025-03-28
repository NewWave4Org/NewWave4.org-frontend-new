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
        imageSrc: `${prefix}/about/about-us-history-card.png`,
        title: '"Нова Українська Хвиля" – це Всеамериканське громадське об\'єднання, яке з 2006 року об’єднує українців у США, допомагаючи їм адаптуватися, зберігати національну ідентичність та підтримувати Україну.',
        items: [
          'Протягом свого становлення Організація стала важливим голосом громади, ініціювала законодавчі зміни, відкрила школу українознавства "Нова хвилька" та активно підтримує гуманітарні ініціативи',
          'З початком повномасштабного вторгнення РФ у 2022 році "Нова Українська Хвиля" створила Комітет допомоги Україні, зібравши понад пів мільйона доларів на гуманітарні та медичні потреби',
          'Сьогодні організація щороку проводить фестивалі в Брукліні, підтримує освітні та культурні ініціативи й продовжує допомагати українцям у США та за кордоном'
        ]
      }
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
