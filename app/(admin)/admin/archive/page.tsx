'use client';

import ArchivedPageTable from '@/components/admin/ArchivedPage/ArchivedPageTable';
import Pagination from '@/components/shared/Pagination';
import Select from '@/components/shared/Select';
import ModalType from '@/components/ui/Modal/enums/modals-type';
import { getAllArticle } from '@/store/article-content/action';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { openModal } from '@/store/modal/ModalSlice';
import { GetArticleByIdResponseDTO, IGetAllArticleRequestDTO } from '@/utils/article-content/type/interfaces';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/utils/ArticleType';
import React, { useCallback, useEffect, useState } from 'react';

interface RenderPaginationProps {
  currentPage: number;
  totalPages: number;
  changePage: (page: number) => void;
}

const sortTypes = [
  { value: 'all', label: 'All' },
  { value: ArticleTypeEnum.NEWS, label: ArticleTypeEnum.NEWS },
  { value: ArticleTypeEnum.PROJECT, label: ArticleTypeEnum.PROJECT },
  { value: ArticleTypeEnum.EVENT, label: ArticleTypeEnum.EVENT },
  { value: ArticleTypeEnum.PROGRAM, label: ArticleTypeEnum.PROGRAM },
];

function ArchivePage() {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(0);
  const [chooseSortType, setChooseSortType] = useState(sortTypes[0].value);

  const projects = useAppSelector(state => state.articleContent.articleContent);
  const totalPages = useAppSelector(state => state.articleContent.totalPages);

  useEffect(() => {
    const params: IGetAllArticleRequestDTO = {
      page: currentPage,
      articleStatus: ArticleStatusEnum.ARCHIVED,
    };

    if (chooseSortType !== sortTypes[0].value) {
      params.articleType = chooseSortType as ArticleTypeEnum;
    }

    dispatch(getAllArticle(params));
  }, [dispatch, currentPage, chooseSortType]);

  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setChooseSortType(e.target.value);
    setCurrentPage(0);
  }

  //Restore
  async function handleRestore(project: GetArticleByIdResponseDTO) {
    dispatch(
      openModal({
        modalType: ModalType.ARTICLE_RESTORE,
        payload: project,
        title: project.articleType,
        currentPage: currentPage,
        articleStatus: ArticleStatusEnum.ARCHIVED,
        chooseSortType: chooseSortType,
        articlesOnPage: projects.length,
      }),
    );
  }

  //Delete
  const handleDelete = (project: GetArticleByIdResponseDTO) => {
    dispatch(
      openModal({
        modalType: ModalType.DELETE_ARTICLE,
        payload: project,
        title: project.articleType,
        currentPage: currentPage,
        articleStatus: ArticleStatusEnum.ARCHIVED,
        chooseSortType: chooseSortType,
        articlesOnPage: projects.length,
      }),
    );
  };

  const renderPagination = useCallback(({ currentPage, totalPages, changePage }: RenderPaginationProps) => <Pagination currentPage={currentPage} totalPages={totalPages} changePage={changePage} />, []);

  return (
    <>
      <div className="mb-5 flex items-center">
        <span className="font-semibold mr-2">Show:</span>
        <Select options={sortTypes} name="sortTypes" defaultValue={sortTypes[0].value} useFormik={false} onChange={handleSortChange} dropDownClass="absolute" parentClassname="!h-10 py-3" />
      </div>

      <ArchivedPageTable articles={projects} currentPage={currentPage} totalPages={totalPages} changePage={changePage} renderPagination={renderPagination} handleRestore={handleRestore} handleDelete={handleDelete} />
    </>
  );
}

export default ArchivePage;
