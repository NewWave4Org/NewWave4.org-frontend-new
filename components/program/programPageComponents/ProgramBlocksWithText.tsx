function ProgramBlocksWithText({ contentBlock }: { contentBlock: any[] }) {
  return (
    <>
      <div className="content">
        <div className="container mx-auto px-4">
          {contentBlock?.map((content, index) => {
            return (
              <div key={index} className="pt-3 lg:mb-20 mb-10">
                <div className="text-h3 font-ebGaramond mb-5 max-w-[530px] text-font-primary ">{content?.sectionTitle}</div>
                <div className="flex gap-3">
                  <div className="text-body w-1/2">{content.text1}</div>
                  <div className="text-body w-1/2">{content.text2}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ProgramBlocksWithText;
