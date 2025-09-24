'use client';

import ProjectPreview from "@/components/admin/ProjectsPage/ProjectPreview/ProjectPreview";
import ArrowLeft4Icon from "@/components/icons/navigation/ArrowLeft4Icon";
import Button from "@/components/shared/Button";
import { getArticleById } from "@/store/article-content/action";
import { useAppDispatch } from "@/store/hook";
import { GerArticleByIdResponseDTO } from "@/utils/article-content/type/interfaces";
import { ArticleTypeEnum } from "@/utils/ArticleType";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function PreviewPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();

  const idParam = searchParams.get('id');
  const projectId = idParam ? Number(idParam) : NaN;

  const [project, setProject] = useState<GerArticleByIdResponseDTO | undefined>(undefined)

  useEffect(() => {
    async function fetchFullProjectById() {
      try {
        const result = await dispatch(getArticleById({id: projectId, articleType: ArticleTypeEnum.PROJECT})).unwrap();

        setProject(result)
      } catch (error) {
        console.log('error', error)
        toast.error('Failed to fetch project');
      }
    }
    fetchFullProjectById();
  }, [projectId, dispatch]);
  
  return (
    <>
      {idParam && !Number.isNaN(projectId) && projectId > 0 
        ? (
          <>
            <Button onClick={() => router.back()} className='!py-2 flex items-center pl-2 pr-4 !min-h-8 text-white !bg-admin-700 hover:!bg-admin-600 duration-500 mb-10'>
              <ArrowLeft4Icon color="white" />
              Back to the project
            </Button>
            <ProjectPreview project={project} />
          </>
        )
        : (
          <>
            <div className='text-h4 mb-5 mt-5 text-red-600'>Oops! Something went wrong — please try again.</div>
            <Button className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-80 duration-300">
              <span className='mr-3' >
                <ArrowLeft4Icon color='white' />
              </span>
              Back to the project
            </Button>
          </>
        )
      }
    </>
  );
}

export default PreviewPage;