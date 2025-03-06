import { prefix } from '@/utils/prefix';

const teamData = {
  uk: {
    title: "Наша команда",
    team: [
      {
        name: "Myroslava Rozdolska",
        img: `${prefix}/team/myroslava-rozdolska.png`,
        position: "President",
        location: "Staten Island, NY",
      },
      {
        name: "Bohdan Dohonok",
        img: `${prefix}/team/bohdan-dohonok.png`,
        position: "Vice President",
        location: "Pittsburgh, PA",
      },
      {
        name: "Lesya Zlupko",
        img: `${prefix}/team/lesya-zlupko.png`,
        position: "Vice President",
        location: "Brooklyn, NY",
      },
      {
        name: "Olga Hrynyk",
        img: `${prefix}/team/olga-hrynyk.png`,
        position: "Head of Brooklyn Department",
        location: "Brooklyn, NY",
      },
      {
        name: "Ostap Stakhiv",
        img: `${prefix}/team/ostap-stakhiv.png`,
        position: "Director of Culture Program",
        location: "Cleveland, OH",
      },
    ]
  },
  en: {
    title: "Our team",
  }
};

export { teamData };
