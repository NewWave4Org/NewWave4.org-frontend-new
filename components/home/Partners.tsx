'use client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string()
    .required('Required')
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i, 'Invalid email format'),
});

const Partners: React.FC = () => {
  return (
    <section className="sponsors">
      <h4 className="preheader">Стати партнером</h4>
      <div className="flex gap-x-[108px]">
        <div className="partners-text">
          <h4 className="text-h4 text-font-accent font-bask">
            Ми можемо зміцнювати Україну разом
          </h4>
          <p className="text-body text-font-primary">
            Спільними зусиллями ми можемо розвивати освітньо-культурні програми
            та інформаційно-соціальні центри, створювати майданчики для
            зустрічей і співпраці, допомагати та підтримувати одні одних та
            Україну у боротьбі з ворогом нашої держави та у її розбудові.
          </p>
        </div>
        <div className="partners-form">
          <p className="text-body text-grey-700">
            Залиште свій email та ми з Вами зв’яжемось
          </p>
          <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              console.log(values);
              setSubmitting(false);
              alert('Form submitted successfully!');
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex space-y-4">
                <div>
                  <label htmlFor="email" className="text-medium2 text-grey-500">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default Partners;
