import React, { useEffect, useState } from "react";
import { GlobalSectionsType } from "./enum/types";
import { IGlobalSectionsResponseDTO } from "@/utils/global-sections/type/interfaces";
import { FieldArray, Form, Formik } from "formik";
import Accordion from "@/components/ui/Accordion/Accordion";
import Input from "@/components/shared/Input";
import { v4 as uuid } from 'uuid';
import ImageLoading from "../helperComponents/ImageLoading/ImageLoading";
import BasketIcon from "@/components/icons/symbolic/BasketIcon";
import Button from "@/components/shared/Button";
import Select from "@/components/shared/Select";
import { typeSocialMediaList } from "@/data/projects/typeSocialMediaList";
import { toast } from "react-toastify";
import { createdGlobalSection, getGlobalSectionByKey, updateGlobalSection } from "@/store/global-sections/action";
import useHandleThunk from "@/utils/useHandleThunk";
import useImageLoading from "../helperComponents/ImageLoading/hook/useImageLoading";
import { useAppDispatch } from "@/store/hook";

interface ITeamFormValues {
  title: string;
  key: string;
  contentBlocks: {
    contentBlockType: string;
    files: any[];
    sectionTitleUA: string;
    sectionTitleENG: string;
    sectionLocationUA: string;
    sectionLocationENG: string;
    sectionPositionUA: string;
    sectionPositionENG: string;
    typeSocialMedia: string;
    socialMediaUrl: string;
  }[];
}

const defaultFormValues = {
  title: 'Our partners',
  key: `${GlobalSectionsType.OUR_PARTNERS}`,
  contentBlocks: [{ 
    id: uuid(), 
    contentBlockType: 'SECTION', 
    files: [], 
    sectionTitleUA: '', 
    sectionTitleENG: '', 
    sectionLocationUA: '', 
    sectionLocationENG: '', 
    sectionPositionUA: '', 
    sectionPositionENG: '', 
    typeSocialMedia: '', 
    socialMediaUrl: '' 
  }],
};

