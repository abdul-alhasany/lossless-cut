import { CSSProperties, memo, useMemo } from 'react';
import i18n from 'i18next';
import { Select as CustomSelect, SelectItem } from './CustomSelect';
import allOutFormats from '../outFormats';
import { withBlur } from '../util';
import Select from './Select';

const commonVideoAudioFormats = ['matroska', 'mov', 'mp4', 'mpegts', 'ogv', 'webm'];
const commonAudioFormats = ['flac', 'ipod', 'mp3', 'oga', 'ogg', 'opus', 'wav'];
const commonSubtitleFormats = ['ass', 'srt', 'sup', 'webvtt'];

function renderFormatOptions(formats: string[]) {
  return formats.map((format) => (
    <SelectItem key={format} value={format}>{format} - {(allOutFormats as Record<string, string>)[format]}</SelectItem>
  ));
}

function OutputFormatSelect({ style, detectedFileFormat, fileFormat, onOutputFormatUserChange }: {
  style: CSSProperties, detectedFileFormat?: string | undefined, fileFormat?: string | undefined, onOutputFormatUserChange: (a: string) => void,
}) {
  const commonVideoAudioFormatsExceptDetectedFormat = useMemo(() => commonVideoAudioFormats.filter((f) => f !== detectedFileFormat), [detectedFileFormat]);
  const commonAudioFormatsExceptDetectedFormat = useMemo(() => commonAudioFormats.filter((f) => f !== detectedFileFormat), [detectedFileFormat]);
  const commonSubtitleFormatsExceptDetectedFormat = useMemo(() => commonSubtitleFormats.filter((f) => f !== detectedFileFormat), [detectedFileFormat]);
  const commonFormatsAndDetectedFormat = useMemo(() => new Set([...commonVideoAudioFormats, ...commonAudioFormats, commonSubtitleFormats, detectedFileFormat]), [detectedFileFormat]);

  const otherFormats = useMemo(() => Object.keys(allOutFormats).filter((format) => !commonFormatsAndDetectedFormat.has(format)), [commonFormatsAndDetectedFormat]);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <CustomSelect style={style} value={fileFormat || ''} label={i18n.t('Output container format:')} onChange={(value) => onOutputFormatUserChange(value)}>
      {/* <option key="disabled1" value="" disabled>{i18n.t('Output container format:')}</option> */}

      {detectedFileFormat && (
        <SelectItem key={detectedFileFormat} value={detectedFileFormat}>
          {detectedFileFormat} - {(allOutFormats as Record<string, string>)[detectedFileFormat]} {i18n.t('(detected)')}
        </SelectItem>
      )}

      <SelectItem key="disabled2" value="disabled2" disabled>--- {i18n.t('Common video/audio formats:')} ---</SelectItem>
      {renderFormatOptions(commonVideoAudioFormatsExceptDetectedFormat)}

      <SelectItem key="disabled3" value="disabled3" disabled>--- {i18n.t('Common audio formats:')} ---</SelectItem>
      {renderFormatOptions(commonAudioFormatsExceptDetectedFormat)}

      <SelectItem key="disabled4" value="disabled4" disabled>--- {i18n.t('Common subtitle formats:')} ---</SelectItem>
      {renderFormatOptions(commonSubtitleFormatsExceptDetectedFormat)}

      <SelectItem key="disabled5" value="disabled5" disabled>--- {i18n.t('All other formats:')} ---</SelectItem>
      {renderFormatOptions(otherFormats)}
    </CustomSelect>
  );
}

export default memo(OutputFormatSelect);
