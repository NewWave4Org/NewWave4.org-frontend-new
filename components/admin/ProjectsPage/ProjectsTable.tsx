'use client';

import EditIcon from '@/components/icons/symbolic/EditIcon';
import PenIcon from '@/components/icons/symbolic/PenIcon';
import Button from '@/components/shared/Button';

import Table from '@/components/ui/Table/Table';
import clsx from 'clsx';
import { useAppDispatch } from '@/store/hook';
import Link from 'next/link';
import BasketIcon from '@/components/icons/symbolic/BasketIcon';
import { openModal } from '@/store/modal/ModalSlice';
import ModalType from '@/components/ui/Modal/enums/modals-type';

import { ReactNode } from 'react';
import { GerArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';
import useSortTable from '@/utils/hooks/useSortTable';
import ArchiveIcon from '@/components/icons/symbolic/ArchiveIcon';
import { formatDateUk, numericDate } from '@/utils/date';
import { ArticleStatusEnum } from '@/utils/ArticleType';


const TableHeader = [
  { id: '1', title: 'Title' },
  { id: '2', title: 'Author name' },
  { id: '3', title: 'Views' },
  { id: '4', title: 'Created (mm/dd/yy)' },
];

interface IRenderPaginationProps {
  currentPage: number;
  totalPages: number;
  changePage: (page: number) => void;
}

interface IProjectsTableProps {
  renderPagination: (props: IRenderPaginationProps) => ReactNode;
  projects: GerArticleByIdResponseDTO[];
  totalPages: number;
  currentPage: number;
  changePage: (page: number) => void;
  handleDeleteProject: (project: GerArticleByIdResponseDTO) => void;
  handleArchivedProject: (project: GerArticleByIdResponseDTO) => void;
}

function ProjectsTable({
  renderPagination,
  projects,
  totalPages,
  currentPage,
  changePage,
  handleArchivedProject,
  handleDeleteProject
}: IProjectsTableProps) {
  const {sortVal, handleSort, sortedData} = useSortTable({
    data: projects,
    initialSortField: 'articleStatus'
  });

  return (
    <div className="relative w-full h-full">
      <div className='mb-5'>
        <Table
          classNameRow="bg-admin-100"
          className="mb-5 last:mb-0"
          data={sortedData}
          renderHeader={() => (
            <>
              {TableHeader.map(({ id, title }) => (
                <th key={id} className="pl-3 pb-4 border-b border-admin-300">
                  {title}
                </th>
              ))}

              <th className="pb-4 px-2 border-b  border-admin-300">
                <span onClick={() => handleSort("articleStatus")} className="cursor-pointer">
                  Status
                  <span className={`${sortVal === 'asc' ? 'font-bold border-admin-600' : 'text-gray-400'} p-1 rounded-md border-gray-300 border ml-1 
                    hover:border-gray-500 duration-500 hover:text-admin-600`}>
                    ↑
                  </span>
                  <span
                    className={`${sortVal === 'desc' ? 'font-bold border-admin-600' : 'text-gray-400'} p-1 rounded-md border-gray-300 border ml-1 
                    hover:border-gray-500 duration-500 hover:text-admin-600`} >
                    ↓
                  </span>
                </span>
              </th>

              <th className="pb-4 border-b  border-admin-300 flex justify-end">
                <Link href='/admin/projects/new'>
                  <Button
                    variant="primary"
                    className="flex text-font-white !bg-background-darkBlue px-[12px] py-[9px] h-auto min-w-[135px]"
                  >
                    <div className="flex items-center mr-[12px]">
                      <PenIcon color="#fff" />
                    </div>
                    <span>Add new</span>
                  </Button>
                </Link>
              </th>
            </>
          )}
          renderRow={project => {
            const { id, articleStatus, title, views, authorName, createdAt } = project;
            const status = articleStatus.slice(0, 1).toUpperCase() + articleStatus.toLowerCase().slice(1);
            return (
              <>
                <td className="min-w-[200px] max-w-[250px] pl-3 py-6">
                  <p className="font-bold text-[18px] text-admin-700 truncate">
                    {title}
                  </p>
                </td>

                <td className="px-3 py-6">
                  {authorName}
                </td>

                <td className="px-3 py-6">
                  <div className="flex items-center justify-center gap-[10px]">
                    <p className="font-bold text-[20px] text-admin-700 line-clamp-1">
                      {views}
                    </p>

                    {/* <span className="text-sm text-grey-400">views</span> */}
                  </div>
                </td>

                <td className="px-3 py-6 text-center">
                  {numericDate(createdAt)}
                </td>

                <td className="px-3 py-6">
                  <span
                    className={clsx(
                      'flex items-center justify-center w-[120px] px-3 py-1 rounded-full border-2',
                      {
                        'border-status-success-500 text-status-success-500':
                          articleStatus === ArticleStatusEnum.PUBLISHED,
                        'border-status-danger-500 text-status-danger-500':
                          articleStatus === ArticleStatusEnum.DRAFT,
                      },
                    )}
                  >
                    {status}
                  </span>
                </td>

                <td className="pr-3 py-6">
                  <div className="flex gap-x-3 justify-end">
                    <Link href={`/admin/projects/${id}/edit`}>
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
                    <Button
                      variant="tertiary"
                      className="!text-admin-700 !py-2 bg-white h-auto flex items-center font-bold shadow-md
                      active:bg-transparent active:!text-admin-700 hover:shadow-lg duration-500"
                      onClick={() => handleDeleteProject(project)}
                    >
                      <div className="mr-1">
                        <BasketIcon color="#FC8181" />
                      </div>
                      Delete
                    </Button>
                    {articleStatus === ArticleStatusEnum.PUBLISHED && (<Button
                      variant="tertiary"
                      className="!text-admin-700 !py-2 bg-white h-auto flex items-center font-bold shadow-md
                      active:bg-transparent active:!text-admin-700 hover:shadow-lg duration-500"
                      onClick={() => handleArchivedProject(project)}
                    >
                      <div className="mr-1">
                        <ArchiveIcon color="#FC8181" />
                      </div>
                      Archive
                    </Button>)}
                  </div>
                </td>
              </>
            );
          }}
        />
      </div>

      {renderPagination &&
        renderPagination({ currentPage, totalPages, changePage })}
    </div>
  );
}

export default ProjectsTable;
