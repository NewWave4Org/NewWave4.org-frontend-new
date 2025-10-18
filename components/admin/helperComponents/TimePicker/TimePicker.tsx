'use client';

import { useEffect } from 'react';

interface ITimePicker {
  name: string;
  label: string;
  value?: {
    hour?: string;
    minute?: string;
    period?: 'AM' | 'PM';
  };
  classBlock?: string;
  setFieldValue: (field: string, value: any) => void;
}

function TimePicker({ name, label, value, classBlock, setFieldValue }: ITimePicker) {
  const { hour = '', minute = '', period = 'AM' } = value || {};

  useEffect(() => {
    if (!value?.period) {
      setFieldValue(name, { ...value, period: 'AM' });
    }
  }, []);

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, ''); // only numbers
    if (v.length > 2) v = v.slice(0, 2);
    if (v === '' || (+v >= 1 && +v <= 12)) {
      setFieldValue(name, { ...value, hour: v });
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 2) v = v.slice(0, 2);
    if (v === '' || (+v >= 0 && +v <= 59)) {
      setFieldValue(name, { ...value, minute: v });
    }
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFieldValue(name, { ...value, period: e.target.value });
  };

  return (
    <div className="flex flex-col">
      <div className="block text-medium2 mb-1 text-admin-700">{label}</div>
      <div className="flex gap-2 items-center">
        {/* Hour */}
        <div>
          <label htmlFor={name} className="block text-xs text-gray-500 mb-1">
            Hour
          </label>
          <input
            type="text"
            min="1"
            max="12"
            inputMode="numeric"
            value={hour}
            name={name}
            maxLength={2}
            onChange={handleHourChange}
            placeholder="HH"
            className={`${classBlock} focus:ring-blue-500 focus:border-blue-500 px-2 max-w-[60px] text-center`}
          />
        </div>

        {/* Minute */}
        <div>
          <label htmlFor={name} className="block text-xs text-gray-500 mb-1">
            Minute
          </label>
          <input
            type="text"
            min="0"
            max="59"
            inputMode="numeric"
            value={minute}
            maxLength={2}
            name={name}
            placeholder="MM"
            onChange={handleMinuteChange}
            className={`${classBlock} focus:ring-blue-500 focus:border-blue-500 px-2 max-w-[60px] text-center`}
          />
        </div>

        {/* AM/PM */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">AM or PM</label>
          <select value={period} name={name} onChange={handlePeriodChange} className={`${classBlock} focus:ring-blue-500 focus:border-blue-500 px-2 w-[80px] text-center`}>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default TimePicker;
