'use client';

import Loading from '@/components/admin/helperComponents/Loading/Loading';
import ProjectPreview from '@/components/admin/ProjectsPage/ProjectPreview/ProjectPreview';
import ArrowLeft4Icon from '@/components/icons/navigation/ArrowLeft4Icon';
import Button from '@/components/shared/Button';
import { getArticleById } from '@/store/article-content/action';
import { useAppDispatch } from '@/store/hook';
import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function PreviewPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loadingProject, setLoadingProgect] = useState(false);

  const idParam = searchParams.get('id');
  const projectId = idParam ? Number(idParam) : NaN;

  const [project, setProject] = useState<GetArticleByIdResponseDTO | undefined>(undefined);

  useEffect(() => {
    async function fetchFullProjectById() {
      try {
        setLoadingProgect(true);

        const result = await dispatch(getArticleById(projectId)).unwrap();

        setProject(result);
      } catch (error) {
        console.log('error', error);
        toast.error('Failed to fetch project');
      } finally {
        setLoadingProgect(false);
      }
    }
    fetchFullProjectById();
  }, [projectId, dispatch]);

  if (loadingProject) {
    return (
      <div className="relative h-full">
        <Loading />
      </div>
    );
  }

  return (
    <>
      {idParam && !Number.isNaN(projectId) && projectId > 0 ? (
        <>
          <Button onClick={() => router.back()} className="!py-2 flex items-center pl-2 pr-4 !min-h-8 text-white !bg-admin-700 hover:!bg-admin-600 duration-500 mb-10">
            <ArrowLeft4Icon color="white" />
            Back to the project
          </Button>
          <ProjectPreview project={project} />
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

export default PreviewPage;
