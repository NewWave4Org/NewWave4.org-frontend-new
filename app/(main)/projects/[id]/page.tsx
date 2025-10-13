// app/page.tsx
import Image from "next/image";
import { siteContent } from "@/utils/constants/programobject";
import Hero from "@/components/ui/Hero";
import { prefix } from "@/utils/prefix";

export default function HomePage() {
  const { hero, congress, nato, gallery, priorities, program, video, morePrograms } = siteContent;

  const heroData = {
    uk: {
      title: hero.title,
      img: `${prefix}/hero/about.svg`,
    },
    en: {
      title: "About us",
      img: `${prefix}/hero/about.svg`,
    }
  };

  return (
    <main className="font-sans text-gray-800">
      {/* Hero Section */}
      <Hero data={heroData} baseClassname="flex justify-start !items-end !p-[100px]" />

      {/* Congress Section */}
      <section className="py-12 px-6 md:px-16 bg-yellow-50">
        <p className="text-sm text-gray-600">{congress.date}</p>
        <h2 className="text-2xl font-semibold mt-2">{congress.title}</h2>
        <p className="mt-4 text-gray-700">{congress.description}</p>
        <button className="mt-4 bg-yellow-500 text-white px-5 py-2 rounded-md hover:bg-yellow-600">
          {congress.button.text}
        </button>
      </section>

      {/* NATO Section */}
      <section className="py-16 px-6 md:px-16 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4">{nato.title}</h3>
          <p className="text-gray-700 leading-relaxed">{nato.text}</p>
        </div>
        <div className="flex-1">
          <Image src={nato.image} alt="NATO meeting" width={600} height={400} className="rounded-lg shadow" />
        </div>
      </section>

      {/* Priorities Section */}
      <section className="bg-gray-50 py-12 px-6 md:px-16">
        <h3 className="text-2xl font-semibold mb-6">{priorities.title}</h3>
        <ul className="grid md:grid-cols-2 gap-4 list-disc list-inside">
          {priorities.goals.map((goal, i) => (
            <li key={i}>{goal}</li>
          ))}
        </ul>
      </section>

      {/* Program Section */}
      <section className="py-16 px-6 md:px-16 bg-white flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <Image src={program.image} alt="Program flag" width={600} height={400} className="rounded-lg shadow" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4">{program.title}</h3>
          {program.events.map((event, i) => (
            <div key={i} className="mb-6">
              <h4 className="font-bold text-lg text-blue-700">{event.date}</h4>
              <ul className="mt-2 text-gray-700">
                {event.schedule.map((item, j) => (
                  <li key={j} className="text-sm">
                    {item.time} — {item.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-gray-100 flex justify-center items-center">
        <div className="w-[80%] h-[400px] bg-gray-300 flex justify-center items-center text-xl text-gray-600">
          ВІДЕО
        </div>
      </section>

      {/* More Programs */}
      <section className="py-12 px-6 md:px-16 bg-yellow-50">
        <h3 className="text-2xl font-semibold mb-6">Інші програми</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {morePrograms.map((p, i) => (
            <div key={i} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              <Image src={p.image} alt={p.title} width={400} height={250} className="rounded-t-lg" />
              <div className="p-4">
                <p className="text-xs text-gray-500">{p.date}</p>
                <h4 className="font-semibold mt-2">{p.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p>Будьте в курсі наших новин та подій</p>
        <div className="mt-4">
          <input
            type="email"
            placeholder="Введіть Ваш email"
            className="px-3 py-2 rounded-l-md text-black"
          />
          <button className="bg-yellow-500 px-4 py-2 rounded-r-md hover:bg-yellow-600">
            Підписатись
          </button>
        </div>
      </footer>
    </main>
  );
}
