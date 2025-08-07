'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PenIcon from '@/components/icons/symbolic/PenIcon';
import DropDown from '@/components/shared/DropDown';
import ProtectedRoute from '../../ProtectedRoute';
import Table from '@/components/ui/Table/Table';
import Button from '@/components/shared/Button';
import Pagination from '@/components/shared/Pagination';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { allArticles } from '@/store/articles/action';
import EditIcon from '@/components/icons/symbolic/EditIcon';
import clsx from 'clsx';

const articlesHeader = [
  { id: '1', title: 'Title' },
  { id: '2', title: 'Status' },
  { id: '3', title: 'Views' },
];

const ArticlesListPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const getAllArticles = useAppSelector(state => state.articles.articles);
  const totalPages = useAppSelector(state => state.articles.totalPages);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(allArticles({ page: currentPage }));
  }, [dispatch, currentPage]);

  const changePage = (page: number) => setCurrentPage(page);

  return (
    <ProtectedRoute>
      <div className="w-full">
        <Table
          classNameRow="bg-admin-100"
          data={getAllArticles}
          renderHeader={() => (
            <>
              {articlesHeader.map(({ id, title }) => (
                <th
                  key={id}
                  className="pl-[45px] pb-4 border-b border-admin-300"
                >
                  {title}
                </th>
              ))}

              <th className="pb-4 border-b  border-admin-300 flex justify-end">
                <DropDown
                  renderBth={(_isOpen, toggle) => (
                    <Button
                      variant="primary"
                      onClick={toggle}
                      className="flex text-font-white !bg-background-darkBlue px-[12px] py-[9px] h-auto min-w-[135px]"
                    >
                      <div className="flex items-center mr-[12px]">
                        <PenIcon color="#fff" />
                      </div>

                      <span>Add new</span>
                    </Button>
                  )}
                  items={[
                    { label: 'Article' },
                    { label: 'Event' },
                    { label: 'Program' },
                  ]}
                />
              </th>
            </>
          )}
          renderRow={article => {
            const { id, newsStatus, title, views } = article;
            const status =
              newsStatus.slice(0, 1).toUpperCase() +
              newsStatus.toLowerCase().slice(1);

            return (
              <>
                <td className="min-w-[250px] max-w-[300px] pl-[45px] py-[25px]">
                  <p className="font-bold text-[18px] text-admin-700 truncate">
                    {title}
                  </p>
                </td>

                <td className="pl-[45px] py-[25px]">
                  <span
                    className={clsx(
                      'flex items-center justify-center w-[120px] px-3 py-1 rounded-full border-2',
                      {
                        'border-[#9AE6B4] text-[#9AE6B4]':
                          status === 'Published',
                        'border-[#FC8181] text-[#FC8181]': status === 'Draft',
                      },
                    )}
                  >
                    {status}
                  </span>
                </td>

                <td className="pl-[45px] py-[25px]">
                  <div className="flex items-center gap-[10px]">
                    <p className="font-bold text-[20px] text-admin-700 line-clamp-1">
                      {views}
                    </p>

                    <span className="text-sm text-[#A0AEC0]">views</span>
                  </div>
                </td>

                <td className="flex justify-end pr-[45px] py-[25px]">
                  <Link href={`/admin/articles/${id}/edit`}>
                    <Button
                      className="bg-transparent !p-0 h-auto flex items-center font-bold 
                        hover:bg-transparent active:bg-transparent active:!text-admin-700"
                    >
                      <div className="mr-[10px]">
                        <EditIcon />
                      </div>

                      <span>Edit</span>
                    </Button>
                  </Link>
                </td>
              </>
            );
          }}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          changePage={changePage}
        />
      </div>
    </ProtectedRoute>
  );
};

export default ArticlesListPage;
