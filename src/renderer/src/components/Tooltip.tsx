import { Tooltip as TooltipPrimitive } from 'radix-ui';
import styles from './Tooltip.module.css';

export default function Tooltip({ children, content }:
 { children: React.ReactNode; content: React.ReactNode; } & React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content className={styles['Content']} side="top" align="center" sideOffset={5}>
        {content}
        <TooltipPrimitive.Arrow className={styles['Arrow']} width={11} height={5} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  );
}
