import Link from "next/link";

interface Props {
  pagesData?: any[];
}

export default function ProgramsTable(props: Props) {

  const { pagesData } = props;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Pages</h1>
        <button className="bg-[#2A4365] text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-800">
          <span className="mr-2">＋</span> Add new
        </button>
      </div>

      <div className="overflow-hidden">
        <table className="min-w-full bg-white border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-gray-600 text-sm border-b border-2 border-[#E2E8F0]">
              <th className="py-3 px-4">Page title</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Author</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {pagesData?.map((page) => (
              <tr
                key={page.slug}
                className="hover:bg-gray-50 transition-colors bg-[#F7FAFC]"
              >
                <td className="py-4 px-4 font-semibold text-blue-900">
                  <Link href={`/admin/programs/${page.slug}`} className="hover:underline">
                    {page.title}
                  </Link>
                </td>
                <td className="py-4 px-4 text-gray-600 text-sm">{page.updated}</td>
                <td className="py-4 px-4">
                  <span className="bg-green-200 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {page.status}
                  </span>
                </td>
                <td className="py-4 px-4 flex items-center gap-2 text-gray-800">
                  <span>{page.author}</span>
                  <span className="bg-[#2A4365] text-white px-2 py-1 rounded-full text-xs">
                    {page.role}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-400 cursor-pointer">⋯</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
