import React from 'react';
import loadingStyles from '../../../theme/loading.module.css';
import styles from './LoadingIcon.module.css';

const LoadingIcon = ({ classNames = [] }) => {
  classNames.push(styles.licon, loadingStyles.ld, loadingStyles['ld-ring'], loadingStyles['ld-cycle']);

  return <div className={classNames.join(' ')}></div>;
};

export default LoadingIcon;
