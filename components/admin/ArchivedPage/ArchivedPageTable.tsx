'use client';

import BasketIcon from '@/components/icons/symbolic/BasketIcon';
import EditIcon from '@/components/icons/symbolic/EditIcon';
import RestoreIcon from '@/components/icons/symbolic/RestoreIcon';
import Button from '@/components/shared/Button';
import Select from '@/components/shared/Select';
import ModalType from '@/components/ui/Modal/enums/modals-type';
import Table from '@/components/ui/Table/Table';

import { useAppDispatch } from '@/store/hook';
import { openModal } from '@/store/modal/ModalSlice';
import { GerArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/utils/ArticleType';
import { numericDate } from '@/utils/date';

import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';

const TableHeader = [
  { id: '1', title: 'Title', classBlock: '' },
  { id: '2', title: 'Author name', classBlock: '' },
  { id: '3', title: 'Views', classBlock: 'text-center' },
  { id: '4', title: 'Created (mm/dd/yy)', classBlock: 'text-center' },
];

interface IRenderPaginationProps {
  currentPage: number;
  totalPages: number;
  changePage: (page: number) => void;
}

interface IArchivedTableProps {
  renderPagination: (props: IRenderPaginationProps) => ReactNode;
  articles: GerArticleByIdResponseDTO[];
  totalPages: number;
  currentPage: number;
  changePage: (page: number) => void;
  handleRestore: (project: GerArticleByIdResponseDTO) => void;
  handleDelete: (project: GerArticleByIdResponseDTO) => void;
}

function ArchivedPageTable({ renderPagination, articles, totalPages, currentPage, changePage, handleRestore, handleDelete }: IArchivedTableProps) {
  return (
    <div className="relative w-full h-full">
      <div className="mb-5">
        <Table
          classNameRow="bg-admin-100"
          className="mb-5 last:mb-0"
          data={articles}
          renderHeader={() => (
            <>
              {TableHeader.map(({ id, title, classBlock }) => (
                <th key={id} className={`px-3 pb-4 border-b border-admin-300 ${classBlock}`}>
                  {title}
                </th>
              ))}

              <th className="px-3 pb-4 border-b  border-admin-300 text-center">Status</th>

              <th className="px-3 pb-4 border-b  border-admin-300 text-center">Actions</th>
            </>
          )}
          renderRow={project => {
            const { id, articleStatus, title, views, authorName, createdAt, articleType } = project;
            const status = articleStatus.slice(0, 1).toUpperCase() + articleStatus.toLowerCase().slice(1);
            return (
              <>
                <td className="min-w-[200px] max-w-[250px] pl-3 py-6">
                  <p className="font-bold text-[18px] text-admin-700 truncate">{title}</p>
                </td>

                <td className="px-3 py-6">{authorName}</td>

                <td className="px-3 py-6">
                  <div className="flex items-center justify-center gap-[10px]">
                    <p className="font-bold text-[20px] text-admin-700 line-clamp-1">{views}</p>

                    {/* <span className="text-sm text-grey-400">views</span> */}
                  </div>
                </td>

                <td className="px-3 py-6 text-center">{numericDate(createdAt)}</td>

                <td className="px-3 py-6 text-center">
                  <span className="inline-block bg-gray-300 text-black w-[120px] px-3 py-1 rounded-full border-2">{status}</span>
                </td>

                <td className="pr-3 py-6">
                  <div className="flex gap-x-3 justify-end">
                    <Button
                      variant="tertiary"
                      className="!text-admin-700 !py-2 bg-white h-auto flex items-center font-bold shadow-md
                      active:bg-transparent active:!text-admin-700 hover:shadow-lg duration-500"
                      onClick={() => handleDelete(project)}
                    >
                      <div className="mr-1">
                        <BasketIcon color="#FC8181" />
                      </div>
                      Delete
                    </Button>
                    <Button
                      onClick={() => handleRestore(project)}
                      variant="tertiary"
                      className="!text-admin-700 !py-2 bg-white h-auto flex items-center font-bold shadow-md
                      active:bg-transparent active:!text-admin-700 hover:shadow-lg duration-500"
                    >
                      <div className="mr-1">
                        <RestoreIcon color="#2b8a58" />
                      </div>
                      Restore
                    </Button>
                  </div>
                </td>
              </>
            );
          }}
        ></Table>
      </div>

      {articles?.length > 0 && renderPagination({ currentPage, totalPages, changePage })}
    </div>
  );
}

export default ArchivedPageTable;
