import * as React from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import styles from './Popover.module.css';

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

type PopoverContentProps = React.ComponentProps<typeof PopoverPrimitive.Content> & {
  position?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
};

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ position = 'top', children, ...props }: PopoverContentProps, forwardedRef) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content sideOffset={5} {...props} ref={forwardedRef} className={styles['Content']} side={position}>
        {children}
        <PopoverPrimitive.Arrow className={styles['Arrow']} />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  ),
);

PopoverContent.displayName = 'PopoverContent';

export { PopoverContent, Popover, PopoverTrigger };
