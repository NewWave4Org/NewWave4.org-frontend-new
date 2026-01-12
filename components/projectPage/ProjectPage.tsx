import { IArticleBody } from '@/utils/article-content/type/interfaces';
import ProjectContent from './ProjectContent';
import ProjectHeader from './ProjectHeader';
import Quote from '../quote/Quote';
import { typeSocialMediaList } from '@/data/projects/typeSocialMediaList';
import { convertYoutubeUrlToEmbed } from '@/utils/videoUtils';
import NewsEvents from '../home/NewsEvents';
import { useTranslations } from 'next-intl';

type IProjectProps = IArticleBody & { titleToShow?: string; contentBlockToShow?: any[] }

function ProjectPage({ project, relevantProjectId }: { project: IProjectProps; relevantProjectId: number }) {
  const t = useTranslations();

  const videoLink = project?.contentBlockToShow?.find(item => item.contentBlockType === 'VIDEO')?.videoUrl;
  const embedUrl = convertYoutubeUrlToEmbed(videoLink);

  const quoteText = project?.contentBlockToShow?.find(item => item.contentBlockType === 'QUOTE');
  const siteLink = project?.contentBlockToShow?.find(item => item.contentBlockType === 'LINK_TO_SITE')?.siteUrl;

  const typeSocialMedia = project?.contentBlockToShow?.find(item => item.contentBlockType === 'SOCIAL_MEDIA')?.typeSocialMedia;
  const linkSocialMedia = project?.contentBlockToShow?.find(item => item.contentBlockType === 'SOCIAL_MEDIA')?.socialMediaUrl;
  const nameSocialMedia = typeSocialMediaList.find(item => item.value === typeSocialMedia)?.label;

  const projectSections = project?.contentBlockToShow?.filter(item => item.contentBlockType === 'SECTION');
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
    <div className="project-section" id={`project-${project.id}`}>
      <ProjectHeader title={project?.titleToShow} />
      <ProjectContent contentBlock={firstTwoBlocks} siteLink={siteLink} nameSocialMedia={nameSocialMedia} linkSocialMedia={linkSocialMedia} showLinksInIndex={!linkInOtherBlocks ? linkBlockIndex : null} />

      {quoteText && quoteText?.translatable_text_editorState !== null && (
        <div className="container mx-auto px-4">
          <Quote quote={quoteText} className="text-font-primary" />
        </div>
      )}

      {otherBlocks && otherBlocks?.length > 0 && (
        <div className="mb-6">
          <ProjectContent contentBlock={otherBlocks} siteLink={siteLink} nameSocialMedia={nameSocialMedia} linkSocialMedia={linkSocialMedia} showLinksInIndex={linkInOtherBlocks ? linkBlockIndex : null} />
        </div>
      )}

      {videoLink && embedUrl && (
        <div className="container mx-auto px-4 py-16">
          <div className="mb-6">
            <iframe src={embedUrl} allowFullScreen loading="lazy" className="rounded-2xl w-full lg:h-[640px] sm:h-auto aspect-video" />
          </div>
        </div>
      )}

      <NewsEvents textLink='projects_page.all_project_new' link="/news" titleEvents='projects_page.news_events_project' projectId={relevantProjectId} />
    </div>
  );
}

export default ProjectPage;
