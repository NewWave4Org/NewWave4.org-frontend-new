import ProjectContent from "@/components/projectsBlock/ProjectContent";
import ProjectHeader from "@/components/projectsBlock/ProjectHeader";
import Quote from "@/components/quote/Quote";
import { typeSocialMediaList } from "@/data/projects/typeSocialMediaList";
import { GerArticleByIdResponseDTO } from "@/utils/article-content/type/interfaces";

function ProjectPreview({project}: {project: GerArticleByIdResponseDTO | undefined}) {
  const videoLink = project?.contentBlocks?.find(item => item.contentBlockType === 'VIDEO')?.videoUrl;
  const quoteText = project?.contentBlocks?.find(item => item.contentBlockType === 'QUOTE')?.text;
  const siteLink = project?.contentBlocks?.find(item => item.contentBlockType === 'LINK_TO_SITE')?.siteUrl;

  const typeSocialMedia = project?.contentBlocks?.find(item => item.contentBlockType === 'TYPE_SOCIAL_MEDIA')?.typeSocialMedia;
  const linkSocialMedia = project?.contentBlocks?.find(item => item.contentBlockType === 'LINK_TO_SOCIAL_MEDIA')?.socialMediaUrl;
  const nameSocialMedia = typeSocialMediaList.find(item => item.value === typeSocialMedia)?.label;

  const projectSections = project?.contentBlocks?.filter(item => item.contentBlockType === 'SECTION')

  const firstTwoBlocks = projectSections?.slice(0, 2);
  const otherBlocks = projectSections?.slice(2);

  return (
    <div className="bg-background-primary">
      <ProjectHeader title={project?.title} className="!mb-0" />
      <ProjectContent contentBlock={firstTwoBlocks} />
      {quoteText && <Quote quote={quoteText} className="text-font-primary"/>}
      <ProjectContent contentBlock={otherBlocks}  siteLink={siteLink} nameSocialMedia={nameSocialMedia} linkSocialMedia={linkSocialMedia} />
    </div>
  );
}

export default ProjectPreview;