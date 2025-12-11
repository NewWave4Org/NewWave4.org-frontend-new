import { GlobalSectionsType } from '@/components/admin/GlobalSections/enum/types';
import EditIcon from '@/components/icons/symbolic/EditIcon';
import Button from '@/components/shared/Button';
import Table from '@/components/ui/Table/Table';
import Link from 'next/link';

const TableHeader = [
  { id: '1', title: 'Block name' },
  { id: '2', title: 'Actions' },
];

function GlobalSectionsPage() {
  const TableSections = [
    { id: GlobalSectionsType.OUR_SOCIAL_LINKS, title: 'Social links' },
    { id: GlobalSectionsType.OUR_PARTNERS, title: 'Our partners' },
  ];

  return (
    <Table
      data={TableSections}
      classNameRow="bg-admin-100"
      className="mb-5 last:mb-0"
      renderHeader={() => (
        <>
          {TableHeader.map(({ id, title }) => (
            <th key={id} className={`pl-3 pb-4 border-b border-admin-300 ${id === '2' ? 'text-right' : ''}`}>
              {title}
            </th>
          ))}
        </>
      )}
      renderRow={section => {
        const { id, title } = section;

        return (
          <>
            <td className="min-w-[200px] max-w-[250px] pl-3 py-6">
              <p className="title-row">{title}</p>
            </td>

            <td className="pr-3 py-6">
              <div className="flex gap-x-3 justify-end">
                <Link href={`/admin/global-sections/${id}`}>
                  <Button
                    variant="tertiary"
                    className="!text-admin-700 !py-2 bg-white h-auto flex items-center font-bold shadow-md 
                    active:bg-transparent active:!text-admin-700 hover:shadow-lg duration-500"
                  >
                    <div className="mr-1">
                      <EditIcon />
                    </div>
                    Edit
                  </Button>
                </Link>
              </div>
            </td>
          </>
        );
      }}
    />
  );
}

export default GlobalSectionsPage;
