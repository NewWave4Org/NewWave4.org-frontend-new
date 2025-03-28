import Image from "next/image";
import LinkWithArrow from "../shared/LinkWithArrow";
import CheckIcon from "../icons/symbolic/CheckIcon";

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
  checkList?: ProjectContentCheckList[];
}

interface ProjectContentProps {
  contentBlock: ProjectContent[];
}

function ProjectContent({contentBlock}: ProjectContentProps) {
  return (
    <>
      <div className="projectsBlock__content">
        <div className="container mx-auto px-4">
          {contentBlock.map((content, index) => {
            const oddBlock = index % 2 !== 0;
            return (
              <div key={content.id} className={`flex items-center lg:flex-row flex-col lg:mb-[40px] mb-[20px] gap-x-3 ${oddBlock ? 'odd' : ''}`}>
                <div className={`flex-1 lg:pr-[96px] lg:py-[40px] pr-0 py-[20px] ${oddBlock ? 'lg:order-2 order-1 !pr-0 lg:pl-[40px] pl-0' : ''}`}>
                  <div className="text-h3 font-ebGaramond mb-5 max-w-[530px]">
                    {content.title}
                  </div>
                  <div className="font-key">
                    {content.description}
                    
                    { 'link' in content &&  content.link && (
                      <div className="mt-6">
                        <LinkWithArrow href={content.link}>На сайт школи</LinkWithArrow>
                      </div>
                    )}

                    {'checkList' in content && content.checkList && (
                      <div>
                        {content.checkList.map((item) => (
                          <div key={item.id} className="flex items-center text-body [&:not(:last-child)]:mb-4">
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