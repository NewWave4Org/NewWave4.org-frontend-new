'use client';
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
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

const getAdminPath = (
  articleType: ArticleTypeEnum,
  action: 'new' | 'edit',
  id?: number,
) => {
  const base = articleType === ArticleTypeEnum.EVENT ? 'events' : 'articles';
  return action === 'new'
    ? `/admin/${base}/new`
    : `/admin/${base}/edit?id=${id}`;
};

const articlesHeader = [
  { id: '1', title: 'Title' },
  { id: '2', title: 'Author name' },
  { id: '3', title: 'Views' },
];

type renderPaginationProps = {
  currentPage: number;
  totalPages: number;
  changePage: (page: number) => void;
};

type Props = {
  renderPagination: (props: renderPaginationProps) => ReactNode;
  articleType: ArticleTypeEnum;
};

const ArticlesTable: FC<Props> = ({ renderPagination, articleType }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const articles = useAppSelector(state => state.articleContent.articleContent);
  const totalPages = useAppSelector(state => state.articleContent.totalPages);
  const dispatch = useAppDispatch();

  const [chooseSortStatusType, setChooseSortStatusType] =
    useState<boolean>(true);
  const [chooseSortDateType, setChooseSortDateType] = useState<boolean>(true);

  const fetchArticles = useCallback(() => {
    dispatch(
      getAllArticle({
        page: currentPage,
        size: 10,
        articleType,
        sortByStatus: chooseSortStatusType ?? undefined,
        sortByCreatedAtDescending: chooseSortDateType ?? undefined,
        articleStatus: `${ArticleStatusEnum.DRAFT},${ArticleStatusEnum.PUBLISHED}`,
      }),
    );
  }, [
    dispatch,
    currentPage,
    chooseSortDateType,
    chooseSortStatusType,
    articleType,
  ]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles, refresh]);

  const prevArticlesCount = useRef(articles.length);

  useEffect(() => {
    if (articles.length < prevArticlesCount.current) {
      if (articles.length === 0 && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      } else {
        setRefresh(prev => !prev);
      }
    }
    prevArticlesCount.current = articles.length;
  }, [articles, currentPage]);

  const changePage = (page: number) => setCurrentPage(page);

  const handleDeleteArticle = (article: Article) => {
    dispatch(
      openModal({
        modalType: ModalType.DELETE_ARTICLE,
        payload: article,
        title: articleType === ArticleTypeEnum.EVENT ? 'event' : 'article',
      }),
    );
  };

  const handleArchiveArticle = (article: Article) => {
    dispatch(
      openModal({
        modalType: ModalType.ARCHIVED_ARTICLE,
        payload: article,
        title: articleType === ArticleTypeEnum.EVENT ? 'event' : 'article',
      }),
    );
  };

  function handleSortChange(e: React.ChangeEvent<HTMLSpanElement>) {
    const { value } = e.target.dataset;

    if (value === undefined) return;

    setChooseSortStatusType(value === 'true');
    setCurrentPage(0);

    console.log(
      'Fetching articles, sortByCreatedAtDescending:',
      chooseSortDateType,
    );
  }

  function handleSortByDate(e: React.ChangeEvent<HTMLSpanElement>) {
    const { value } = e.target.dataset;

    if (value === undefined) return;

    setChooseSortDateType(value === 'true');
    setCurrentPage(0);
  }

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

            <th className="pb-4 px-2 border-b  border-admin-300">
              <span
                onClick={e => handleSortByDate(e)}
                className="cursor-pointer"
              >
                Created
                <span
                  data-value="true"
                  className={`${
                    chooseSortDateType === true
                      ? 'font-bold !border-admin-600'
                      : 'text-gray-400'
                  } p-1 rounded-md border-gray-300 border ml-1 
                    hover:border-gray-500 duration-500 hover:text-admin-600`}
                >
                  ↑
                </span>
                <span
                  data-value="false"
                  className={`${
                    chooseSortDateType === false
                      ? 'font-bold !border-admin-600'
                      : 'text-gray-400'
                  } p-1 rounded-md border-gray-300 border ml-1 
                    hover:border-gray-500 duration-500 hover:text-admin-600`}
                >
                  ↓
                </span>
              </span>
            </th>

            <th className="pb-4 px-2 border-b  border-admin-300">
              <span
                onClick={e => handleSortChange(e)}
                className="cursor-pointer"
              >
                Status
                <span
                  data-value="true"
                  className={`${
                    chooseSortStatusType === true
                      ? 'font-bold !border-admin-600'
                      : 'text-gray-400'
                  } p-1 rounded-md border-gray-300 border ml-1 
                    hover:border-gray-500 duration-500 hover:text-admin-600`}
                >
                  ↑
                </span>
                <span
                  data-value="false"
                  className={`${
                    chooseSortStatusType === false
                      ? 'font-bold !border-admin-600'
                      : 'text-gray-400'
                  } p-1 rounded-md border-gray-300 border ml-1 
                    hover:border-gray-500 duration-500 hover:text-admin-600`}
                >
                  ↓
                </span>
              </span>
            </th>

            <th className="pb-4 border-b  border-admin-300 flex justify-end">
              <Link href={getAdminPath(articleType, 'new')}>
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
                <p className="title-row">{title}</p>
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

              <td className="px-3 py-6 align-middle">
                <div className="flex gap-x-5">
                  <Link href={getAdminPath(articleType, 'edit', id)}>
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
