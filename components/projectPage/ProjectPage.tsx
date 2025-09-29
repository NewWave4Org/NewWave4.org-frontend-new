import { IArticleBody } from "@/utils/article-content/type/interfaces";
import ProjectContent from "../projectsBlock/ProjectContent";
import ProjectHeader from "../projectsBlock/ProjectHeader";
import Quote from "../quote/Quote";
import { typeSocialMediaList } from "@/data/projects/typeSocialMediaList";


function ProjectPage({project}: {project: IArticleBody}) {

  const quoteText = project?.contentBlocks?.find(item => item.contentBlockType === 'QUOTE')?.text;
  const siteLink = project?.contentBlocks?.find(item => item.contentBlockType === 'LINK_TO_SITE')?.siteUrl;

  const typeSocialMedia = project?.contentBlocks?.find(item => item.contentBlockType === 'TYPE_SOCIAL_MEDIA')?.typeSocialMedia;
  const linkSocialMedia = project?.contentBlocks?.find(item => item.contentBlockType === 'LINK_TO_SOCIAL_MEDIA')?.socialMediaUrl;
  const nameSocialMedia = typeSocialMediaList.find(item => item.value === typeSocialMedia)?.label;

  const projectSections = project?.contentBlocks?.filter(item => item.contentBlockType === 'SECTION');
  console.log('projectSections', projectSections);
  const firstTwoBlocks = projectSections?.slice(0, 2);
  const otherBlocks = projectSections?.slice(2);
  return (
    <>
      <ProjectHeader title={project.title} className="!mb-0" />
      <ProjectContent contentBlock={firstTwoBlocks} />

      {quoteText && (<div className="container mx-auto px-4">
        <Quote quote={quoteText} className="text-font-primary"/>
      </div>)}

      <div className="mb-6">
        <ProjectContent contentBlock={otherBlocks} siteLink={siteLink} nameSocialMedia={nameSocialMedia} linkSocialMedia={linkSocialMedia} />
      </div>
      {/* <div className="mb-6">
        <NewsEvents textLink="Всі новини школи" link="" titleEvents="Новини та події школи" />
      </div> */}
    </>
  );
}

export default ProjectPage;