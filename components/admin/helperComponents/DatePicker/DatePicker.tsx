'use client';

import { useFormikContext } from 'formik';
import { useMemo } from 'react';
import { DtPicker } from 'react-calendar-datetime-picker';
import 'react-calendar-datetime-picker/dist/style.css';

interface IPickerValue {
  from?: {
    year: number;
    month: number;
    day: number;
  };
  to?: {
    year: number;
    month: number;
    day: number;
  };
}

interface IDatePicker {
  name: string;
  pickerId: string;
  pickerPlaceholder?: string;
  pickerValue?: IPickerValue;
  pickerType?: string;
  pickerLocal?: string;
  pickerWithTime?: boolean;
  pickerSnowWeekend?: boolean;
}

function DatePicker({ name, pickerId, pickerValue, pickerType = 'single', pickerLocal = 'en', pickerSnowWeekend = true, pickerPlaceholder, pickerWithTime = false }: IDatePicker) {
  const { setFieldValue } = useFormikContext();

  const today = new Date();
  const minDate = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
    hour: 0,
    minute: 0,
  };

  const safeInitValue = useMemo(() => {
    if (pickerType === 'range') {
      if (pickerValue?.from && pickerValue?.to) return pickerValue;
      return undefined;
    }
    return pickerValue;
  }, [pickerValue, pickerType]);

  return (
    <DtPicker
      onChange={val => setFieldValue(name, val)}
      type={pickerType}
      local={pickerLocal}
      showWeekend={pickerSnowWeekend}
      showTimeInput={false}
      withTime={pickerWithTime}
      inputId={pickerId}
      minDate={minDate}
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
