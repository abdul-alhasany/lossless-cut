import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import type { IconType } from 'react-icons';
import { forwardRef, useMemo, useState } from 'react';
import { Toggle } from 'radix-ui';
import Tooltip from './Tooltip';
import styles from './CustomButton.module.css';
import useUserSettingsRoot from '../hooks/useUserSettingsRoot';
import { KeyBinding, KeyboardAction } from '../../../../types';

export type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
type Color = 'mute' | 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info';
type ButtonType = ButtonProps & { icon?: IconType; label?: string, largeIcon?: boolean, toggleable?: boolean, color?: Color, keyboardAction?: KeyboardAction, title?: string; };

const CustomButton = forwardRef<HTMLButtonElement, ButtonType>(({
  className,
  title,
  icon,
  label,
  largeIcon,
  toggleable,
  color = 'primary',
  keyboardAction,
  ...props
}, ref) => {
  const allUserSettings = useUserSettingsRoot();

  const { keyBindings } = allUserSettings;

  // Note that each action may be multiple key bindings and this will only be the first binding for each action
  const keyBindingByAction = useMemo(() => Object.fromEntries(keyBindings.map((binding) => [binding.action, binding])) as Record<KeyboardAction, KeyBinding>, [keyBindings]);

  let finalTitle = title;
  if (title && keyboardAction) {
    const bindingsForThisAction = keyBindingByAction[keyboardAction];
    if (bindingsForThisAction?.keys) {
      finalTitle = `${title} (${bindingsForThisAction.keys})`;
    }
  }


  const wrapperClasses = [styles['button']];
  if (className) {
    wrapperClasses.push(className);
  }

  if (!label) {
    wrapperClasses.push(styles['icon-only']);
  }

  if (largeIcon) {
    wrapperClasses.push(styles['large']);
  }

  const [isToggled, setIsToggled] = useState(false);
  if (toggleable && isToggled) {
    wrapperClasses.push(styles['toggled']);
  }

  const buttonComponent = (
    <button ref={ref} className={wrapperClasses.join(' ')} type="button" {...props} data-color={color}>
      {icon && <span className={styles['icon']}>{icon({})}</span>}
      {label && <span>{label}</span>}
    </button>
  );

  const toggleButtonComponent = (
    <Toggle.Root className={styles['Toggle']} asChild onPressedChange={setIsToggled} data-toggled={isToggled ? 'on' : 'off'}>
      {buttonComponent}
    </Toggle.Root>
  );

  const buttonComponentFinal = toggleable ? toggleButtonComponent : buttonComponent;
  return (
    finalTitle ? <Tooltip content={finalTitle}>{buttonComponentFinal}</Tooltip> : buttonComponentFinal
  );
});

CustomButton.displayName = 'CustomButton';

export default CustomButton;
