'use client';
import { FC, ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getAllArticle } from '@/store/article-content/action';
import Table from '@/components/ui/Table/Table';
import Button from '@/components/shared/Button';
import PenIcon from '@/components/icons/symbolic/PenIcon';
import EditIcon from '@/components/icons/symbolic/EditIcon';
import clsx from 'clsx';
import BasketIcon from '@/components/icons/symbolic/BasketIcon';
import { Article } from '@/utils/articles/type/interface';
import { openModal } from '@/store/modal/ModalSlice';
import ModalType from '@/components/ui/Modal/enums/modals-type';
import ArchiveIcon from '@/components/icons/symbolic/ArchiveIcon';
import { numericDate } from '@/utils/date';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/utils/ArticleType';

const articlesHeader = [
  { id: '1', title: 'Title' },
  { id: '2', title: 'Author name' },
  { id: '3', title: 'Views' },
  { id: '4', title: 'Created' },
  { id: '5', title: 'Status' },
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
  const articles = useAppSelector(state => state.articleContent.articleContent);
  const totalPages = useAppSelector(state => state.articleContent.totalPages);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      getAllArticle({
        page: currentPage,
        size: 10,
        articleType: ArticleTypeEnum.NEWS,
        articleStatus: `${ArticleStatusEnum.DRAFT},${ArticleStatusEnum.PUBLISHED}`,
      }),
    );
  }, [dispatch, currentPage]);

  const changePage = (page: number) => setCurrentPage(page);

  const handleDeleteArticle = (article: Article) => {
    dispatch(
      openModal({
        modalType: ModalType.DELETEARTICLE,
        payload: article,
      }),
    );
  };

  const handleArchiveArticle = (article: Article) => {
    dispatch(
      openModal({
        modalType: ModalType.ARCHIVEDARTICLE,
        payload: article,
        title: 'article',
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
              <th key={id} className="px-3 pb-4 border-b border-admin-300">
                {title}
              </th>
            ))}

            <th className="pb-4 border-b  border-admin-300 flex justify-end">
              <Link href="/admin/articles/new">
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
        renderRow={(article: Article) => {
          const { id, articleStatus, title, views, authorName, createdAt } =
            article;
          const status =
            articleStatus.slice(0, 1).toUpperCase() +
            articleStatus.toLowerCase().slice(1);

          return (
            <>
              <td className="min-w-[250px] max-w-[300px] px-3 py-6">
                <p className="font-bold text-[18px] text-admin-700 truncate">
                  {title}
                </p>
              </td>

              <td className="px-3 py-6">{authorName}</td>

              <td className="px-3 py-6">
                <div className="flex items-center gap-[10px]">
                  <p className="font-bold text-[20px] text-admin-700 line-clamp-1">
                    {views}
                  </p>

                  <span className="text-sm text-grey-400">views</span>
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
                        status === 'Published',
                      'border-status-danger-500 text-status-danger-500':
                        status === 'Draft',
                    },
                  )}
                >
                  {status}
                </span>
              </td>

              <td className="flex px-3 py-6">
                <div className="flex gap-x-5">
                  <Link href={`/admin/articles/edit?id=${id}`}>
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
                  {article.articleStatus === 'PUBLISHED' ? (
                    <Button
                      variant="tertiary"
                      className="!text-admin-700 !py-2 bg-white h-auto flex items-center font-bold shadow-md
                    active:bg-transparent active:!text-admin-700 hover:shadow-lg duration-500"
                      onClick={() => handleArchiveArticle(article)}
                    >
                      <div className="mr-1">
                        <ArchiveIcon color="#FC8181" />
                      </div>
                      Archive
                    </Button>
                  ) : (
                    <div />
                  )}
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
