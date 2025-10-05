import { memo } from 'react';
import { FiScissors } from 'react-icons/fi';
import { FaFileExport } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import { primaryColor } from '../colors';
import useUserSettings from '../hooks/useUserSettings';
import { SegmentToExport } from '../types';
import CustomButton from './CustomButton';


function ExportButton({ segmentsToExport, areWeCutting, onClick, size = 1 }: {
  segmentsToExport: SegmentToExport[],
  areWeCutting: boolean,
  onClick: () => void,
  size?: number | undefined,
}) {
  const CutIcon = areWeCutting ? FiScissors : FaFileExport;

  const { t } = useTranslation();

  const { autoMerge } = useUserSettings();

  let title = t('Export');
  if (segmentsToExport.length === 1) {
    title = t('Export selection');
  } else if (segmentsToExport.length > 1) {
    title = t('Export {{ num }} segments', { num: segmentsToExport.length });
  }

  const text = autoMerge && segmentsToExport && segmentsToExport.length > 1 ? t('Export+merge') : t('Export');

  return (
    <CustomButton
      onClick={onClick}
      title={title}
      label={text}
      icon={CutIcon}
      largeIcon
    />

  );
}

export default memo(ExportButton);
