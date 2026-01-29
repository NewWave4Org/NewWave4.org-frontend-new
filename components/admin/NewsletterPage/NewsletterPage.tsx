'use client';

import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import TextArea from "@/components/shared/TextArea";
import { sendNewsletter } from "@/store/newsletter/action";
import { NewsletterRequestDTO } from "@/utils/newsletter/type/interface";
import useHandleThunk from "@/utils/useHandleThunk";
import { Form, Formik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from 'yup';

const validationSchema = Yup.object({
  subject: Yup.string().required('Subject is required'),
  newsTitle: Yup.string().required('News title is required'),
  newsBody: Yup.string().required('News body is required'),
});

function NewsletterPage() {
  const handleThunk = useHandleThunk();
  const [submitError, setSubmitError] = useState('');

  async function handleSubmit(data: NewsletterRequestDTO) {
    console.log('data', data);

    try {
      const result = await handleThunk(sendNewsletter, data, setSubmitError);
      toast.success(result);
    } catch (error: any) {
      console.log('error', error);
      toast.error('Failed to send newsletter');
    }

    console.log('submitError', submitError);
  }


  const initialValues = {
    subject: "",
    newsTitle: "",
    newsBody: ""
  };


  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
      {({handleChange, values, touched, errors, isSubmitting}) => {
        return (
          <Form>
            <div className='mb-5'>
              <Input
                id="subject"
                name="subject"
                type="text"
                className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                onChange={handleChange}
                value={values.subject}
                label="Email subject"
                required
                labelClass="mb-2 !text-admin-700"
                validationText={
                  touched.subject && errors.subject
                    ? (errors.subject as string)
                    : ''
                }
              />
            </div>
            <div className='mb-5'>
              <Input
                id="newsTitle"
                name="newsTitle"
                type="text"
                required
                className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                onChange={handleChange}
                value={values.newsTitle}
                label="News title"
                labelClass="mb-2 !text-admin-700"
                validationText={
                  touched.newsTitle && errors.newsTitle
                    ? (errors.newsTitle as string)
                    : ''
                }
              />
            </div>
            <div className='mb-5'>
              <TextArea
                id="newsBody"
                label="News text"
                required
                className="!bg-background-light w-full h-[300px] px-5 rounded-lg !ring-0 !max-w-full"
                labelClass="!text-admin-700"
                value={values.newsBody}
                onChange={handleChange}
                 validationText={
                  touched.newsBody && errors.newsBody
                    ? (errors.newsBody as string)
                    : ''
                }
              />
            </div>

            <Button
              type="submit"
              title={isSubmitting ? 'Submitting...' : ''}
              disabled={isSubmitting}
              className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8] duration-500"
            >
              Send
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
}

export default NewsletterPage;