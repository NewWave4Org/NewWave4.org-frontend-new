import ProjectContent from '@/components/projectPage/ProjectContent';
import ProjectHeader from '@/components/projectPage/ProjectHeader';
import Quote from '@/components/quote/Quote';
import { typeSocialMediaList } from '@/data/projects/typeSocialMediaList';
import { GetArticleByIdResponseDTO } from '@/utils/article-content/type/interfaces';

function ProjectPreview({ project }: { project: GetArticleByIdResponseDTO | undefined }) {
  const quoteText = project?.contentBlocks?.find(item => item.contentBlockType === 'QUOTE');

  const siteLink = project?.contentBlocks?.find(item => item.contentBlockType === 'LINK_TO_SITE')?.siteUrl;

  const typeSocialMedia = project?.contentBlocks?.find(item => item.contentBlockType === 'SOCIAL_MEDIA')?.typeSocialMedia;
  const linkSocialMedia = project?.contentBlocks?.find(item => item.contentBlockType === 'SOCIAL_MEDIA')?.socialMediaUrl;
  const nameSocialMedia = typeSocialMediaList.find(item => item.value === typeSocialMedia)?.label;

  const projectSections = project?.contentBlocks?.filter(item => item.contentBlockType === 'SECTION');

  const projectVideoUrl = project?.contentBlocks?.find(item => item.contentBlockType === 'VIDEO')?.videoUrl;

  const firstTwoBlocks = projectSections?.slice(0, 2);
  const otherBlocks = projectSections?.slice(2);

  let linkBlockIndex: number | null = null;
  let linkInOtherBlocks = false;

  if (otherBlocks && otherBlocks.length > 0) {
    linkBlockIndex = 0;
    linkInOtherBlocks = true;
  } else if (firstTwoBlocks && firstTwoBlocks.length === 1) {
    linkBlockIndex = 0;
  } else if (firstTwoBlocks && firstTwoBlocks.length === 2) {
    linkBlockIndex = 1;
  }

  return (
    <div className="bg-background-primary">
      <ProjectHeader title={project?.title} className="!mb-0" />

      <ProjectContent contentBlock={firstTwoBlocks} siteLink={siteLink} nameSocialMedia={nameSocialMedia} linkSocialMedia={linkSocialMedia} showLinksInIndex={!linkInOtherBlocks ? linkBlockIndex : null} />

      {quoteText && quoteText?.translatable_text_editorState !== null && (<Quote quote={quoteText} className="text-font-primary" />)}

      <ProjectContent
        contentBlock={otherBlocks}
        siteLink={siteLink}
        nameSocialMedia={nameSocialMedia}
        linkSocialMedia={linkSocialMedia}
        projectVideoUrl={projectVideoUrl}
        showLinksInIndex={!linkInOtherBlocks ? linkBlockIndex : null}
      />
    </div>
  );
}

export default ProjectPreview;
