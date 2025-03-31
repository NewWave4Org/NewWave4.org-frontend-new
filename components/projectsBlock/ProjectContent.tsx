'use client';

import Image from "next/image";
import CheckIcon from "../icons/symbolic/CheckIcon";
import FacebookIcon from "../icons/social/FacebookIcon";
import LinkBtn from "../shared/LinkBtn";
import ArrowRightIcon from "../icons/navigation/ArrowRightIcon";
import { useState } from "react";

interface ProjectContentCheckList {
  id: number;
  title: string;
}

interface ProjectContent {
  id: number;
  title: string;
  description?: string;
  image: string;
  link?: string;
  fbLink?: string;
  checkList?: ProjectContentCheckList[];
}

interface ProjectContentProps {
  contentBlock: ProjectContent[];
}

function ProjectContent({contentBlock}: ProjectContentProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div className="projectsBlock__content">
        <div className="container mx-auto px-4">
          {contentBlock.map((content, index) => {
            const oddBlock = index % 2 !== 0;
            return (
              <div key={content.id} className={`flex items-center lg:flex-row flex-col lg:mb-[40px] mb-[20px] gap-x-3 ${oddBlock ? 'odd' : ''}`}>
                <div className={`flex-1 lg:pr-[64px] lg:py-[30px] pr-0 py-[20px] ${oddBlock ? 'lg:order-2 order-1 !pr-0 lg:pl-[40px] pl-0' : ''}`}>
                  <div className="text-h3 font-ebGaramond mb-5 max-w-[530px] text-font-primary ">
                    {content.title}
                  </div>
                  <div>
                    <div className="text-body">
                      {content.description}
                    </div>
                    
                    <div className="mt-6 text-font-primary text-body">Дізнатися більше:</div>
                    <div className="flex gap-x-4 mt-6">
                      { 'link' in content &&  content.link && (
                        <LinkBtn href={content.link} className="px-[30px]" setIsHovered={setIsHovered}>
                          <span className="mr-1 text-medium1 inline-block mt-[-2px]">На сайт школи</span>
                          <div className="mt-[3px]">
                            <ArrowRightIcon size="20" className="hover:duration-500 duration-500" color={isHovered ? "white" : "#3D5EA7"} />
                          </div>
                        </LinkBtn>
                      )}

                      { 'fbLink' in content &&  content.fbLink && (
                        <LinkBtn href={content.fbLink} className="px-[26px]">
                          <span className="inline-block mr-1 text-medium1">На сторінку Facebook</span>
                          <FacebookIcon size="24" />
                        </LinkBtn>
                      )}
                    </div>

                    {'checkList' in content && content.checkList && (
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
                    )}
                    
                  </div>
                </div>
                <div className={`lg:w-[612px] lg:max-w-[612px] w-full ${oddBlock ? 'lg:order-1 order-2' : ''}`}>
                  <div className="relative h-[360px] w-full">
                   
                      <Image
                        src={content.image}
                        alt={content.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                   
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ProjectContent;