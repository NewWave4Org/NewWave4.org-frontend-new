'use client';

import ProgramContent from '@/components/admin/ProgramsPage/ProgramContent/ProgramContent';
import ArrowLeft4Icon from '@/components/icons/navigation/ArrowLeft4Icon';
import Button from '@/components/shared/Button';
import { useParams, useRouter } from 'next/navigation';

function EditProgramPage() {
  const { id } = useParams();
  const programId = Number(id);
  const router = useRouter();

  return (
    <>
      <Button onClick={() => router.back()} className="!py-2 pl-2 pr-4 !min-h-8 !h-auto flex text-white !bg-admin-700 hover:!bg-admin-600 duration-500 mb-10">
        <ArrowLeft4Icon color="white" />
        Back
      </Button>
      <h4 className="text-h4 mb-5">Edit program content</h4>
      {!Number.isNaN(id) ? (
        <ProgramContent programId={programId} />
      ) : (
        <>
          <div className="text-h4 mb-5">Project wasn&apos;t created</div>
          <Button onClick={() => router.back()} className="!bg-background-darkBlue !h-auto flex text-white !rounded-[5px] font-normal text-xl p-4 hover:opacity-80 duration-300">
            <ArrowLeft4Icon />
            Back
          </Button>
        </>
      )}
    </>
  );
}

export default EditProgramPage;
