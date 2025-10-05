import * as React from 'react';
import { Dialog as DialogPrimitive, Label } from 'radix-ui';
import { IoCloseSharp } from 'react-icons/io5';
import styles from './CustomDialog.module.css';
import CustomButton from './CustomButton';

type DialogContentProps = React.PropsWithChildren<{
   title?: string;
   header?: React.ReactNode;
   footer?: React.ReactNode;
   onCloseClick?: () => void;
} & React.ComponentProps<typeof DialogPrimitive.Content>>;

type DialogCellProps = React.PropsWithChildren & {
  alignEnd?: boolean;
  htmlFor?: string;
  style?: React.CSSProperties;
}

type DialogCellDescriptionProps = React.PropsWithChildren & {
  color?: 'default' | 'warning';
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(({ title, header, footer, onCloseClick, children, ...props }, forwardedRef) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className={styles['Overlay']} />
    <DialogPrimitive.Content {...props} ref={forwardedRef} className={styles['Content']}>
      <div className={styles['TitleWrapper']}>
        {title && <DialogPrimitive.Title className={styles['Title']}>{title}</DialogPrimitive.Title>}
        <DialogPrimitive.Close asChild>
          <CustomButton color="mute" icon={IoCloseSharp} onClick={onCloseClick} />
        </DialogPrimitive.Close>
      </div>
      {header}
      <div className={styles['ContentWrapper']}>
        {children}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1em' }}>
        {footer}
      </div>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

const DialogSectionTitle = ({ children }: React.PropsWithChildren) => (
  <div className={styles['SectionTitle']}>
    {children}
  </div>
);

const DialogRow = ({ children }: React.PropsWithChildren) => (
  <div className={styles['Row']}>
    {children}
  </div>
);

const DialogCell = ({ children, alignEnd, htmlFor, style }: React.PropsWithChildren<DialogCellProps>) => (
  <Label.Root
    className={styles['Cell']}
    style={{ marginInlineStart: alignEnd ? 'auto' : '', cursor: htmlFor ? 'pointer' : 'default', ...style }}
    htmlFor={htmlFor}
  >
    {children}
  </Label.Root>
);

const DialogCellDescription = ({ children, color }: React.PropsWithChildren<DialogCellDescriptionProps>) => (
  <div className={styles['CellDescription']} style={{ color: color === 'warning' ? 'var(--orange-11)' : 'inherit' }}>
    {children}
  </div>
);

DialogContent.displayName = 'DialogContent';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;

export { DialogContent, Dialog, DialogTrigger, DialogSectionTitle, DialogRow, DialogCell, DialogCellDescription };
