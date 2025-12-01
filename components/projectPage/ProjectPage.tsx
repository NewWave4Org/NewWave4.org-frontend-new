import { IArticleBody } from '@/utils/article-content/type/interfaces';
import ProjectContent from './ProjectContent';
import ProjectHeader from './ProjectHeader';
import Quote from '../quote/Quote';
import { typeSocialMediaList } from '@/data/projects/typeSocialMediaList';
import { convertYoutubeUrlToEmbed } from '@/utils/videoUtils';
import NewsEvents from '../home/NewsEvents';

function ProjectPage({ project, relevantProjectId }: { project: IArticleBody; relevantProjectId: number }) {
  const videoLink = project?.contentBlocks?.find(item => item.contentBlockType === 'VIDEO')?.videoUrl;
  const embedUrl = convertYoutubeUrlToEmbed(videoLink);

  const quoteText = project?.contentBlocks?.find(item => item.contentBlockType === 'QUOTE');
  const siteLink = project?.contentBlocks?.find(item => item.contentBlockType === 'LINK_TO_SITE')?.siteUrl;

  const typeSocialMedia = project?.contentBlocks?.find(item => item.contentBlockType === 'SOCIAL_MEDIA')?.typeSocialMedia;
  const linkSocialMedia = project?.contentBlocks?.find(item => item.contentBlockType === 'SOCIAL_MEDIA')?.socialMediaUrl;
  const nameSocialMedia = typeSocialMediaList.find(item => item.value === typeSocialMedia)?.label;

  const projectSections = project?.contentBlocks?.filter(item => item.contentBlockType === 'SECTION');
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
    <>
      <ProjectHeader title={project.title} className="!mb-0" />
      <ProjectContent contentBlock={firstTwoBlocks} siteLink={siteLink} nameSocialMedia={nameSocialMedia} linkSocialMedia={linkSocialMedia} showLinksInIndex={!linkInOtherBlocks ? linkBlockIndex : null} />

      {quoteText && (
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

      <NewsEvents textLink="Всі новини проєкту" link="/news" titleEvents="Новини та події проєкту" projectId={relevantProjectId} />
    </>
  );
}

export default ProjectPage;
