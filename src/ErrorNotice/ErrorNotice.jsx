import React from 'react';
import styles from './Error.module.scss';

const ErrorNotice = ({ error }) => {
  return (
    <div className={styles.error}>
      <p>{`Error: ${error}. PLease try again`}</p>
    </div>
  );
};

export default ErrorNotice;
