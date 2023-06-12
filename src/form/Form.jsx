import React from 'react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import ErrorNotice from '../ErrorNotice';
import Select from '../Select';
import Notice from '../Notice';

import { getUsers, getCurrencies, makeTransaction } from '../api/api';
import styles from './Form.module.scss';

const Form = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });

  const [currencies, setCurrencies] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersFrom, setUsersFrom] = useState([]);
  const [usersTo, setUsersTo] = useState([]);

  const [amount, setAmount] = useState();
  const [maxAmount, setMaxAmount] = useState();

  const [currentDecimals, setCurrentDecimals] = useState();
  const [currentCurrencyCode, setCurrentCurrencyCode] = useState();
  const [currentUserId, setCurrentUserId] = useState();

  const [error, setError] = useState();
  const [transferResult, setTransferResult] = useState();

  const onSubmit = async (data) => {
    const result = {
      currencyId: +data.currency,
      fromUserId: +data.from,
      toUserId: +data.to,
      amount: data.amount,
    };

    makeTransaction(result)
      .then((res) => res.json())
      .then((res) => {
        setTransferResult(res);
        setAmount('');
        setCurrentCurrencyCode(null);
        setCurrentUserId(null);
        reset();
      })
      .catch((e) => {
        setError(e.message);
        console.log('Error: ' + e.message);
        console.log(e.response);
      });

    setTimeout(() => {
      setError(null);
      setTransferResult(null);
    }, 5000);
  };

  const onChangeCurrency = (e) => {
    setCurrentCurrencyCode(
      currencies?.find((cur) => +cur.id === +e.target.value)?.code
    );
    setCurrentDecimals(
      currencies?.find((cur) => +cur.id === +e.target.value)?.decimals
    );
  };

  const onChangeUser = (e) => setCurrentUserId(e.target.value);

  const onAmountChange = (e) => {
    const amount = e.target.value;
    const floatRegExp = new RegExp(
      `^\\d{1,}([\\.|\\,]\\d{0,${currentDecimals}})?$`
    );

    if (!amount || amount.match(floatRegExp)) {
      setAmount(amount.replace(/,/, '.'));
    }
  };

  useEffect(() => {
    getCurrencies()
      .then((res) => res.json())
      .then(setCurrencies);

    getUsers()
      .then((res) => res.json())
      .then((res) => {
        setUsers(res);
        setUsersFrom(res);
        setUsersTo(res);
      });
  }, []);

  useEffect(() => {
    setUsersTo(usersFrom.filter((user) => +user.id !== +currentUserId));
    setMaxAmount(
      usersFrom.find((user) => +user.id === +currentUserId)?.currencies[
        currentCurrencyCode
      ]
    );
  }, [usersFrom, currentUserId, currentCurrencyCode]);

  useEffect(() => {
    const hasCurrentCurrencyCode = (user) =>
      user.currencies.hasOwnProperty(currentCurrencyCode);

    setUsersFrom(users.filter(hasCurrentCurrencyCode));
    setUsersTo(users.filter(hasCurrentCurrencyCode));
  }, [users, currentCurrencyCode]);

  return (
    <>
      {error && <ErrorNotice error={error} />}
      {transferResult?.transferId && <Notice />}
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Select
            register={register}
            label='currency'
            required={true}
            options={currencies}
            defaultOption='Select currency'
            onChange={onChangeCurrency}
          />

          {errors?.currency && (
            <p className={styles.error}>{errors?.currency?.message}</p>
          )}

          <Select
            register={register}
            label='from'
            required={true}
            disabled={!currentCurrencyCode}
            options={usersFrom}
            defaultOption='From whom'
            onChange={onChangeUser}
          />

          {errors?.from && (
            <p className={styles.error}>{errors?.from?.message}</p>
          )}

          <input
            {...register('amount', {
              required: 'Required field',
              disabled: !currentCurrencyCode || !currentUserId,
              validate: {
                positive: (v) => parseInt(v) > 0 || 'should be greater than 0',
                lessThanBalance: (v) =>
                  parseInt(v * 10 ** currentDecimals) <=
                    parseInt(maxAmount * 10 ** currentDecimals) ||
                  'cannot exceed the balance',
              },
            })}
            value={amount}
            onChange={onAmountChange}
          />

          {errors?.amount && (
            <p className={styles.error}>{errors?.amount?.message}</p>
          )}

          <Select
            register={register}
            label='to'
            required={true}
            disabled={!currentCurrencyCode || !currentUserId}
            options={usersTo}
            defaultOption='To whom'
          />

          {errors?.to && <p className={styles.error}>{errors?.to?.message}</p>}

          <button type='submit' className={styles.button}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Form;
