'use client';

import { getAllArticle, getArticleById } from '@/store/article-content/action';
import { useAppDispatch } from '@/store/hook';
import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';
import { ArticleStatusEnum, ArticleTypeEnum } from '@/utils/ArticleType';
import { useParams, useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ProgramPreview from '../admin/ProgramsPage/ProgramPreview/ProgramPreview';
import ProgramBlocks from './ProgramDopBlocks/ProgramBlocks';
import Button from '../shared/Button';
import ArrowLeft4Icon from '../icons/navigation/ArrowLeft4Icon';

function ProgramPageClient() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const params = useParams();
  const id = params.id;
  const programId = Number(id);

  const [program, setProgram] = useState<GetArticleByIdResponseDTO | undefined>(undefined);
  const [dopPrograms, setDopPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFullProgramById() {
      try {
        setLoading(true);
        const result = await dispatch(
          getArticleById({
            id: programId,
            articleType: ArticleTypeEnum.PROGRAM,
          }),
        ).unwrap();

        setProgram(result);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log('error', error);
        toast.error('Failed to fetch project');
      }
    }

    fetchFullProgramById();
  }, [programId, dispatch]);

  useEffect(() => {
    async function fetchDopPrograms() {
      try {
        const result = await dispatch(
          getAllArticle({
            page: 0,
            size: 3,
            articleType: ArticleTypeEnum.PROGRAM,
            articleStatus: ArticleStatusEnum.PUBLISHED,
          }),
        ).unwrap();

        setDopPrograms(result?.content);
      } catch (error) {
        console.log('error', error);
        toast.error('Failed to fetch project');
      }
    }

    fetchDopPrograms();
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <div className="text-center py-16 text-lg text-font-secondary">Loading...</div>
      ) : programId && !Number.isNaN(programId) && programId > 0 ? (
        <div>
          <ProgramPreview program={program} />
          <ProgramBlocks dopPrograms={dopPrograms} />
        </div>
      ) : (
        <div className="container mx-auto px-4 pt-[150px]">
          <div className="text-h4 mb-5 mt-5 text-red-600">Oops! Something went wrong — please try again.</div>
          <Button className="!bg-background-darkBlue flex text-white !rounded-[5px] !h-[60px] font-normal text-xl px-4 hover:opacity-80 duration-300" onClick={() => router.back()}>
            <span className="mr-3">
              <ArrowLeft4Icon color="white" />
            </span>
            Back to homepage
          </Button>
        </div>
      )}
    </>
  );
}

export default ProgramPageClient;
