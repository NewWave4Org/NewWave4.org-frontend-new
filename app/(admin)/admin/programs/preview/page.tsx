'use client';

import Loading from '@/components/admin/helperComponents/Loading/Loading';
import ProgramPreview from '@/components/admin/ProgramsPage/ProgramPreview/ProgramPreview';
import ArrowLeft4Icon from '@/components/icons/navigation/ArrowLeft4Icon';
import Button from '@/components/shared/Button';
import { getArticleById } from '@/store/article-content/action';
import { useAppDispatch } from '@/store/hook';
import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function ProgramPreviewPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loadingProgram, setLoadingProgram] = useState(false);

  const idParam = searchParams.get('id');
  const programId = idParam ? Number(idParam) : NaN;

  const [program, setProgram] = useState<GetArticleByIdResponseDTO | undefined>(undefined);

  useEffect(() => {
    async function fetchFullProjectById() {
      try {
        setLoadingProgram(true);

        const result = await dispatch(getArticleById(programId)).unwrap();

        setProgram(result);
      } catch (error) {
        console.log('error', error);
        toast.error('Failed to fetch project');
      } finally {
        setLoadingProgram(false);
      }
    }
    fetchFullProjectById();
  }, [programId, dispatch]);

  if (loadingProgram) {
    return (
      <div className="relative h-full">
        <Loading />
      </div>
    );
  }

  return (
    <>
      {idParam && !Number.isNaN(programId) && programId > 0 ? (
        <>
          <Button onClick={() => router.back()} className="!py-2 flex items-center pl-2 pr-4 !min-h-8 text-white !bg-admin-700 hover:!bg-admin-600 duration-500 mb-10">
            <ArrowLeft4Icon color="white" />
            Back to the program
          </Button>
          <div className="bg-background-primary">
            <ProgramPreview program={program} />
          </div>
        </>
      ) : (
        <>
          <div className="text-h4 mb-5 mt-5 text-red-600">Oops! Something went wrong — please try again.</div>
          <Button className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-80 duration-300">
            <span className="mr-3">
              <ArrowLeft4Icon color="white" />
            </span>
            Back to the project
          </Button>
        </>
      )}
    </>
  );
}

export default ProgramPreviewPage;
