import { CSSProperties } from 'react';
import { TbLayoutAlignLeft, TbLayoutAlignRight } from 'react-icons/tb';
import SegmentCutpointButton from './SegmentCutpointButton';
import { SegmentColorIndex } from '../types';
import { KeyboardAction } from '../../../../types';

// constant side because we are mirroring
const SetCutpointButton = ({ currentCutSeg, side, title, onClick, style, keyboardAction }: {
  currentCutSeg: SegmentColorIndex | undefined,
  side: 'start' | 'end',
  title?: string,
  onClick?: () => void,
  style?: CSSProperties,
  keyboardAction?: KeyboardAction,
}) => {
  const icon = side === 'start' ? TbLayoutAlignLeft : TbLayoutAlignRight;
  return (
    <SegmentCutpointButton
      currentCutSeg={currentCutSeg}
      side={side}
      Icon={icon}
      onClick={onClick}
      title={title}
      style={style}
      keyboardAction={keyboardAction}
    />
  );
};

export default SetCutpointButton;
