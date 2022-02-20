import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@material-ui/core/Button';
import { NextPage } from 'next';

import styles from './lenderName.module.css';
import {
  LenderGetResponse,
  LenderGetResponseExtended,
  LenderPostResponse,
  LenderFields,
} from 'lib/types';
import FormField from '../core/components/FormField';

import HTTPService from '../core/services/HTTPService';

const LenderNamePage: NextPage = () => {
  const router = useRouter();
  const lenderSlug = router.query.lenderName?.toString();
  const [lenderResponse, setLenderResponse] = useState<
    LenderGetResponse | LenderGetResponseExtended | null
  >(null);
  const [formRef, setFormRef] = useState<any>();
  const [fieldConfigArr, setFieldConfigArr] = useState<any>();

  useEffect(() => {
    lenderSlug &&
      HTTPService.get(`api/lenders/${lenderSlug}`).then(
        (res: LenderGetResponse | LenderGetResponseExtended) => {
          setLenderResponse(res);
        },
      );
  }, [lenderSlug]);

  const getReqBody = () => {
    const reqBody: any = {};
    const _fieldConfigArr = JSON.parse(JSON.stringify(fieldConfigArr));
    let isError = false;
    for (let i = 0; i < _fieldConfigArr.length; i++) {
      if (_fieldConfigArr[i].required && !_fieldConfigArr[i].value) {
        _fieldConfigArr[i].isInvalid = true;
        setFieldConfigArr(_fieldConfigArr);
        isError = true;
      }
      reqBody[fieldConfigArr[i].name] = fieldConfigArr[i].value;
    }

    return isError ? null : reqBody;
  };

  const submitFormData = (reqBody: any) => {
    HTTPService.post(`api/lenders/${lenderSlug}`, reqBody).then(
      (res: LenderPostResponse) => {
        alert(`Your application has been ${res.decision}`);
      },
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const reqBody = getReqBody();
    console.log(reqBody);
    reqBody && (await submitFormData(reqBody));
  };

  const triggerFormSubmit = () => {
    formRef.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
  };

  const getFormFieldConfig = (config: string | LenderFields) => {
    if (typeof config !== 'string') {
      return config;
    }
    switch (config) {
      case 'first_name':
        config = { name: 'first_name', type: 'text', required: true };
        break;
      case 'last_name':
        config = { name: 'last_name', type: 'text', required: true };
        break;
      case 'email':
        config = { name: 'email', type: 'email', required: true };
        break;
      case 'gender':
        config = {
          name: 'gender',
          type: 'select',
          required: true,
          options: ['opt1', 'opt2', 'opt3'],
        };
        break;
      case 'monthly_income':
        config = { name: 'monthly_income', type: 'number', required: false };
        break;
      case 'date_of_birth':
        config = { name: 'date_of_birth', type: 'date', required: false };
        break;
      default:
        config = { name: config, type: 'text', required: false };
        break;
    }

    return config;
  };

  useEffect(() => {
    const configArr: any = [];
    lenderResponse &&
      lenderResponse.fields &&
      (lenderResponse.fields || []).map((field: string | LenderFields) => {
        configArr.push({
          ...getFormFieldConfig(field),
          value: '',
          isInvalid: false,
        });
      });
    setFieldConfigArr(configArr);
  }, [lenderResponse]);

  return (
    <>
      <div className={styles.heading}>{lenderResponse?.name}</div>
      <form
        ref={(ref) => setFormRef(ref)}
        onSubmit={handleSubmit}
        className={styles.lenderForm}
      >
        {(fieldConfigArr || []).map((field: LenderFields) => {
          return (
            <FormField config={field} isInvalid={field.isInvalid || false} />
          );
        })}
        <div className={styles.submitButton}>
          <Button
            onClick={triggerFormSubmit}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </div>
      </form>
    </>
  );
};

export default LenderNamePage;
