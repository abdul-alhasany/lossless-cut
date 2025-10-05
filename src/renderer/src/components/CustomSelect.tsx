import * as React from 'react';
import { Select as SelectPrimitive, ScrollArea } from 'radix-ui';
import { FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import styles from './CustomSelect.module.css';

type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root> & {
  placeholder?: string;
  children: React.ReactNode;
  label?: string;
  position?: 'popper' | 'item-aligned';
};

type SelectItemProps = React.ComponentProps<typeof SelectPrimitive.Item>;

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({ placeholder, label, children, position = 'popper', ...props }, forwardedRef) => (
    <SelectPrimitive.Root {...props}>
      <SelectPrimitive.Trigger className={styles['Trigger']} ref={forwardedRef}>
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon className={styles['Icon']}>
          <FaChevronDown />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className={styles['Content']} position={position} sideOffset={5}>
          <ScrollArea.Root className={styles['ScrollAreaRoot']} type="auto">
            <SelectPrimitive.Viewport className={styles['Viewport']} asChild>
              <ScrollArea.Viewport className={styles['ScrollAreaViewport']} style={{overflowY: undefined}}>
                <SelectPrimitive.Group>
                  {label && <SelectPrimitive.Label className={styles['Label']}>{label}</SelectPrimitive.Label>}
                  {children}
                </SelectPrimitive.Group>
              </ScrollArea.Viewport>
            </SelectPrimitive.Viewport>
            <ScrollArea.Scrollbar
              className={styles['ScrollAreaScrollbar']}
              orientation="vertical"
            >
              <ScrollArea.Thumb className={styles['ScrollAreaThumb']} />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  ),
);

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, ...props }, forwardedRef) => (
    <SelectPrimitive.Item className={styles['Item']} {...props} ref={forwardedRef}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className={styles['ItemIndicator']}>
        <FaCheck />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  ),
);

Select.displayName = 'Select';
SelectItem.displayName = 'SelectItem';
export { Select, SelectItem };
