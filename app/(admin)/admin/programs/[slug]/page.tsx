import { pagesData } from "@/utils/constants/programsdata";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export default function ProgramDetailPage({ params }: Props) {
  const page: any = pagesData.find((p) => p.slug === params.slug);
  if (!page) return notFound();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-blue-900 flex items-center gap-2">
          ✏️ {page.title}
        </h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Preview page
          </button>
          <button className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
            Save
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {page.sections?.map((section: any, idx: number) => (
          <div
            key={idx}
            className="border rounded-lg bg-white shadow-sm p-4 flex flex-col gap-3"
          >
            {/* Section header */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {section.title}
              </h2>
              <button className="text-blue-900 hover:underline flex items-center gap-1">
                ✏️ Edit
              </button>
            </div>

            {/* Section content */}
            <div className="mt-2">
              {section.type === "image" ? (
                <img
                  src={section.content}
                  alt={section.title}
                  className="w-full rounded-md border"
                />
              ) : (
                <p className="text-gray-700">{section.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
