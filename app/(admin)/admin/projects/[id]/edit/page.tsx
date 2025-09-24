import ProjectContent from '@/components/admin/ProjectsPage/ProjectContent/ProjectContent';
import ArrowLeft4Icon from '@/components/icons/navigation/ArrowLeft4Icon';
import LinkBtn from '@/components/shared/LinkBtn';


async function EditProjectPage({params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;
  const projectId = Number(id);

  return (
    <>
      <LinkBtn href='/admin/projects' className='!py-2 pl-2 pr-4 !min-h-8 text-white !bg-admin-700 hover:!bg-admin-600 duration-500 mb-10' targetLink='_self'>
        <ArrowLeft4Icon color="white" />
        Back to all projects
      </LinkBtn>
      <h4 className="text-h4 mb-5">Edit project content</h4>
      {!Number.isNaN(id) 
        ? <ProjectContent projectId={projectId} />
        : <>
            <div className='text-h4 mb-5'>Project wasn't created</div>
            <LinkBtn href="/admin/projects/new" className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-80 duration-300">
              <ArrowLeft4Icon />
              Back to project page
            </LinkBtn>
          </>
      }
      
    </>
  );
}


export default EditProjectPage;