function OurTeam() {
  const dispatch = useAppDispatch();

  const [ourTeam, setOurTeam] = useState<IGlobalSectionsResponseDTO | null>(null);
  const [submitError, setSubmitError] = useState('');
  const handleThunk = useHandleThunk();

  const { deleteFile } = useImageLoading({
    isAttach: true,
  });

  const initialValues = {
    title: 'Our team',
    key: `${GlobalSectionsType.OUR_TEAM}`,
    contentBlocks: ourTeam?.contentBlocks && ourTeam?.contentBlocks.length ? ourTeam?.contentBlocks : defaultFormValues.contentBlocks,
  };

  const isUpdate = Boolean(ourTeam?.key);

  useEffect(() => {
      async function getBlockByKey() {
        try {
          const result = await dispatch(getGlobalSectionByKey(GlobalSectionsType.OUR_TEAM)).unwrap();
  
          setOurTeam(result);
        } catch (error: any) {
          if (error.original.errors[0].includes('with key') || error.original.errors[0].includes('find page')) {
            console.log('Section does not exist yet → creating new one');
            setOurTeam(null);
            return;
          }
  
          console.log('error', error);
          toast.error('Failed to fetch partners');
        }
      }
  
      getBlockByKey();
    }, [dispatch]);
  

  async function handleSubmit(values: ITeamFormValues) {
    try {
      let result;

      if (isUpdate) {
        // UPDATE
        result = await handleThunk(updateGlobalSection, { id: ourTeam!.id, data: values }, setSubmitError);
      } else {
        // CREATE
        result = await handleThunk(createdGlobalSection, values, setSubmitError);
      }

      if (result) {
        setOurTeam(result);
        setSubmitError('');
        toast.success(isUpdate ? 'Section updated successfully!' : 'Section created successfully!');
      }
    } catch (error) {
      toast.error(`Something went wrong! ${error}`);
    }
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ handleChange, isSubmitting, values, setFieldValue }) => (
        <Form>
          <FieldArray name="contentBlocks">
            {({ push, remove }) => {
              const initialBlocks = values.contentBlocks?.slice(0, 1) || [];
              const additionalBlocks = values.contentBlocks?.slice(1) || [];

              return (
                <>
                  {initialBlocks.map(block => {
                    const blockIndex = values.contentBlocks.findIndex(item => item.id === block.id);
                    return (
                      <React.Fragment key={block.id}>
                        <div className="mb-5">
                          <Accordion title={`Section #1 - ${block.sectionTitleUA}`} classNameTop="min-h-14">
                            <div>
                              <div className="mb-4">
                                <Input
                                  onChange={handleChange}
                                  id={`contentBlocks.${blockIndex}.sectionTitleUA`}
                                  name={`contentBlocks.${blockIndex}.sectionTitleUA`}
                                  type="text"
                                  className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                  value={block.sectionTitleUA}
                                  label="Name UA"
                                  labelClass="!text-admin-700"
                                />
                              </div>
                              <div className="mb-4">
                                <Input
                                  onChange={handleChange}
                                  id={`contentBlocks.${blockIndex}.sectionTitleENG`}
                                  name={`contentBlocks.${blockIndex}.sectionTitleENG`}
                                  type="text"
                                  className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                  value={block.sectionTitleENG}
                                  label="Name ENG"
                                  labelClass="!text-admin-700"
                                />
                              </div>

                              <div className="mb-4">
                                <Input
                                  onChange={handleChange}
                                  id={`contentBlocks.${blockIndex}.sectionLocationUA`}
                                  name={`contentBlocks.${blockIndex}.sectionLocationUA`}
                                  type="text"
                                  className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                  value={block.sectionLocationUA}
                                  label="Location UA"
                                  labelClass="!text-admin-700"
                                />
                              </div>
                              <div className="mb-4">
                                <Input
                                  onChange={handleChange}
                                  id={`contentBlocks.${blockIndex}.sectionLocationENG`}
                                  name={`contentBlocks.${blockIndex}.sectionLocationENG`}
                                  type="text"
                                  className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                  value={block.sectionLocationENG}
                                  label="Location ENG"
                                  labelClass="!text-admin-700"
                                />
                              </div>

                              <div className="mb-4">
                                <Input
                                  onChange={handleChange}
                                  id={`contentBlocks.${blockIndex}.sectionPositionUA`}
                                  name={`contentBlocks.${blockIndex}.sectionPositionUA`}
                                  type="text"
                                  className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                  value={block.sectionPositionUA}
                                  label="Position UA"
                                  labelClass="!text-admin-700"
                                />
                              </div>
                              <div className="mb-4">
                                <Input
                                  onChange={handleChange}
                                  id={`contentBlocks.${blockIndex}.sectionPositionENG`}
                                  name={`contentBlocks.${blockIndex}.sectionPositionENG`}
                                  type="text"
                                  className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                  value={block.sectionPositionENG}
                                  label="Position ENG"
                                  labelClass="!text-admin-700"
                                />
                              </div>

                              <div className="flex gap-4 mb-4">
                                <div className="w-1/2 mb-4">
                                  <Select
                                    label="Change type social media (if needed)"
                                    adminSelectClass={true}
                                    name={`contentBlocks.${blockIndex}.typeSocialMedia`}
                                    labelClass="!text-admin-700"
                                    placeholder="Media types"
                                    onChange={handleChange}
                                    options={typeSocialMediaList}
                                    parentClassname="h-[50px]"
                                  />
                                </div>

                                <div className="w-1/2 mb-4">
                                  <Input
                                    id={`contentBlocks.${blockIndex}.socialMediaUrl`}
                                    name={`contentBlocks.${blockIndex}.socialMediaUrl`}
                                    label="Link to social media"
                                    labelClass="!text-admin-700"
                                    className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                    value={block.socialMediaUrl}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>

                              <div className="mb-4">
                                <ImageLoading
                                  isAttach={true}
                                  maxFiles={1}
                                  label="Add photo"
                                  classBlock="min-h-[300px]"
                                  uploadedUrls={block.files || []}
                                  previewSize={300}
                                  isObjectCover={false}
                                  previewClassName="shadow-xl rounded-xl"
                                  onFilesChange={(files, deleted) => {
                                    setFieldValue(`contentBlocks.${blockIndex}.files`, files);
                                  }}
                                />
                              </div>
                            </div>
                          </Accordion>
                        </div>
                      </React.Fragment>
                    );
                  })}

                  {additionalBlocks.map((block, pairIndex) => {
                    const index = pairIndex + 2;
                    const blockIndex = values.contentBlocks.findIndex(item => item.id === block.id);

                    return (
                      <div key={index} className="mb-5">
                        <Accordion  title={`Section #${pairIndex + 2} - ${block.translatable_text_sectionTitle}`}
                          initState={block.isNew || false}
                          actions={
                            <button
                              type="button"
                              onClick={() => {

                                const blockIndex = values.contentBlocks.findIndex(b => b.id === block.id);
                                if (blockIndex !== -1) remove(blockIndex);

                                if (block.files) {
                                  const fileUrl = block.files[0];
  
                                  deleteFile(fileUrl);
                                }

                              }}
                              className="my-1 mr-3 p-3 bg-red-700 text-white rounded-md self-start hover:bg-red-500 duration-500"
                            >
                              <BasketIcon color="white" />
                            </button>
                          }
                        > 
                          <div>
                            <div className="mb-4">
                              <Input
                                onChange={handleChange}
                                id={`contentBlocks.${blockIndex}.sectionTitleUA`}
                                name={`contentBlocks.${blockIndex}.sectionTitleUA`}
                                type="text"
                                className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                value={block.sectionTitleUA}
                                label="Name UA"
                                labelClass="!text-admin-700"
                              />
                            </div>
                            <div className="mb-4">
                              <Input
                                onChange={handleChange}
                                id={`contentBlocks.${blockIndex}.sectionTitleENG`}
                                name={`contentBlocks.${blockIndex}.sectionTitleENG`}
                                type="text"
                                className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                value={block.sectionTitleENG}
                                label="Name ENG"
                                labelClass="!text-admin-700"
                              />
                            </div>

                            <div className="mb-4">
                              <Input
                                onChange={handleChange}
                                id={`contentBlocks.${blockIndex}.sectionLocationUA`}
                                name={`contentBlocks.${blockIndex}.sectionLocationUA`}
                                type="text"
                                className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                value={block.sectionLocationUA}
                                label="Location UA"
                                labelClass="!text-admin-700"
                              />
                            </div>
                            <div className="mb-4">
                              <Input
                                onChange={handleChange}
                                id={`contentBlocks.${blockIndex}.sectionLocationENG`}
                                name={`contentBlocks.${blockIndex}.sectionLocationENG`}
                                type="text"
                                className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                value={block.sectionLocationENG}
                                label="Location ENG"
                                labelClass="!text-admin-700"
                              />
                            </div>

                            <div className="mb-4">
                              <Input
                                onChange={handleChange}
                                id={`contentBlocks.${blockIndex}.sectionPositionUA`}
                                name={`contentBlocks.${blockIndex}.sectionPositionUA`}
                                type="text"
                                className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                value={block.sectionPositionUA}
                                label="Position UA"
                                labelClass="!text-admin-700"
                              />
                            </div>
                            <div className="mb-4">
                              <Input
                                onChange={handleChange}
                                id={`contentBlocks.${blockIndex}.sectionPositionENG`}
                                name={`contentBlocks.${blockIndex}.sectionPositionENG`}
                                type="text"
                                className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                value={block.sectionPositionENG}
                                label="Position ENG"
                                labelClass="!text-admin-700"
                              />
                            </div>

                            <div className="flex gap-4 mb-4">
                              <div className="w-1/2 mb-4">
                                <Select
                                  label="Change type social media (if needed)"
                                  adminSelectClass={true}
                                  name={`contentBlocks.${blockIndex}.typeSocialMedia`}
                                  labelClass="!text-admin-700"
                                  placeholder="Media types"
                                  onChange={handleChange}
                                  options={typeSocialMediaList}
                                  parentClassname="h-[50px]"
                                />
                              </div>

                              <div className="w-1/2 mb-4">
                                <Input
                                  id={`contentBlocks.${blockIndex}.socialMediaUrl`}
                                  name={`contentBlocks.${blockIndex}.socialMediaUrl`}
                                  label="Link to social media"
                                  labelClass="!text-admin-700"
                                  className="!bg-background-light w-full h-[50px] px-5 rounded-lg !ring-0"
                                  value={block.socialMediaUrl}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            <div className="mb-4">
                              <ImageLoading
                                isAttach={true}
                                maxFiles={1}
                                label="Add photo"
                                classBlock="min-h-[300px]"
                                uploadedUrls={block.files || []}
                                previewSize={300}
                                isObjectCover={false}
                                previewClassName="shadow-xl rounded-xl"
                                onFilesChange={(files, deleted) => {
                                  setFieldValue(`contentBlocks.${blockIndex}.files`, files);
                                }}
                              />
                            </div>
                          </div>
                        </Accordion>
                      </div>
                    );
                  })}

                  {/* Added blocks */}
                  <button
                    type="button"
                    onClick={() => {
                      const blockId = uuid();
                      push({
                        id: blockId,
                        contentBlockType: 'SECTION',
                        sectionTitleUA: '',
                        sectionTitleENG: '',
                        sectionLocationUA: '',
                        sectionLocationENG: '',
                        sectionPositionUA: '',
                        sectionPositionENG: '',
                        typeSocialMedia: '', 
                        socialMediaUrl: '', 
                        files: [],
                        isNew: true,
                      });
                    }}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Add New Team Member
                  </button>
                </>
              );
            }}
          </FieldArray>
          
          <div className="my-4">
            <sup className="font-bold text-red-600 text-small2">*</sup>
            After any changes you need to click the <strong>Save</strong> button
          </div>

          {submitError && <div className="text-red-700 text-medium1 my-4"> {submitError}</div>}

          <Button type="submit" disabled={isSubmitting} 
            className="!bg-background-darkBlue text-white !rounded-[5px] !h-[60px] font-normal text-xl p-4 hover:opacity-[0.8] duration-500">
              {isSubmitting ? 'Loading...' : isUpdate ? 'Update' : 'Save'}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

export default OurTeam;