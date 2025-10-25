import ProjectContent from '@/components/projectPage/ProjectContent';
import ProjectHeader from '@/components/projectPage/ProjectHeader';
import Quote from '@/components/quote/Quote';
import { typeSocialMediaList } from '@/data/projects/typeSocialMediaList';
import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';

function ProjectPreview({ project }: { project: GetArticleByIdResponseDTO | undefined }) {
  const quoteText = project?.contentBlocks?.find(item => item.contentBlockType === 'QUOTE')?.text;
  const siteLink = project?.contentBlocks?.find(item => item.contentBlockType === 'LINK_TO_SITE')?.siteUrl;

  const typeSocialMedia = project?.contentBlocks?.find(item => item.contentBlockType === 'TYPE_SOCIAL_MEDIA')?.typeSocialMedia;
  const linkSocialMedia = project?.contentBlocks?.find(item => item.contentBlockType === 'LINK_TO_SOCIAL_MEDIA')?.socialMediaUrl;
  const nameSocialMedia = typeSocialMediaList.find(item => item.value === typeSocialMedia)?.label;

  const projectSections = project?.contentBlocks?.filter(item => item.contentBlockType === 'SECTION');

  const projectVideoUrl = project?.contentBlocks?.find(item => item.contentBlockType === 'VIDEO')?.videoUrl;

  const firstTwoBlocks = projectSections?.slice(0, 2);
  const otherBlocks = projectSections?.slice(2);

  return (
    <div className="bg-background-primary">
      <ProjectHeader title={project?.title} className="!mb-0" />
      <ProjectContent contentBlock={firstTwoBlocks} />
      {quoteText && <Quote quote={quoteText} className="text-font-primary" />}
      <ProjectContent contentBlock={otherBlocks} siteLink={siteLink} nameSocialMedia={nameSocialMedia} linkSocialMedia={linkSocialMedia} projectVideoUrl={projectVideoUrl} />
    </div>
  );
}

export default ProjectPreview;
