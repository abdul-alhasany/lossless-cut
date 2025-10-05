import { memo } from 'react';
import { motion } from 'framer-motion';
import { FaTrashAlt, FaSave } from 'react-icons/fa';
import { LuSave, LuSaveOff } from "react-icons/lu";

import { mySpring } from './animations';
import { saveColor } from './colors';
import useUserSettings from './hooks/useUserSettings';


function BetweenSegments({ start, end, fileDurationNonZero, invertCutSegments }: {
  start: number,
  end: number,
  fileDurationNonZero: number,
  invertCutSegments: boolean,
}) {
  const left = `${(start / fileDurationNonZero) * 100}%`;

  const { effectiveExportMode } = useUserSettings();

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
      initial={{
        left,
        width: '0%',
      }}
      animate={{
        left,
        width: `${((end - start) / fileDurationNonZero) * 100}%`,
      }}
      layout
      transition={mySpring}
    >
      <div style={{ flexGrow: 1, borderBottom: '1px dashed var(--gray-10)', marginLeft: 5, marginRight: 5, opacity: 0.5 }} />
      {/* https://github.com/mifi/lossless-cut/issues/2157 */}
      {effectiveExportMode !== 'segments_to_chapters' && (
        <>
          {invertCutSegments ? (
            <LuSave style={{ color: saveColor }} size={16} />
          ) : (
            <LuSaveOff style={{ color: 'var(--red-10)' }} size={16} />
          )}
          <div style={{ flexGrow: 1, borderBottom: '1px dashed var(--gray-10)', marginLeft: 5, marginRight: 5, opacity: 0.5 }} />
        </>
      )}
    </motion.div>
  );
}

export default memo(BetweenSegments);
