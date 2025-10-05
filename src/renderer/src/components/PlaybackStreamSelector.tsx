import { memo, useState, useCallback, useRef, useEffect, ChangeEventHandler, ChangeEvent } from 'react';
import { MdSubtitles } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import Select from './Select';
import Switch from './Switch';
import styles from './PlaybackStreamSelector.module.css';
import { FFprobeStream } from '../../../../ffprobe';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';
import { Select as CustomSelect, SelectItem } from './CustomSelect';
import CustomButton from './CustomButton';

function PlaybackStreamSelector({
  subtitleStreams,
  videoStreams,
  audioStreams,
  activeSubtitleStreamIndex,
  activeVideoStreamIndex,
  activeAudioStreamIndexes,
  onActiveSubtitleChange,
  onActiveVideoStreamChange,
  onActiveAudioStreamsChange,
}: {
  subtitleStreams: FFprobeStream[],
  videoStreams: FFprobeStream[],
  audioStreams: FFprobeStream[],
  activeSubtitleStreamIndex?: number | undefined,
  activeVideoStreamIndex?: number | undefined,
  activeAudioStreamIndexes: Set<number>,
  onActiveSubtitleChange: (a?: number | undefined) => void,
  onActiveVideoStreamChange: (a?: number | undefined) => void,
  onActiveAudioStreamsChange: (a: Set<number>) => void,
}) {
  const [controlVisible, setControlVisible] = useState(false);
  const timeoutRef = useRef<number>();

  const { t } = useTranslation();

  const resetTimer = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setControlVisible(false), 10000);
  }, []);

  const onChange = useCallback((value: string, fn: (a: number | undefined) => void) => {
    resetTimer();
    const index = value ? parseInt(value, 10) : undefined;
    fn(index);
  }, [resetTimer]);

  const onActiveSubtitleChange2 = useCallback((value: string) => onChange(value, onActiveSubtitleChange), [onActiveSubtitleChange, onChange]);
  const onActiveVideoStreamChange2 = useCallback((value: string) => onChange(value, onActiveVideoStreamChange), [onActiveVideoStreamChange, onChange]);
  const handleActiveAudioStreamsChange = useCallback((index: number, checked: boolean) => {
    resetTimer();
    const newActiveAudioStreamIndexes = new Set(activeAudioStreamIndexes);
    if (checked) newActiveAudioStreamIndexes.add(index);
    else newActiveAudioStreamIndexes.delete(index);
    onActiveAudioStreamsChange(newActiveAudioStreamIndexes);
  }, [activeAudioStreamIndexes, onActiveAudioStreamsChange, resetTimer]);

  const onIconClick = useCallback(() => {
    resetTimer();
    setControlVisible((v) => !v);
  }, [resetTimer]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <>
      {/* {controlVisible && ( */}
      <Popover>
        <PopoverTrigger asChild>
          <CustomButton
            icon={MdSubtitles}
            color="mute"
            largeIcon
            title={t('Select playback streams')}
          />
          {/* <MdSubtitles
            size={30}
            role="button"
            style={{ margin: '0 7px', color: 'var(--gray-12)', opacity: 0.7 }}
            // onClick={onIconClick}
          /> */}
        </PopoverTrigger>
        {/* <motion.div className={styles['wrapper']} initial={{ opacity: 0, transform: 'translateX(100%)' }} animate={{ opacity: 1, transform: 'translateX(0%)' }}> */}
        <PopoverContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
            {subtitleStreams.length > 0 && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div>{t('Subtitle')}</div>

              <Select
                value={activeSubtitleStreamIndex ?? ''}
                onChange={onActiveSubtitleChange2}
                onMouseMove={resetTimer}
              >
                <option value="">{t('Default')}</option>
                {subtitleStreams.map((stream, i) => (
                  <option key={stream.index} value={stream.index}>#{i + 1} (id {stream.index + 1}) {stream.tags?.language}</option>
                ))}
              </Select>
            </div>
            )}

            {videoStreams.length > 0 && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div>{t('Video track')}</div>

              <CustomSelect
                defaultValue={`${activeVideoStreamIndex ?? 'none'}`}
                onValueChange={onActiveVideoStreamChange2}
                // onMouseMove={resetTimer}
              >
                <SelectItem value="none">{t('Default')}</SelectItem>
                {videoStreams.map((stream, i) => (
                  <SelectItem key={stream.index} value={`${stream.index}`}>#{i + 1} (id {stream.index + 1}) {stream.codec_name}</SelectItem>
                ))}
              </CustomSelect>
            </div>
            )}

            {audioStreams.length > 0 && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div>{t('Audio track')}</div>

              {audioStreams.map((audioStream, i) => (
                <div key={audioStream.index}>
                  <Switch
                    style={{ verticalAlign: 'middle', marginRight: '.4em' }}
                    checked={activeAudioStreamIndexes.has(audioStream.index)}
                    onClick={(e) => e.currentTarget.blur()}
                    onCheckedChange={(checked) => handleActiveAudioStreamsChange(audioStream.index, checked)}
                  />
                  <span style={{ verticalAlign: 'middle', marginRight: '.1em' }}>
                    #{i + 1} <span style={{ opacity: 0.5 }}>(id {audioStream.index + 1}) {audioStream.codec_name} {audioStream.tags?.language}</span>
                  </span>
                </div>
              ))}
            </div>
            )}
          </div>
        </PopoverContent>
        {/* </motion.div> */}
      </Popover>
      {/* )} */}
{/*
      <MdSubtitles
        size={30}
        role="button"
        style={{ margin: '0 7px', color: 'var(--gray-12)', opacity: 0.7 }}
        onClick={onIconClick}
      /> */}
    </>
  );
}

export default memo(PlaybackStreamSelector);
