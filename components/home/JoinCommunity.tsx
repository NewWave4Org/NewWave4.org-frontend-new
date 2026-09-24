import { convertDraftToHTML } from '../TextEditor/utils/convertDraftToHTML';
import { useLocale, useTranslations } from 'next-intl';

interface IJoinCommunity {
  translatable_text_title: string;
  translatable_text_description: string;
  translatable_text_editorState: any;
  className?: string;
}

const JoinCommunity = ({ joinUs }: { joinUs: IJoinCommunity[] }) => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="our-mission lg:my-10 my-5 py-14 bg-skyBlue-300">
      <div className="container mx-auto px-4">
        <h4 className="lg:text-[34px] text-[38px] mb-10 text-center md:text-left mx-auto !text-font-primary lora-family font-bold">
          {t('sections_title.join_us')}
        </h4>
        <div className="flex flex-col items-top lg:gap-16 gap-5 lg:flex-row lg:justify-between">
          {joinUs?.map((item, i) => {
            const joinDescriptionText = convertDraftToHTML(
              item?.translatable_text_editorState,
              locale,
            );
            return (
              <div
                key={i}
                className="flex w-full flex-col items-center lg:w-1/3 px-2 lg:px-0"
              >
                <h4 className="mb-4 text-font-accent text-center lg:text-[28px] text-[29px] lora-family gap-4 font-bold">
                  {item.translatable_text_title}
                </h4>
                {/* div, not p: convertDraftToHTML emits block-level <p> wrappers,
                    and <p> inside <p> is invalid HTML. The browser auto-closes the
                    outer one, leaving DOM React's tree doesn't match — a React 19
                    hydration error (#418), which throws where React 18 only warned. */}
                <div
                  className="text-font-primary text-base text-justify"
                  dangerouslySetInnerHTML={{ __html: joinDescriptionText }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JoinCommunity;
