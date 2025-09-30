'use client';

import ProjectContent from '@/components/admin/ProjectsPage/ProjectContent/ProjectContent';
import ArrowLeft4Icon from '@/components/icons/navigation/ArrowLeft4Icon';
import Button from '@/components/shared/Button';
import LinkBtn from '@/components/shared/LinkBtn';
import { useParams, useRouter } from 'next/navigation';


function EditProjectPage() {
  const { id } = useParams();
  const projectId = Number(id);
  const router = useRouter();
  console.log('projectId', projectId)

  return (
    <>
      <Button onClick={() => router.back()} className='!py-2 pl-2 pr-4 !min-h-8 !h-auto flex text-white !bg-admin-700 hover:!bg-admin-600 duration-500 mb-10'>
        <ArrowLeft4Icon color="white" />
        Back
      </Button>
      <h4 className="text-h4 mb-5">Edit project content</h4>
      {!Number.isNaN(id) 
        ? <ProjectContent projectId={projectId} />
        : <>
            <div className='text-h4 mb-5'>Project wasn't created</div>
            <Button onClick={() => router.back()} className="!bg-background-darkBlue !h-auto flex text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-80 duration-300">
              <ArrowLeft4Icon />
              Back
            </Button>
          </>
      }
      
    </>
  );
}


export default EditProjectPage;