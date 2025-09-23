'use client';

import ProjectContent from '@/components/admin/ProjectsPage/ProjectContent/ProjectContent';
import ArrowLeft4Icon from '@/components/icons/navigation/ArrowLeft4Icon';
import ArticlesIcon from '@/components/icons/symbolic/ArticlesIcon';
import LinkBtn from '@/components/shared/LinkBtn';
import { useSearchParams } from 'next/navigation';

function NewProjectContentPage() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const id = idParam ? Number(idParam) : NaN;;

  return (
    <>
      {idParam && !Number.isNaN(id) && id > 0 
        ? <>
            <LinkBtn href='/admin/projects' className='!py-2 pl-2 pr-4 !min-h-8 text-white !bg-admin-700 hover:!bg-admin-600 duration-500 mb-10' targetLink='_self'>
              <ArrowLeft4Icon color="white" />
              Back to all projects
            </LinkBtn>
            <h4 className="text-h4 mb-3">Create new project</h4>
            <ProjectContent projectId={id} />
          </>
        : <>
            <div className='text-h4 mb-5 mt-5 text-red-600'>Oops! The project couldn't be created. Something went wrong — please try again.</div>
            <LinkBtn href="/admin/projects/new" className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-80 duration-300">
              <span className='mr-3' >
                <ArticlesIcon color='white' />
              </span>
              Create new project
            </LinkBtn>
          </>
      }
      
    </>
  );
}

export default NewProjectContentPage;
