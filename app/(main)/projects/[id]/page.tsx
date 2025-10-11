import Hero from "@/components/ui/Hero";
import { heroData } from "@/data/projects/hero";
import { ArticleStatusEnum, ArticleTypeEnum } from "@/utils/ArticleType";
import { programObject } from "@/utils/constants/programobject";
import { ApiEndpoint } from "@/utils/http/enums/api-endpoint";

export default function ProgramPagebyId() {
  const {
    title,
    description,
    cta,
    highlights,
    schedule,
    video,
    otherPrograms,
  } = programObject;

  const baseUrl = `https://api.stage.newwave4.org/api/v1/${ApiEndpoint.GET_ARTICLE_CONTENT_ALL}`;
  const params = {
    currentPage: '1',
    articleType: ArticleTypeEnum.PROJECT.toString(),
    articleStatus: ArticleStatusEnum.PUBLISHED,
  };

  return (
    <div className="p-6 space-y-10">
      {/* Title + CTA */}
      <Hero baseClassname="!flex !justify-start !items-end !p-[100px]" data={heroData} />
      <header className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-blue-900">{title}</h1>
        <p className="text-gray-700 max-w-2xl mx-auto">{description}</p>
        <div className="flex justify-center gap-4 mt-4">
          <button className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800">
            {cta.donateLabel}
          </button>
          <span className="text-gray-600 font-medium">{cta.dateRange}</span>
        </div>
      </header>

      {/* Highlights */}
      <section className="space-y-6">
        {highlights.map((h, idx) => (
          <div
            key={idx}
            className="bg-white shadow rounded-lg p-6 space-y-3 border"
          >
            <h2 className="text-xl font-semibold text-gray-800">{h.heading}</h2>
            {"text" in h && <p className="text-gray-700">{h.text}</p>}
            {"list" in h && (
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {h.list?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      {/* Schedule */}
      <section>
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Програма заходів</h2>
        <div className="space-y-6">
          {schedule.map((day, idx) => (
            <div key={idx} className="bg-white shadow rounded-lg p-6 border">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {day.date}
              </h3>
              <ul className="space-y-2">
                {day.events.map((event, eIdx) => (
                  <li key={eIdx} className="flex justify-between text-gray-700">
                    <span>
                      <span className="font-medium">{event.time}</span> —{" "}
                      {event.title}
                    </span>
                    {event.location && (
                      <span className="italic text-gray-500">
                        {event.location}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Video */}
      <section>
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Відео</h2>
        <div className="aspect-video w-full max-w-3xl mx-auto">
          <iframe
            className="w-full h-full rounded-lg shadow"
            src={video.url}
            title="Program video"
            allowFullScreen
          />
        </div>
      </section>

      {/* Other programs */}
      <section>
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">
          Інші ПРОГРАМИ
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {otherPrograms.map((p, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-lg shadow border hover:shadow-md transition"
            >
              <span className="block text-sm text-gray-500">{p.month}</span>
              <h3 className="text-lg font-semibold text-gray-800">{p.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-blue-50 rounded-lg p-6 text-center space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Будьте в курсі наших новин та подій
        </h2>
        <div className="flex justify-center gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Введіть Ваш email"
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <button className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
            Підписатися
          </button>
        </div>
      </section>
    </div>
  );
}
