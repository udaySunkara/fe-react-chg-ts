import { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';

import { LenderFields } from 'lib/types';
import styles from './FormField.module.css';

type Props = {
  config: LenderFields;
  isInvalid: boolean;
};
const FormField = (props: Props) => {
  const { config, isInvalid } = props;
  const [inputValue, setInputValue] = useState<any>();
  const handleChange = (event: any) => {
    setInputValue(event.target.value);
    config.value = event.target.value;
  };
  const renderFormElement = (config: LenderFields) => {
    switch (config.type) {
      case 'number':
      case 'date':
        return (
          <TextField
            error={isInvalid}
            type={config.type}
            id={config.name}
            label={config.type === 'date' ? '' : config.name}
            defaultValue=""
            value={inputValue}
            onChange={handleChange}
            helperText={`Please enter ${config.name}`}
          />
        );
      case 'select':
        return (
          <TextField
            error={isInvalid}
            id={config.name}
            select
            label={`Select ${config.name}`}
            value={inputValue}
            onChange={handleChange}
            helperText={`Please select ${config.name}`}
          >
            {(config.options || []).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        );
      case 'checkbox':
        return (
          <>
            <label className={styles.checkBoxLabel}>{config.name}</label>
            <Checkbox
              className={styles.checkBox}
              value={inputValue}
              name={config.name}
              onChange={handleChange}
              primary
            />
          </>
        );
      default:
        return (
          <TextField
            error={isInvalid}
            id={config.name}
            label={config.name}
            defaultValue=""
            value={inputValue}
            onChange={handleChange}
            helperText={`Please enter ${config.name}`}
          />
        );
    }
  };

  return <>{config && renderFormElement(config)}</>;
};

export default FormField;
