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
import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';
import useSortTable from '@/utils/hooks/useSortTable';
import ArchiveIcon from '@/components/icons/symbolic/ArchiveIcon';


const TableHeader = [
  { id: '1', title: 'Title' },
  { id: '2', title: 'Author name' },
  { id: '3', title: 'Views' },
];

interface IRenderPaginationProps {
  currentPage: number;
  totalPages: number;
  changePage: (page: number) => void;
}

interface IProjectsTableProps {
  renderPagination: (props: IRenderPaginationProps) => ReactNode;
  projects: GetArticleByIdResponseDTO[];
  totalPages: number;
  currentPage: number;
  changePage: (page: number) => void;
}

function ProjectsTable({
  renderPagination,
  projects,
  totalPages,
  currentPage,
  changePage,
}: IProjectsTableProps) {
  const dispatch = useAppDispatch();

  const {sortVal, handleSort, sortedData} = useSortTable({
    data: projects,
    initialSortField: 'articleStatus'
  });

  const handleDeleteProject = (project: GetArticleByIdResponseDTO) => {
    dispatch(
      openModal({
        modalType: ModalType.DELETEPROJECT,
        payload: project,
        title: 'projects'
      }),
    );
  };

  const handleArchivedProject = (project: GetArticleByIdResponseDTO) => {
    dispatch(
      openModal({
        modalType: ModalType.ARCHIVEDARTICLE,
        payload: project,
        title: 'project'
      }),
    );
  }

  return (
    <div className="relative w-full h-full overflow-auto">
      <Table
        classNameRow="bg-admin-100"
        className="mb-5 last:mb-0"
        data={sortedData}
        renderHeader={() => (
          <>
            {TableHeader.map(({ id, title }) => (
              <th key={id} className="pl-[45px] pb-4 border-b border-admin-300">
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
          const { id, articleStatus, title, views, authorName } = project;
          const status = articleStatus.slice(0, 1).toUpperCase() + articleStatus.toLowerCase().slice(1);
          return (
            <>
              <td className="min-w-[250px] max-w-[300px] pl-[45px] py-[25px]">
                <p className="font-bold text-[18px] text-admin-700 truncate">
                  {title}
                </p>
              </td>

              <td className="pl-[45px] py-[25px]">
                {authorName}
              </td>

              <td className="pl-[45px] py-[25px]">
                <div className="flex items-center gap-[10px]">
                  <p className="font-bold text-[20px] text-admin-700 line-clamp-1">
                    {views}
                  </p>

                  <span className="text-sm text-grey-400">views</span>
                </div>
              </td>

              <td className="pl-[45px] py-[25px]">
                <span
                  className={clsx(
                    'flex items-center justify-center w-[120px] px-3 py-1 rounded-full border-2',
                    {
                      'border-status-success-500 text-status-success-500':
                        status === 'Published',
                      'border-status-danger-500 text-status-danger-500':
                        status === 'Draft',
                    },
                  )}
                >
                  {status}
                </span>
              </td>

              <td className="flex justify-end pr-[45px] py-[25px]">
                <div className="flex gap-x-5">
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
                  <Button
                    variant="tertiary"
                    className="!text-admin-700 !py-2 bg-white h-auto flex items-center font-bold shadow-md
                    active:bg-transparent active:!text-admin-700 hover:shadow-lg duration-500"
                    onClick={() => handleArchivedProject(project)}
                  >
                    <div className="mr-1">
                      <ArchiveIcon color="#FC8181" />
                    </div>
                    Archive
                  </Button>
                </div>
              </td>
            </>
          );
        }}
      />

      {renderPagination &&
        renderPagination({ currentPage, totalPages, changePage })}
    </div>
  );
}

export default ProjectsTable;
