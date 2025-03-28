const ProjectHeader = ({title, className=''}: {title: string, className?: string}) => {
  return (
    <div className={`lg:mb-[40px] mb-[20px] ${className}`}>
      <div className="projectsBlock__header bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="text-3xl lg:text-h2 font-ebGaramond projectsBlock__title text-center max-w-[830px] mx-auto py-[38px]">
            {title}
          </div>  
        </div> 
      </div>
    </div>
  );
};

export default ProjectHeader;