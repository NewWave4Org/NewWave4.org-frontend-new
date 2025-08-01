'use client';
import PenIcon from "@/components/icons/symbolic/PenIcon";
import DropDown from "@/components/shared/DropDown";
import ProtectedRoute from "../../ProtectedRoute";
import Table from "@/components/ui/Table/Table";
import Button from "@/components/shared/Button";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useEffect } from "react";
import { allArticles } from "@/store/articles/action";

const articlesHeader = [
    { id: '1', title: 'Title' },
    { id: '2', title: 'Status' },
    { id: '3', title: 'Views' },
  ];

const ArticlesListPage = () => {
  const getAllArticles = useAppSelector(state => state.articles.articles);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(allArticles());
  }, [dispatch])
  console.log('allArticles', getAllArticles)
  return (
    <ProtectedRoute>
      <div className="">
        {articlesHeader?.map(item => (
          <div key={item.id}>{item.title}</div>
        ))}
        <DropDown
          icon={<PenIcon />}
          // classNameBtn=""
          classNameItem=""
          label="Add new"
          items={[
            { label: 'Article' },
            { label: 'Event' },
            { label: 'Program' },
          ]}
        />
      </div>

      <div>
        {/* <Table
          classNameRow="bg-admin-100"
          data={allArticles}
          renderHeader={() => (
            <>
              <th className="pl-[45px] pb-4 border-b border-admin-300">Title</th>
              <th className="pb-4 border-b  border-admin-300">Status</th>
              <th className="pb-4 border-b  border-admin-300">Views</th>
              <th className="pb-4 border-b  border-admin-300 flex justify-end">Actions</th>
            </>
          )}

          renderRow={article => {
            return (
              <>
                <td>

                </td>
              </>
            )
          }}
        /> */}

      </div>
    </ProtectedRoute>
  );
};

export default ArticlesListPage;