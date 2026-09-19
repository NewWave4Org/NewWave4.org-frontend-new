'use client';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import TextArea from '@/components/shared/TextArea';
import { sendNewsletter, sendNewsletterTest } from '@/store/newsletter/action';
import { NewsletterRequestDTO } from '@/utils/newsletter/type/interface';
import useHandleThunk from '@/utils/useHandleThunk';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  subject: Yup.string().required('Subject is required'),
  newsTitle: Yup.string().required('News title is required'),
  newsBody: Yup.string().required('News body is required'),
});

function NewsletterPage() {
  const handleThunk = useHandleThunk();
  const [submitError, setSubmitError] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);

  async function handleSubmit(data: NewsletterRequestDTO) {
    try {
      const result = await handleThunk(sendNewsletter, data, setSubmitError);
      toast.success(result);
    } catch (error: any) {
      console.error('error', error);
      toast.error('Failed to send newsletter');
    }

    console.error('submitError', submitError);
  }

  // Same payload, but the backend mails only the logged-in admin. Use this before
  // "Send": a broadcast goes to every subscriber and cannot be recalled.
  async function handleSendTest(data: NewsletterRequestDTO) {
    setIsSendingTest(true);
    try {
      const result = await handleThunk(
        sendNewsletterTest,
        data,
        setSubmitError,
      );
      toast.success(result);
    } catch (error: any) {
      console.error('error', error);
      toast.error('Failed to send test newsletter');
    } finally {
      setIsSendingTest(false);
    }
  }

  const initialValues = {
    subject: '',
    newsTitle: '',
    newsBody: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({
        handleChange,
        values,
        touched,
        errors,
        isSubmitting,
        validateForm,
        setTouched,
      }) => {
        return (
          <Form>
            <div className="mb-5">
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
            <div className="mb-5">
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
            <div className="mb-5">
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

            <div className="flex gap-4">
              <Button
                type="button"
                title="Sends this newsletter only to your own email address"
                disabled={isSubmitting || isSendingTest}
                onClick={async () => {
                  const formErrors = await validateForm();
                  if (Object.keys(formErrors).length > 0) {
                    setTouched({
                      subject: true,
                      newsTitle: true,
                      newsBody: true,
                    });
                    return;
                  }
                  await handleSendTest(values);
                }}
                className="!bg-transparent !text-background-darkBlue border border-background-darkBlue !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8] duration-500"
              >
                {isSendingTest ? 'Sending test...' : 'Send test to me'}
              </Button>
              <Button
                type="submit"
                title={
                  isSubmitting ? 'Submitting...' : 'Sends to every subscriber'
                }
                disabled={isSubmitting || isSendingTest}
                className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8] duration-500"
              >
                Send
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default NewsletterPage;
