'use client';

import Image from "next/image";

import FacebookIcon from "../icons/social/FacebookIcon";
import LinkBtn from "../shared/LinkBtn";
import ArrowRightIcon from "../icons/navigation/ArrowRightIcon";
import { useState } from "react";

import { typeSocialMediaEnum } from "@/data/projects/typeSocialMediaList";
import InstagramIcon from "../icons/social/InstagramIcon";
import YoutubeIcon from "../icons/social/YoutubeIcon";
import TelegramIcon from "../icons/social/TelegramIcon";


interface ProjectContent {
  contentBlockType: string;
  sectionTitle: string;
  text: string;
  files: [];
}

interface ProjectContentProps {
  contentBlock: ProjectContent[] | undefined;
  siteLink?: string;
  nameSocialMedia?: string;
  linkSocialMedia?: string;
}

function ProjectContent({contentBlock, siteLink, nameSocialMedia, linkSocialMedia}: ProjectContentProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div className="projectsBlock__content">
        <div className="container mx-auto px-4">
          {contentBlock?.map((content, index) => {
            const oddBlock = index % 2 !== 0;
            return (
              <div key={index} className={`flex items-center lg:flex-row flex-col lg:mb-[40px] mb-[20px] gap-x-3 ${oddBlock ? 'odd' : ''}`}>
                <div className={`flex-1 lg:pr-[64px] lg:py-[30px] pr-0 py-[20px] ${oddBlock ? 'lg:order-2 order-1 !pr-0' : ''} ${content?.files?.length === 0 ? 'lg:pl-0' : 'lg:pl-[40px]'}`}>
                  <div className="text-h3 font-ebGaramond mb-5 max-w-[530px] text-font-primary ">
                    {content?.sectionTitle}
                  </div>
                  <div>
                    <div className="text-body">
                      {content.text}
                    </div>
                    {index === 0 && siteLink && (
                      <div className="mt-6 text-font-primary text-body">Дізнатися більше:</div>
                    )}
                    {index === 0 && (siteLink || linkSocialMedia) && ( 
                      <div className="flex gap-x-4 mt-4">
                        {siteLink && (
                          <LinkBtn href={siteLink} className="px-[30px]" setIsHovered={setIsHovered}>
                            <span className="mr-1 text-medium1 inline-block mt-[-2px]">На сайт школи</span>
                            <div className="mt-[3px]">
                              <ArrowRightIcon size="20" className="hover:duration-500 duration-500" color={isHovered ? "white" : "#3D5EA7"} />
                            </div>
                          </LinkBtn>
                        )}

                        {linkSocialMedia && (
                          <LinkBtn href={linkSocialMedia} className="px-[26px]">
                            <span className="inline-block mr-1 text-medium1">На сторінку {nameSocialMedia}</span>
                            {nameSocialMedia === typeSocialMediaEnum.Facebook && <FacebookIcon size="24" />}
                            {nameSocialMedia === typeSocialMediaEnum.Instagram && <InstagramIcon size="24" />}
                            {nameSocialMedia === typeSocialMediaEnum.YouTube && <YoutubeIcon size="24" />}
                            {nameSocialMedia === typeSocialMediaEnum.Telegram && <TelegramIcon size="24" />}
                          </LinkBtn>
                        )}
                      </div>
                    )}

                    {/* {'checkList' in content && content.checkList && (
                      <div>
                        {content.checkList.map((item) => (
                          <div key={item.id} className="flex items-center text-body [&:not(:last-child)]:mb-4 text-font-primary">
                            <span className="mr-2">
                              <CheckIcon />
                            </span>
                            {item.title}
                          </div>
                        ))}
                      </div>
                    )} */}
                  </div>
                </div>
                {content?.files?.length > 0 && (<div className={`lg:w-[612px] lg:max-w-[612px] w-full ${oddBlock ? 'lg:order-1 order-2' : ''}`}>
                  <div className="relative h-[360px] w-full">
                    {content.files.map((file, idx) => (
                      <Image
                        key={idx}
                        src={file}
                        alt={content.sectionTitle}
                        fill
                        className="object-cover"
                      />
                    ))}
                  </div>
                </div>)}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ProjectContent;