'use client';
import { FC, ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { allArticles } from '@/store/articles/action';
import Table from '@/components/ui/Table/Table';
import DropDown from '@/components/shared/DropDown';
import Button from '@/components/shared/Button';
import PenIcon from '@/components/icons/symbolic/PenIcon';
import EditIcon from '@/components/icons/symbolic/EditIcon';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import BasketIcon from '@/components/icons/symbolic/BasketIcon';
import { Article } from '@/utils/articles/type/interface';
import { openModal } from '@/components/ui/Modal/ModalSlice';
import ModalType from '@/components/ui/Modal/enums/modals-type';

const articlesHeader = [
  { id: '1', title: 'Title' },
  { id: '2', title: 'Status' },
  { id: '3', title: 'Views' },
];

type renderPaginationProps = {
  currentPage: number;
  totalPages: number;
  changePage: (page: number) => void;
};

type Props = {
  renderPagination: (props: renderPaginationProps) => ReactNode;
};

const ArticlesTable: FC<Props> = ({ renderPagination }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const articles = useAppSelector(state => state.articles.articles);
  const totalPages = useAppSelector(state => state.articles.totalPages);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(allArticles({ page: currentPage }));
  }, [dispatch, currentPage]);

  const changePage = (page: number) => setCurrentPage(page);

  const handleAddNewArticle = () => {
    router.push('/admin/articles/new');
  };

  const handleDeleteArticle = (article: Article) => {
    dispatch(
      openModal({
        modalType: ModalType.DELETEARTICLE,
        payload: article,
      }),
    );
  };

  return (
    <div className="relative w-full h-full overflow-auto">
      <Table
        classNameRow="bg-admin-100"
        className="mb-5 last:mb-0"
        data={articles}
        renderHeader={() => (
          <>
            {articlesHeader.map(({ id, title }) => (
              <th key={id} className="pl-[45px] pb-4 border-b border-admin-300">
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
                  { label: 'Article', onClick: handleAddNewArticle },
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

              <td className="pl-[45px] py-[25px]">
                <div className="flex items-center gap-[10px]">
                  <p className="font-bold text-[20px] text-admin-700 line-clamp-1">
                    {views}
                  </p>

                  <span className="text-sm text-grey-400">views</span>
                </div>
              </td>

              <td className="flex justify-end pr-[45px] py-[25px]">
                <div className="flex gap-x-[40px]">
                  <Link href={`/admin/articles/${id}/edit`}>
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
                    onClick={() => handleDeleteArticle(article)}
                  >
                    <div className="mr-1">
                      <BasketIcon color="#FC8181" />
                    </div>
                    Delete
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
};

export default ArticlesTable;
