import { forwardRef } from 'react';
import styles from './CustomTextInput.module.css';

const CustomTextInput = forwardRef<HTMLInputElement, JSX.IntrinsicElements['input']>(({ style, ...props }, forwardedRef) => (
  <input
    className={styles['Input']}
    type="text"
    ref={forwardedRef}
    style={{ ...style }}
    {...props}
  />
));

CustomTextInput.displayName = 'CustomTextInput';
export default CustomTextInput;
