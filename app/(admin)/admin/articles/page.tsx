import PenIcon from "@/components/icons/symbolic/PenIcon";
import DropDown from "@/components/shared/DropDown";

const ArticlesListPage = () => {
  const articlesHeader = [
    {id: '1', title: 'Title'},
    {id: '2', title: 'Status'},
    {id: '3', title: 'Views'},
  ];
  return (
    <div>
      <div className="">
        {articlesHeader?.map(item => (
          <div key={item.id}>{item.title}</div>
        ))}
        <DropDown 
          icon={<PenIcon />}
          classNameBtn=""
          classNameItem=""
          label="Add new"
          items={[
            {label: 'Article'},
            {label: 'Event'},
            {label: 'Program'},
          ]}
        />
      </div>

      <div>

      </div>
    </div>
  );
};

export default ArticlesListPage;