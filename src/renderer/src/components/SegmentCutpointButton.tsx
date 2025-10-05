import { CSSProperties, useMemo } from 'react';
import { FaStepForward } from 'react-icons/fa';

import { useSegColors } from '../contexts';
import useUserSettings from '../hooks/useUserSettings';
import { SegmentColorIndex } from '../types';
import CustomButton from './CustomButton';
import { KeyboardAction } from '../../../../types';

const SegmentCutpointButton = ({ currentCutSeg, side, Icon, onClick, title, style, keyboardAction }: {
  currentCutSeg: SegmentColorIndex | undefined,
  side: 'start' | 'end',
  Icon: typeof FaStepForward,
  onClick?: (() => void) | undefined,
  title?: string | undefined,
  style?: CSSProperties | undefined,
  keyboardAction?: KeyboardAction,
}) => {
  const { darkMode } = useUserSettings();
  const { getSegColor } = useSegColors();
  const segColor = useMemo(() => getSegColor(currentCutSeg), [currentCutSeg, getSegColor]);

  const start = side === 'start';
  const border = `3px solid ${segColor.desaturate(0.6).lightness(darkMode ? 45 : 35).string()}`;
  const backgroundColor = segColor.desaturate(0.6).lightness(darkMode ? 35 : 55).string();

  return (
    <CustomButton title={title} icon={Icon} onClick={onClick} style={style} largeIcon keyboardAction={keyboardAction} />
    // <Icon
    //   size={13}
    //   role="button"
    //   style={{ flexShrink: 0, cursor: 'inherit', color: 'white', padding: start ? '4px 4px 4px 2px' : '4px 2px 4px 4px', borderLeft: start ? border : undefined, borderRight: !start ? border : undefined, background: backgroundColor, borderRadius: 6, ...style }}
    //   onClick={onClick}
    // />
  );
};

export default SegmentCutpointButton;
