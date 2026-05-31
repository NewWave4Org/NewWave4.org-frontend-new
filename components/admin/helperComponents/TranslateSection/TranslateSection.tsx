import Select from "@/components/shared/Select";
import { TranslateDirectionEnum } from "../../Pages/enum/types";

interface TranslateBlockProps {
  translateBlockIndex: number;
  translateStatus: string;
  handleChange: any;
}

function TranslateSection({ translateBlockIndex, translateStatus, handleChange }: TranslateBlockProps) {
  return (
    <div className="p-4 shadow-lg rounded-2xl m-1">
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
        <>
          <Select
            label="Translation direction"
            adminSelectClass={true}
            name="translateDirection"
            labelClass="!text-admin-700"
            onChange={handleChange}
            required
            options={[
              { value: TranslateDirectionEnum.UK_TO_EN.toLocaleUpperCase(), label: 'Ukrainian → English' },
              { value: TranslateDirectionEnum.EN_TO_UK.toLocaleUpperCase(), label: 'English → Ukrainian' },
            ]}
          />
        </>
      )}
    </div>
  );
}

export default TranslateSection;