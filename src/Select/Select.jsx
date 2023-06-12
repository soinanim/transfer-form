import React from 'react';
import styles from './Select.module.scss';

const Select = ({
  label,
  register,
  required,
  options,
  disabled,
  defaultOption,
  onChange,
}) => {
  return (
    <div>
      <select
        {...register(label, { required: required ? 'Required field' : false })}
        onChange={onChange}
        disabled={disabled}>
        <option key={`${label}-default`} value=''>
          {defaultOption}
        </option>
        {options?.map((option) => (
          <option key={`${label}-${option.id}`} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
