'use client';

import Input from "@/components/shared/Input";
import Select from "@/components/shared/Select";
import { Option } from "@/components/shared/SelectLocale";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { newArticleDTO } from "../../Articles/ArticleForm";

interface AuthorFieldProps {
  usersList: Option[];
  defaultValue?: number | string;
}

// function AuthorField({ usersList, defaultValue }: AuthorFieldProps) {
//   const [isManual, setIsManual] = useState(false);
//   const { values, touched, errors, handleChange, setFieldValue } = useFormikContext<newArticleDTO>();

//   const handleToggle = () => {
//     setIsManual(prev => !prev);
//     setFieldValue('authorName', undefined);
//   };

//   useEffect(() => {
//     if (defaultValue === undefined) return;
//     if (usersList.length === 0) return;

//     const inList = usersList.some(u => u.label === defaultValue);
//     setIsManual(!inList);

//     if (inList) {
//       const user = usersList.find(u => u.label === defaultValue);
//       setFieldValue('authorName', user?.label);
//     } else {
//       setFieldValue('authorName', defaultValue);
//     }
//   }, [defaultValue, usersList]);

//   return (
//     <div className="mb-5">
//       <div className="mb-2">Change Author (if needed)</div>
//         <Select
//           label="Author (select from list)"
//           adminSelectClass
//           name="authorName"
//           required
//           labelClass="!text-admin-700"
//           onChange={handleChange}
//           options={usersList.map(u => ({ value: u.label, label: u.label }))}
//         />

//         <div className="my-2 text-sm text-grey-500">or</div>

//         <Input
//           onChange={handleChange}
//           id="authorName"
//           name="authorName"
//           type="text"
//           className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
//           value={values.authorName ?? ''}
//           label="Author (enter manually)"
//           labelClass="!text-admin-700"
//           validationText={
//             touched.authorName && errors.authorName
//               ? String(errors.authorName)
//               : ''
//           }
//         />
//     </div>
//   );
// };

function AuthorField({ usersList, defaultValue }: AuthorFieldProps) {
  const { values, touched, errors, handleChange, setFieldValue } = useFormikContext<newArticleDTO>();

  useEffect(() => {
    if (defaultValue === undefined) return;
    if (usersList.length === 0) return;

    setFieldValue('authorName', defaultValue);
  }, [defaultValue, usersList]);

  return (
    <div className="p-4 shadow-lg rounded-2xl m-1">
      <div className="mb-3 text-lg">Change Author (if needed)</div>
      <Select
        label="Author (select from list)"
        adminSelectClass
        name="authorName"
        labelClass="!text-admin-700"
        onChange={handleChange}
        options={usersList.map(u => ({ value: u.label, label: u.label }))}
      />

      <div className="my-2 text-sm text-grey-500">or</div>

      <Input
        onChange={e => {
          setFieldValue('authorName', e.target.value);
        }}
        id="authorName-manual"
        name="authorName-manual"
        label="Enter manually"
        type="text"
        className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
        value={
          usersList.some(u => u.label === values.authorName)
            ? ''
            : values.authorName ?? ''
        }
        labelClass="!text-admin-700"
        validationText={
          touched.authorName && errors.authorName
            ? String(errors.authorName)
            : ''
        }
      />
    </div>
  );
}

export default AuthorField;