import Select from "@/components/shared/Select";

interface TranslateBlockProps {
  translateBlockIndex: number;
  translateStatus: string;
  handleChange: any;
}

function TranslateSection({ translateBlockIndex, translateStatus, handleChange }: TranslateBlockProps) {
  return (
    <div className="mb-8">
      <div className="mb-3">
        <Select
          label="Do you want translate this program info English language?"
          adminSelectClass={true}
          name={`contentBlocks.${translateBlockIndex}.translateStatus`}
          labelClass="!text-admin-700"
          onChange={handleChange}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
        />
      </div>

      {translateStatus === 'yes' && (
        <Select
          label="Translation direction"
          adminSelectClass={true}
          name="translateDirection"
          labelClass="!text-admin-700"
          onChange={handleChange}
          options={[
            { value: 'uk_to_en', label: 'Ukrainian → English' },
            { value: 'en_to_uk', label: 'English → Ukrainian' },
          ]}
        />
      )}
    </div>
  );
}

export default TranslateSection;