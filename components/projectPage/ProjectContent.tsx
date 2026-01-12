'use client';

import Image from 'next/image';

import { convertYoutubeUrlToEmbed } from '@/utils/videoUtils';
import ProjectContentLinks from './ProjectContentLinks';
import { convertDraftToHTML } from '../TextEditor/utils/convertDraftToHTML';

interface ProjectContent {
  id: string;
  contentBlockType: string;
  translatable_text_sectionTitle: string;
  translatable_text_text: string;
  files: [];
  translatable_text_editorState?: any;
}

interface ProjectContentProps {
  contentBlock: ProjectContent[] | undefined;
  siteLink?: string;
  nameSocialMedia?: string;
  linkSocialMedia?: string;
  projectVideoUrl?: string;
  showLinksInIndex?: number | null;
}

function ProjectContent({ contentBlock, siteLink, nameSocialMedia, linkSocialMedia, projectVideoUrl, showLinksInIndex }: ProjectContentProps) {
  const videoLink = convertYoutubeUrlToEmbed(projectVideoUrl!);

  return (
    <>
      <div className="projectsBlock__content">
        <div className="container mx-auto px-4">
          {contentBlock?.map((content, index) => {
            const oddBlock = index % 2 !== 0;
            const htmlText = convertDraftToHTML(content?.translatable_text_editorState);

            return (
              <div key={index} className={`flex items-center lg:flex-row flex-col lg:mb-[40px] mb-[20px] gap-x-3 ${oddBlock ? 'odd' : ''}`}>
                <div className={`flex-1 lg:pr-[64px] lg:py-[30px] pr-0 py-[20px] ${oddBlock ? 'lg:order-2 order-1 !pr-0 lg:pl-[40px]' : ''}`}>
                  <div className="text-h3 font-ebGaramond mb-5 max-w-[530px] text-font-primary ">{content?.translatable_text_sectionTitle}</div>
                  <div>
                    <div className="text-body text-font-primary">
                      <div dangerouslySetInnerHTML={{ __html: htmlText }} />
                    </div>

                    {showLinksInIndex === index && (siteLink || linkSocialMedia) && (
                      <ProjectContentLinks siteLink={siteLink} nameSocialMedia={nameSocialMedia} linkSocialMedia={linkSocialMedia} index={index} showLinksInIndex={showLinksInIndex} />
                    )}
                  </div>
                </div>
                {content?.files?.length > 0 && (
                  <div className={`lg:w-[612px] lg:max-w-[612px] w-full ${oddBlock ? 'lg:order-1 order-2' : ''}`}>
                    <div className="relative h-[360px] w-full">
                      {content.files.map((file, idx) => (
                        <Image key={idx} src={file} alt={content.translatable_text_sectionTitle} fill className="object-cover rounded-xl" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {videoLink && projectVideoUrl && <iframe src={videoLink} allowFullScreen loading="lazy" className="rounded-2xl w-full lg:h-[640px] sm:h-auto aspect-video" />}
        </div>
      </div>
    </>
  );
}

export default ProjectContent;
