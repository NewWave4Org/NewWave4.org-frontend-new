'use client';

import { FormikContext } from 'formik';
import { useContext, useMemo, useState } from 'react';
import { DtPicker } from 'react-calendar-datetime-picker';
import 'react-calendar-datetime-picker/dist/style.css';

export interface IPickerValue {
  from?: {
    year: number;
    month: number;
    day: number;
  } | null;
  to?: {
    year: number;
    month: number;
    day: number;
  } | null;
}

interface IDatePicker {
  name: string;
  pickerId: string;
  pickerPlaceholder?: string;
  pickerValue?: IPickerValue | null;
  pickerType?: 'single' | 'range';
  pickerLocal?: string;
  pickerWithTime?: boolean;
  pickerSnowWeekend?: boolean;
  onChange?: (val: IPickerValue | null) => void;
}

function DatePicker({ name, pickerId, pickerValue, pickerType = 'single', pickerLocal = 'en', pickerSnowWeekend = true, pickerPlaceholder, pickerWithTime = false, onChange }: IDatePicker) {

  const formik = useContext(FormikContext);

  const formikValues = formik?.values;
  const formikSetFieldValue = formik?.setFieldValue;

  const [localValue, setLocalValue] = useState<IPickerValue | null>(pickerValue ?? null);

  const safeInitValue = useMemo(() => {
    const value = formikValues?.[name] ?? localValue;

    if (pickerType === 'range') {
      if (value?.from && value?.to) return value;
      return undefined;
    }

    return value;
  }, [formikValues, localValue, name, pickerType]);

  const handleChange = (val: IPickerValue | null) => {
    if (formikSetFieldValue && name) {
      formikSetFieldValue(name, val);
    } else {
      setLocalValue(val ?? null);
      onChange?.(val);
    }
  };

  return (
    <DtPicker
      onChange={handleChange}
      type={pickerType}
      local={pickerLocal}
      showWeekend={pickerSnowWeekend}
      showTimeInput={false}
      withTime={pickerWithTime}
      inputId={pickerId}
      placeholder={pickerPlaceholder}
      inputClass="bg-background-light w-full !h-[50px] !px-5 !rounded-lg !ring-0 py-4 !border-0 text-dark !text-left"
      daysClass="custom-days"
      headerClass="custom-header"
      initValue={safeInitValue}
      clearBtn={true}
    />
  );
}

export default DatePicker;
