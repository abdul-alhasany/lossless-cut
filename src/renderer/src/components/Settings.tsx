import { CSSProperties, ChangeEventHandler, TdHTMLAttributes, memo, useCallback, useMemo, useState } from 'react';
import { FaYinYang, FaKeyboard } from 'react-icons/fa';
import { GlobeIcon, CleanIcon, CogIcon, Button, NumericalIcon, FolderCloseIcon, DocumentIcon, TimeIcon, CrossIcon, Dialog } from 'evergreen-ui';
import { useTranslation } from 'react-i18next';
import { HTMLMotionProps, motion } from 'framer-motion';
import invariant from 'tiny-invariant';

import CaptureFormatButton from './CaptureFormatButton';
import AutoExportToggler from './AutoExportToggler';
import Switch from './Switch';
import useUserSettings from '../hooks/useUserSettings';
import { askForFfPath } from '../dialogs';
import { isMasBuild, isStoreBuild } from '../util';
import { LanguageKey, ModifierKey, TimecodeFormat, langNames } from '../../../../types';
import styles from './Settings.module.css';
import Select from './Select';

import { getModifierKeyNames } from '../hooks/useTimelineScroll';
import { TunerType } from '../types';
import Truncated from './Truncated';
import { DialogCell, DialogCellDescription, DialogRow, DialogSectionTitle } from './CustomDialog';
import { Select as CustomSelect, SelectItem } from './CustomSelect';

const Row = (props: HTMLMotionProps<'tr'>) => (
  <motion.tr
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    transition={{ duration: 0.5, ease: 'easeIn' }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  />
);
// eslint-disable-next-line react/jsx-props-no-spreading
const KeyCell = (props: TdHTMLAttributes<HTMLTableCellElement>) => <td {...props} />;

const Header = ({ title }: { title: string }) => (
  <Row className={styles['header']}>
    <th>{title}</th>
    <th />
  </Row>
);

function ModifierKeySetting({ text, value, setValue }: { text: string, value: ModifierKey, setValue: (v: ModifierKey) => void }) {
  return (
    <DialogRow>
      <DialogCell>{text}</DialogCell>
      <DialogCell alignEnd>
        <Select value={value} onChange={(e) => setValue(e.target.value as ModifierKey)}>
          {Object.entries(getModifierKeyNames()).map(([key, values]) => (
            <option key={key} value={key}>{values.join(' / ')}</option>
          ))}
        </Select>
      </DialogCell>
    </DialogRow>
  );
}
const detailsStyle: CSSProperties = { opacity: 0.75, fontSize: '.9em', marginTop: '.3em' };

function Settings({
  onTunerRequested,
  onKeyboardShortcutsDialogRequested,
  askForCleanupChoices,
  toggleStoreProjectInWorkingDir,
  simpleMode,
  clearOutDir,
}: {
  onTunerRequested: (type: TunerType) => void,
  onKeyboardShortcutsDialogRequested: () => void,
  askForCleanupChoices: () => Promise<unknown>,
  toggleStoreProjectInWorkingDir: () => Promise<void>,
  simpleMode: boolean,
  clearOutDir: () => Promise<void>,
}) {
  const { t } = useTranslation();
  const [showAdvanced, setShowAdvanced] = useState(!simpleMode);

  const { customOutDir, changeOutDir, keyframeCut, toggleKeyframeCut, timecodeFormat, setTimecodeFormat, invertCutSegments, setInvertCutSegments, askBeforeClose, setAskBeforeClose, enableAskForImportChapters, setEnableAskForImportChapters, enableAskForFileOpenAction, setEnableAskForFileOpenAction, autoSaveProjectFile, setAutoSaveProjectFile, invertTimelineScroll, setInvertTimelineScroll, language, setLanguage, hideNotifications, setHideNotifications, hideOsNotifications, setHideOsNotifications, autoLoadTimecode, setAutoLoadTimecode, enableAutoHtml5ify, setEnableAutoHtml5ify, customFfPath, setCustomFfPath, storeProjectInWorkingDir, mouseWheelZoomModifierKey, setMouseWheelZoomModifierKey, mouseWheelFrameSeekModifierKey, setMouseWheelFrameSeekModifierKey, mouseWheelKeyframeSeekModifierKey, setMouseWheelKeyframeSeekModifierKey, captureFrameMethod, setCaptureFrameMethod, captureFrameQuality, setCaptureFrameQuality, captureFrameFileNameFormat, setCaptureFrameFileNameFormat, enableNativeHevc, setEnableNativeHevc, enableUpdateCheck, setEnableUpdateCheck, allowMultipleInstances, setAllowMultipleInstances, preferStrongColors, setPreferStrongColors, treatInputFileModifiedTimeAsStart, setTreatInputFileModifiedTimeAsStart, treatOutputFileModifiedTimeAsStart, setTreatOutputFileModifiedTimeAsStart, exportConfirmEnabled, toggleExportConfirmEnabled, storeWindowBounds, setStoreWindowBounds } = useUserSettings();

  const onLangChange = useCallback((value: string) => {
    const selectedLanguage = value !== 'none' ? value : undefined;
    setLanguage(selectedLanguage as LanguageKey | undefined);
  }, [setLanguage]);

  const timecodeFormatOptions = useMemo<Record<TimecodeFormat, string>>(() => ({
    frameCount: t('Frame counts'),
    seconds: t('Total seconds'),
    timecodeWithDecimalFraction: t('Millisecond fractions'),
    timecodeWithFramesFraction: t('Frame fractions'),
  }), [t]);

  const onTimecodeFormatClick = useCallback(() => {
    const keys = Object.keys(timecodeFormatOptions) as TimecodeFormat[];
    let index = keys.indexOf(timecodeFormat);
    if (index === -1 || index >= keys.length - 1) index = 0;
    else index += 1;
    const newKey = keys[index];
    invariant(newKey != null);
    setTimecodeFormat(newKey);
  }, [setTimecodeFormat, timecodeFormat, timecodeFormatOptions]);

  const changeCustomFfPath = useCallback(async () => {
    const newCustomFfPath = await askForFfPath(customFfPath);
    setCustomFfPath(newCustomFfPath);
  }, [customFfPath, setCustomFfPath]);

  return (
    <>
      {/* <div style={{ padding: '1.5em 2em' }}>
        <div>{t('Hover mouse over buttons in the main interface to see which function they have')}</div>
      </div> */}
      <DialogSectionTitle>
        General
      </DialogSectionTitle>

      <DialogRow>
        <DialogCell>
          App language
        </DialogCell>
        <DialogCell alignEnd>
          <CustomSelect value={language || ''} onValueChange={onLangChange}>
            <SelectItem key="none" value="None">{t('System language')}</SelectItem>
            {Object.keys(langNames).map((lang) => <SelectItem key={lang} value={lang}>{langNames[lang as keyof typeof langNames]}</SelectItem>)}
          </CustomSelect>
        </DialogCell>
      </DialogRow>

      <DialogRow>
        <DialogCell htmlFor="advanced-settings">
          {t('Show advanced settings')}
          <DialogCellDescription>
            {!showAdvanced ? t('Advanced settings are currently not visible.') : t('Advanced settings are currently visible.')}
          </DialogCellDescription>
        </DialogCell>
        <DialogCell alignEnd>
          <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} id="advanced-settings" />
        </DialogCell>
      </DialogRow>

      <DialogRow>
        <DialogCell htmlFor="export-confirm">
          {t('Show export options screen before exporting?')}
          <div style={detailsStyle}>
            {t('This gives you an overview of the export and allows you to customise more parameters before exporting, like changing the output file name.')}
          </div>
        </DialogCell>
        <DialogCell alignEnd>
          <Switch checked={exportConfirmEnabled} onCheckedChange={toggleExportConfirmEnabled} id="export-confirm" />
        </DialogCell>
      </DialogRow>

      {showAdvanced && (
        <>
          <DialogRow>
            <DialogCell htmlFor="auto-save-project">
              {t('Auto save project file?')}<br />
            </DialogCell>
            <DialogCell alignEnd>
              <Switch checked={autoSaveProjectFile} onCheckedChange={setAutoSaveProjectFile} id="auto-save-project" />
            </DialogCell>
          </DialogRow>

          <DialogRow>
            <DialogCell>
              {t('Store project file (.llc) in the working directory or next to loaded media file?')}
            </DialogCell>
            <DialogCell alignEnd>
              <Button iconBefore={storeProjectInWorkingDir ? FolderCloseIcon : DocumentIcon} disabled={!autoSaveProjectFile} onClick={toggleStoreProjectInWorkingDir}>
                {storeProjectInWorkingDir ? t('Store in working directory') : t('Store next to media file')}
              </Button>
            </DialogCell>
          </DialogRow>


          {!isMasBuild && (
          <DialogRow>
            <DialogCell>
              {t('Custom FFmpeg directory (experimental)')}<br />
              <div style={detailsStyle}>
                {t('This allows you to specify custom FFmpeg and FFprobe binaries to use. Make sure the "ffmpeg" and "ffprobe" executables exist in the same directory, and then select the directory.')}
              </div>
            </DialogCell>
            <DialogCell alignEnd>
              <Button iconBefore={CogIcon} onClick={changeCustomFfPath}>
                {customFfPath ? t('Using external ffmpeg') : t('Using built-in ffmpeg')}
              </Button>
              <Truncated maxWidth="15em">{customFfPath}</Truncated>
            </DialogCell>
          </DialogRow>
          )}

            {!isStoreBuild && (
            <DialogRow>
              <DialogCell htmlFor="check-for-updates">{t('Check for updates on startup?')}</DialogCell>
              <DialogCell alignEnd>
                <Switch checked={enableUpdateCheck} onCheckedChange={setEnableUpdateCheck} id="check-for-updates" />
              </DialogCell>
            </DialogRow>
            )}

          <DialogRow>
            <DialogCell htmlFor="allow-multiple-instances">
              {t('Allow multiple instances of LosslessCut to run concurrently? (experimental)')}
            </DialogCell>
            <DialogCell alignEnd>
              <Switch checked={allowMultipleInstances} onCheckedChange={setAllowMultipleInstances} id="allow-multiple-instances" />
            </DialogCell>
          </DialogRow>
        </>
      )}

      <DialogSectionTitle>
        {t('Options affecting exported files')}
      </DialogSectionTitle>

      <DialogRow>
        <DialogCell>
          {t('Choose cutting mode')}
          <DialogCellDescription>
            {invertCutSegments ? (
              <>{t('The video inside segments will be discarded, while the video surrounding them will be kept.')}</>
            ) : (
              <>{t('The video inside segments will be kept, while the video outside will be discarded.')}</>
            )}
          </DialogCellDescription>
        </DialogCell>
        <DialogCell alignEnd>
          <Button iconBefore={FaYinYang} appearance="primary" intent={invertCutSegments ? 'danger' : 'success'} onClick={() => setInvertCutSegments((v) => !v)}>
            {invertCutSegments ? t('Remove') : t('Keep')}
          </Button>
        </DialogCell>
      </DialogRow>

      <DialogRow>
        <DialogCell>
          {t('Working directory')}<br />
          <div style={detailsStyle}>
            {t('This is where working files and exported files are stored.')}
          </div>
        </DialogCell>
        <DialogCell alignEnd>
          <Truncated maxWidth="15em">{customOutDir}</Truncated>
          <Button iconBefore={customOutDir ? FolderCloseIcon : DocumentIcon} onClick={changeOutDir}>
            {customOutDir ? t('Custom working directory') : t('Same directory as input file')}...
          </Button>
          {customOutDir && (
          <Button
            height={20}
            iconBefore={CrossIcon}
            onClick={clearOutDir}
          >
            {t('Clear working directory')}
          </Button>
          )}
        </DialogCell>
      </DialogRow>

      {showAdvanced && (
      <DialogRow>
        <DialogCell>{t('Set file modification date/time of output files to:')}</DialogCell>
        <DialogCell alignEnd>
          <Select value={typeof treatOutputFileModifiedTimeAsStart === 'boolean' ? String(treatOutputFileModifiedTimeAsStart) : 'disabled'} onChange={(e) => setTreatOutputFileModifiedTimeAsStart(e.target.value === 'disabled' ? null : (e.target.value === 'true'))}>
            <option value="disabled">{t('Current time')}</option>
            <option value="true">{t('Source file\'s time plus segment start cut time')}</option>
            <option value="false">{t('Source file\'s time minus segment end cut time')}</option>
          </Select>
        </DialogCell>
      </DialogRow>
      )}

      {showAdvanced && (
      <DialogRow>
        <DialogCell>{t('Treat source file modification date/time as:')}</DialogCell>
        <DialogCell alignEnd>
          <Select disabled={treatOutputFileModifiedTimeAsStart == null} value={String(treatInputFileModifiedTimeAsStart)} onChange={(e) => setTreatInputFileModifiedTimeAsStart((e.target.value === 'true'))}>
            <option value="true">{t('Start of video')}</option>
            <option value="false">{t('End of video')}</option>
          </Select>
        </DialogCell>
      </DialogRow>
      )}

      <DialogRow>
        <DialogCell>
          {t('Keyframe cut mode')}<br />
          <div style={detailsStyle}>
            {keyframeCut ? (
              <>
                <b>{t('Keyframe cut')}</b>: {t('Cut at the preceding keyframe (not accurate time.) Equiv to')}:<br />
                <code className="highlighted">ffmpeg -ss -i input.mp4</code>
              </>
            ) : (
              <>
                <b>{t('Normal cut')}</b>: {t('Accurate time but could leave an empty portion at the beginning of the video. Equiv to')}:<br />
                <code className="highlighted">ffmpeg -i -ss input.mp4</code>
              </>
            )}
          </div>
        </DialogCell>
        <DialogCell alignEnd>
          <Switch checked={keyframeCut} onCheckedChange={() => toggleKeyframeCut()} />
        </DialogCell>
      </DialogRow>

      <DialogRow>
        <DialogCell>{t('Cleanup files after export?')}</DialogCell>
        <DialogCell alignEnd>
          <Button iconBefore={<CleanIcon />} onClick={askForCleanupChoices}>{t('Change preferences')}</Button>
        </DialogCell>
      </DialogRow>

      {showAdvanced && (
      <DialogRow>
        <DialogCell>
          {t('Extract unprocessable tracks to separate files or discard them?')}<br />
          <div style={detailsStyle}>
            {t('(data tracks such as GoPro GPS, telemetry etc. are not copied over by default because ffmpeg cannot cut them, thus they will cause the media duration to stay the same after cutting video/audio)')}
          </div>
        </DialogCell>
        <DialogCell alignEnd>
          <AutoExportToggler />
        </DialogCell>
      </DialogRow>
      )}

      <DialogSectionTitle>
        {t('Snapshots and frame extraction')}
      </DialogSectionTitle>

      <DialogRow>
        <DialogCell>
          {t('Snapshot capture format')}
        </DialogCell>
        <DialogCell alignEnd>
          <CaptureFormatButton showIcon style={{ padding: '.5em 1em' }} />
        </DialogCell>
      </DialogRow>

      {showAdvanced && (
      <DialogRow>
        <DialogCell>
          {t('Snapshot capture method')}
          <DialogCellDescription>{t('FFmpeg capture method might sometimes capture more correct colors, but the captured snapshot might be off by one or more frames, relative to the preview.')}</DialogCellDescription>
        </DialogCell>
        <DialogCell alignEnd>
          <Button onClick={() => setCaptureFrameMethod((existing) => (existing === 'ffmpeg' ? 'videotag' : 'ffmpeg'))}>
            {captureFrameMethod === 'ffmpeg' ? t('FFmpeg') : t('HTML video tag')}
          </Button>
        </DialogCell>
      </DialogRow>
      )}

      <DialogRow>
        <DialogCell>{t('Snapshot capture quality')}</DialogCell>
        <DialogCell alignEnd>
          <input type="range" min={1} max={1000} style={{ width: 200 }} value={Math.round(captureFrameQuality * 1000)} onChange={(e) => setCaptureFrameQuality(Math.max(Math.min(1, parseInt(e.target.value, 10) / 1000), 0))} /><br />
          {Math.round(captureFrameQuality * 100)}%
        </DialogCell>
      </DialogRow>

      {showAdvanced && (
      <DialogRow>
        <DialogCell>
          {t('File names of extracted video frames')}
          <DialogCellDescription>{t('Note that this only applies when extracting multiple frames. When "Frame number" is selected, frame numbers are relative to the start of the segment (starting from 1).')}</DialogCellDescription>
        </DialogCell>
        <DialogCell alignEnd>
          <Button iconBefore={captureFrameFileNameFormat === 'timestamp' ? TimeIcon : NumericalIcon} onClick={() => setCaptureFrameFileNameFormat((existing) => (existing === 'timestamp' ? 'index' : 'timestamp'))}>
            {captureFrameFileNameFormat === 'timestamp' ? t('Frame timestamp') : t('Frame number')}
          </Button>
        </DialogCell>
      </DialogRow>
      )}

      <DialogSectionTitle>
        {t('Keyboard, mouse and input')}
      </DialogSectionTitle>

      <DialogRow>
        <DialogCell>{t('Keyboard & mouse shortcuts')}</DialogCell>
        <DialogCell alignEnd>
          <Button iconBefore={<FaKeyboard />} onClick={onKeyboardShortcutsDialogRequested}>{t('Keyboard & mouse shortcuts')}</Button>
        </DialogCell>
      </DialogRow>

      <ModifierKeySetting text={t('Mouse wheel zoom modifier key')} value={mouseWheelZoomModifierKey} setValue={setMouseWheelZoomModifierKey} />
      <ModifierKeySetting text={t('Mouse wheel frame seek modifier key')} value={mouseWheelFrameSeekModifierKey} setValue={setMouseWheelFrameSeekModifierKey} />
      <ModifierKeySetting text={t('Mouse wheel keyframe seek modifier key')} value={mouseWheelKeyframeSeekModifierKey} setValue={setMouseWheelKeyframeSeekModifierKey} />

      <DialogRow>
        <DialogCell>{t('Timeline trackpad/wheel sensitivity')}</DialogCell>
        <DialogCell alignEnd>
          <Button iconBefore={CogIcon} onClick={() => onTunerRequested('wheelSensitivity')}>{t('Change value')}</Button>
        </DialogCell>
      </DialogRow>

      <DialogRow>
        <DialogCell>{t('Timeline keyboard seek interval')}</DialogCell>
        <DialogCell alignEnd>
          <Button iconBefore={CogIcon} onClick={() => onTunerRequested('keyboardNormalSeekSpeed')}>{t('Change value')}</Button>
        </DialogCell>
      </DialogRow>

      <DialogRow>
        <DialogCell>{t('Timeline keyboard seek interval (longer)')}</DialogCell>
        <DialogCell alignEnd>
          <Button iconBefore={CogIcon} onClick={() => onTunerRequested('keyboardSeekSpeed2')}>{t('Change value')}</Button>
        </DialogCell>
      </DialogRow>

      <DialogRow>
        <DialogCell>{t('Timeline keyboard seek interval (longest)')}</DialogCell>
        <DialogCell alignEnd>
          <Button iconBefore={CogIcon} onClick={() => onTunerRequested('keyboardSeekSpeed3')}>{t('Change value')}</Button>
        </DialogCell>
      </DialogRow>

      <DialogRow>
        <DialogCell>{t('Timeline keyboard seek acceleration')}</DialogCell>
        <DialogCell alignEnd>
          <Button iconBefore={CogIcon} onClick={() => onTunerRequested('keyboardSeekAccFactor')}>{t('Change value')}</Button>
        </DialogCell>
      </DialogRow>

      <DialogRow>
        <DialogCell htmlFor="invert-timeline-scroll">{t('Invert timeline trackpad/wheel direction?')}</DialogCell>
        <DialogCell alignEnd>
          <Switch checked={invertTimelineScroll ?? false} onCheckedChange={setInvertTimelineScroll} id="invert-timeline-scroll" />
        </DialogCell>
      </DialogRow>
      <DialogSectionTitle>
        {t('User interface')}
      </DialogSectionTitle>

      {showAdvanced && (
      <DialogRow>
        <DialogCell htmlFor="remember-window-bounds">{t('Remember window size and position')}</DialogCell>
        <DialogCell alignEnd>
          <Switch checked={storeWindowBounds} onCheckedChange={setStoreWindowBounds} id="remember-window-bounds" />
        </DialogCell>
      </DialogRow>
      )}

      {showAdvanced && (
      <DialogRow>
        <DialogCell>{t('Waveform height')}</DialogCell>
        <DialogCell alignEnd>
          <Button iconBefore={CogIcon} onClick={() => onTunerRequested('waveformHeight')}>{t('Change value')}</Button>
        </DialogCell>
      </DialogRow>
      )}

      {showAdvanced && (
      <DialogRow>
        <DialogCell htmlFor="auto-load-timecode">{t('Auto load timecode from file as an offset in the timeline?')}</DialogCell>
        <DialogCell alignEnd>
          <Switch checked={autoLoadTimecode} onCheckedChange={setAutoLoadTimecode} id="auto-load-timecode" />
        </DialogCell>
      </DialogRow>
      )}

      {showAdvanced && (
      <DialogRow>
        <DialogCell htmlFor="enable-native-hevc">{t('Enable HEVC / H265 hardware decoding (you may need to turn this off if you have problems with HEVC files)')}</DialogCell>
        <DialogCell alignEnd>
          <Switch checked={enableNativeHevc} onCheckedChange={setEnableNativeHevc} id="enable-native-hevc" />
        </DialogCell>
      </DialogRow>
      )}

      {showAdvanced && (
      <DialogRow>
        <DialogCell htmlFor="enable-auto-html5ify">{t('Try to automatically convert to supported format when opening unsupported file?')}</DialogCell>
        <DialogCell alignEnd>
          <Switch checked={enableAutoHtml5ify} onCheckedChange={setEnableAutoHtml5ify} id="enable-auto-html5ify" />
        </DialogCell>
      </DialogRow>
      )}

      <DialogRow>
        <DialogCell htmlFor="prefer-strong-colors">{t('Prefer strong colors')}</DialogCell>
        <DialogCell alignEnd>
          <Switch checked={preferStrongColors} onCheckedChange={setPreferStrongColors} id="prefer-strong-colors" />
        </DialogCell>
      </DialogRow>

      <DialogRow>
        <DialogCell>{t('In timecode show')}</DialogCell>
        <DialogCell alignEnd>
          <Button iconBefore={timecodeFormat === 'frameCount' ? NumericalIcon : TimeIcon} onClick={onTimecodeFormatClick}>
            {timecodeFormatOptions[timecodeFormat]}
          </Button>
        </DialogCell>
      </DialogRow>

      <DialogSectionTitle>
        {t('Prompts and dialogs')}
      </DialogSectionTitle>


      <DialogRow>
        <DialogCell htmlFor="show-notifications">{t('Show notifications')}</DialogCell>
        <DialogCell alignEnd>
          <Switch checked={!hideOsNotifications} onCheckedChange={(v) => setHideOsNotifications(v ? undefined : 'all')} id="show-notifications"/>
        </DialogCell>
      </DialogRow>

      <DialogRow>
        <DialogCell htmlFor="show-informational-notifications">{t('Show informational in-app notifications')}</DialogCell>
        <DialogCell alignEnd>
          <Switch checked={!hideNotifications} onCheckedChange={(v) => setHideNotifications(v ? undefined : 'all')} id="show-informational-notifications"/>
        </DialogCell>
      </DialogRow>

      <DialogRow>
        <DialogCell htmlFor="ask-before-close">{t('Ask for confirmation when closing app or file?')}</DialogCell>
        <DialogCell alignEnd>
          <Switch checked={askBeforeClose} onCheckedChange={setAskBeforeClose} id="ask-before-close" />
        </DialogCell>
      </DialogRow>

      {showAdvanced && (
      <DialogRow>
        <DialogCell htmlFor="ask-for-file-open-action">{t('Ask about what to do when opening a new file when another file is already already open?')}</DialogCell>
        <DialogCell alignEnd>
          <Switch checked={enableAskForFileOpenAction} onCheckedChange={setEnableAskForFileOpenAction} id="ask-for-file-open-action" />
        </DialogCell>
      </DialogRow>
      )}

      {showAdvanced && (
      <DialogRow>
        <DialogCell htmlFor="ask-for-import-chapters">{t('Ask about importing chapters from opened file?')}</DialogCell>
        <DialogCell alignEnd>
          <Switch checked={enableAskForImportChapters} onCheckedChange={setEnableAskForImportChapters} id="ask-for-import-chapters" />
        </DialogCell>
      </DialogRow>
      )}

      {/* <table className={styles['settings']}>
        <thead>
          <tr className={styles['header']}>
            <th>{t('Settings')}</th>
            <th style={{ width: 300 }}>{t('Current setting')}</th>
          </tr>
        </thead>

        <tbody>
          <Row>
            <KeyCell><GlobeIcon style={{ verticalAlign: 'middle', marginRight: '.5em' }} /> App language</KeyCell>
            <td>
              <Select value={language || ''} onChange={onLangChange} style={{ fontSize: '1.2em' }}>
                <option key="" value="">{t('System language')}</option>
                {Object.keys(langNames).map((lang) => <option key={lang} value={lang}>{langNames[lang as keyof typeof langNames]}</option>)}
              </Select>
            </td>
          </Row>

          <Row>
            <KeyCell>
              {t('Show advanced settings')}
              <div style={detailsStyle}>
                {!showAdvanced && t('Advanced settings are currently not visible.')}
              </div>
            </KeyCell>
            <td>
              <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} />
            </td>
          </Row>

          <Row>
            <KeyCell>
              {t('Show export options screen before exporting?')}
              <div style={detailsStyle}>
                {t('This gives you an overview of the export and allows you to customise more parameters before exporting, like changing the output file name.')}
              </div>
            </KeyCell>
            <td>
              <Switch checked={exportConfirmEnabled} onCheckedChange={toggleExportConfirmEnabled} />
            </td>
          </Row>

          {showAdvanced && (
            <Row>
              <KeyCell>
                {t('Auto save project file?')}<br />
              </KeyCell>
              <td>
                <Switch checked={autoSaveProjectFile} onCheckedChange={setAutoSaveProjectFile} />
              </td>
            </Row>
          )}

          {showAdvanced && (
            <Row>
              <KeyCell>{t('Store project file (.llc) in the working directory or next to loaded media file?')}</KeyCell>
              <td>
                <Button iconBefore={storeProjectInWorkingDir ? FolderCloseIcon : DocumentIcon} disabled={!autoSaveProjectFile} onClick={toggleStoreProjectInWorkingDir}>
                  {storeProjectInWorkingDir ? t('Store in working directory') : t('Store next to media file')}
                </Button>
              </td>
            </Row>
          )}

          {showAdvanced && !isMasBuild && (
            <Row>
              <KeyCell>
                {t('Custom FFmpeg directory (experimental)')}<br />
                <div style={detailsStyle}>
                  {t('This allows you to specify custom FFmpeg and FFprobe binaries to use. Make sure the "ffmpeg" and "ffprobe" executables exist in the same directory, and then select the directory.')}
                </div>
              </KeyCell>
              <td>
                <Button iconBefore={CogIcon} onClick={changeCustomFfPath}>
                  {customFfPath ? t('Using external ffmpeg') : t('Using built-in ffmpeg')}
                </Button>
                <Truncated maxWidth="15em">{customFfPath}</Truncated>
              </td>
            </Row>
          )}

          {showAdvanced && !isStoreBuild && (
            <Row>
              <KeyCell>{t('Check for updates on startup?')}</KeyCell>
              <td>
                <Switch checked={enableUpdateCheck} onCheckedChange={setEnableUpdateCheck} />
              </td>
            </Row>
          )}

          {showAdvanced && (
            <Row>
              <KeyCell>{t('Allow multiple instances of LosslessCut to run concurrently? (experimental)')}</KeyCell>
              <td>
                <Switch checked={allowMultipleInstances} onCheckedChange={setAllowMultipleInstances} />
              </td>
            </Row>
          )}


          <Header title={t('Options affecting exported files')} />

          <Row>
            <KeyCell>
              {t('Choose cutting mode: Remove or keep selected segments from video when exporting?')}<br />
              <div style={detailsStyle}>
                {invertCutSegments ? (
                  <><b>{t('Remove')}</b>: {t('The video inside segments will be discarded, while the video surrounding them will be kept.')}</>
                ) : (
                  <><b>{t('Keep')}</b>: {t('The video inside segments will be kept, while the video outside will be discarded.')}</>
                )}
              </div>
            </KeyCell>
            <td>
              <Button iconBefore={FaYinYang} appearance="primary" intent={invertCutSegments ? 'danger' : 'success'} onClick={() => setInvertCutSegments((v) => !v)}>
                {invertCutSegments ? t('Remove') : t('Keep')}
              </Button>
            </td>
          </Row>

          <Row>
            <KeyCell>
              {t('Working directory')}<br />
              <div style={detailsStyle}>
                {t('This is where working files and exported files are stored.')}
              </div>
            </KeyCell>
            <td>
              <Truncated maxWidth="15em">{customOutDir}</Truncated>
              <Button iconBefore={customOutDir ? FolderCloseIcon : DocumentIcon} onClick={changeOutDir}>
                {customOutDir ? t('Custom working directory') : t('Same directory as input file')}...
              </Button>
              {customOutDir && (
                <Button
                  height={20}
                  iconBefore={CrossIcon}
                  onClick={clearOutDir}
                >
                  {t('Clear working directory')}
                </Button>
              )}
            </td>
          </Row>

          {showAdvanced && (
            <Row>
              <KeyCell>{t('Set file modification date/time of output files to:')}</KeyCell>
              <td>
                <Select value={typeof treatOutputFileModifiedTimeAsStart === 'boolean' ? String(treatOutputFileModifiedTimeAsStart) : 'disabled'} onChange={(e) => setTreatOutputFileModifiedTimeAsStart(e.target.value === 'disabled' ? null : (e.target.value === 'true'))}>
                  <option value="disabled">{t('Current time')}</option>
                  <option value="true">{t('Source file\'s time plus segment start cut time')}</option>
                  <option value="false">{t('Source file\'s time minus segment end cut time')}</option>
                </Select>
              </td>
            </Row>
          )}

          {showAdvanced && (
            <Row>
              <KeyCell>{t('Treat source file modification date/time as:')}</KeyCell>
              <td>
                <Select disabled={treatOutputFileModifiedTimeAsStart == null} value={String(treatInputFileModifiedTimeAsStart)} onChange={(e) => setTreatInputFileModifiedTimeAsStart((e.target.value === 'true'))}>
                  <option value="true">{t('Start of video')}</option>
                  <option value="false">{t('End of video')}</option>
                </Select>
              </td>
            </Row>
          )}

          <Row>
            <KeyCell>
              {t('Keyframe cut mode')}<br />
              <div style={detailsStyle}>
                {keyframeCut ? (
                  <>
                    <b>{t('Keyframe cut')}</b>: {t('Cut at the preceding keyframe (not accurate time.) Equiv to')}:<br />
                    <code className="highlighted">ffmpeg -ss -i input.mp4</code>
                  </>
                ) : (
                  <>
                    <b>{t('Normal cut')}</b>: {t('Accurate time but could leave an empty portion at the beginning of the video. Equiv to')}:<br />
                    <code className="highlighted">ffmpeg -i -ss input.mp4</code>
                  </>
                )}
              </div>
            </KeyCell>
            <td>
              <Switch checked={keyframeCut} onCheckedChange={() => toggleKeyframeCut()} />
            </td>
          </Row>

          <Row>
            <KeyCell>{t('Cleanup files after export?')}</KeyCell>
            <td>
              <Button iconBefore={<CleanIcon />} onClick={askForCleanupChoices}>{t('Change preferences')}</Button>
            </td>
          </Row>

          {showAdvanced && (
            <Row>
              <KeyCell>
                {t('Extract unprocessable tracks to separate files or discard them?')}<br />
                <div style={detailsStyle}>
                  {t('(data tracks such as GoPro GPS, telemetry etc. are not copied over by default because ffmpeg cannot cut them, thus they will cause the media duration to stay the same after cutting video/audio)')}
                </div>
              </KeyCell>
              <td>
                <AutoExportToggler />
              </td>
            </Row>
          )}

          <Header title={t('Snapshots and frame extraction')} />

          <Row>
            <KeyCell>
              {t('Snapshot capture format')}
            </KeyCell>
            <td>
              <CaptureFormatButton showIcon style={{ padding: '.5em 1em' }} />
            </td>
          </Row>

          {showAdvanced && (
            <Row>
              <KeyCell>
                {t('Snapshot capture method')}
                <div style={detailsStyle}>{t('FFmpeg capture method might sometimes capture more correct colors, but the captured snapshot might be off by one or more frames, relative to the preview.')}</div>
              </KeyCell>
              <td>
                <Button onClick={() => setCaptureFrameMethod((existing) => (existing === 'ffmpeg' ? 'videotag' : 'ffmpeg'))}>
                  {captureFrameMethod === 'ffmpeg' ? t('FFmpeg') : t('HTML video tag')}
                </Button>
              </td>
            </Row>
          )}

          <Row>
            <KeyCell>{t('Snapshot capture quality')}</KeyCell>
            <td>
              <input type="range" min={1} max={1000} style={{ width: 200 }} value={Math.round(captureFrameQuality * 1000)} onChange={(e) => setCaptureFrameQuality(Math.max(Math.min(1, parseInt(e.target.value, 10) / 1000), 0))} /><br />
              {Math.round(captureFrameQuality * 100)}%
            </td>
          </Row>

          {showAdvanced && (
            <Row>
              <KeyCell>
                {t('File names of extracted video frames')}
                <div style={detailsStyle}>{t('Note that this only applies when extracting multiple frames. When "Frame number" is selected, frame numbers are relative to the start of the segment (starting from 1).')}</div>
              </KeyCell>
              <td>
                <Button iconBefore={captureFrameFileNameFormat === 'timestamp' ? TimeIcon : NumericalIcon} onClick={() => setCaptureFrameFileNameFormat((existing) => (existing === 'timestamp' ? 'index' : 'timestamp'))}>
                  {captureFrameFileNameFormat === 'timestamp' ? t('Frame timestamp') : t('Frame number')}
                </Button>
              </td>
            </Row>
          )}


          <Header title={t('Keyboard, mouse and input')} />

          <Row>
            <KeyCell>{t('Keyboard & mouse shortcuts')}</KeyCell>
            <td>
              <Button iconBefore={<FaKeyboard />} onClick={onKeyboardShortcutsDialogRequested}>{t('Keyboard & mouse shortcuts')}</Button>
            </td>
          </Row>

          <ModifierKeySetting text={t('Mouse wheel zoom modifier key')} value={mouseWheelZoomModifierKey} setValue={setMouseWheelZoomModifierKey} />
          <ModifierKeySetting text={t('Mouse wheel frame seek modifier key')} value={mouseWheelFrameSeekModifierKey} setValue={setMouseWheelFrameSeekModifierKey} />
          <ModifierKeySetting text={t('Mouse wheel keyframe seek modifier key')} value={mouseWheelKeyframeSeekModifierKey} setValue={setMouseWheelKeyframeSeekModifierKey} />

          <Row>
            <KeyCell>{t('Timeline trackpad/wheel sensitivity')}</KeyCell>
            <td>
              <Button iconBefore={CogIcon} onClick={() => onTunerRequested('wheelSensitivity')}>{t('Change value')}</Button>
            </td>
          </Row>

          <Row>
            <KeyCell>{t('Timeline keyboard seek interval')}</KeyCell>
            <td>
              <Button iconBefore={CogIcon} onClick={() => onTunerRequested('keyboardNormalSeekSpeed')}>{t('Change value')}</Button>
            </td>
          </Row>

          <Row>
            <KeyCell>{t('Timeline keyboard seek interval (longer)')}</KeyCell>
            <td>
              <Button iconBefore={CogIcon} onClick={() => onTunerRequested('keyboardSeekSpeed2')}>{t('Change value')}</Button>
            </td>
          </Row>

          <Row>
            <KeyCell>{t('Timeline keyboard seek interval (longest)')}</KeyCell>
            <td>
              <Button iconBefore={CogIcon} onClick={() => onTunerRequested('keyboardSeekSpeed3')}>{t('Change value')}</Button>
            </td>
          </Row>

          <Row>
            <KeyCell>{t('Timeline keyboard seek acceleration')}</KeyCell>
            <td>
              <Button iconBefore={CogIcon} onClick={() => onTunerRequested('keyboardSeekAccFactor')}>{t('Change value')}</Button>
            </td>
          </Row>

          <Row>
            <KeyCell>{t('Invert timeline trackpad/wheel direction?')}</KeyCell>
            <td>
              <Switch checked={invertTimelineScroll ?? false} onCheckedChange={setInvertTimelineScroll} />
            </td>
          </Row>


          <Header title={t('User interface')} />

          {showAdvanced && (
            <Row>
              <KeyCell>{t('Remember window size and position')}</KeyCell>
              <td>
                <Switch checked={storeWindowBounds} onCheckedChange={setStoreWindowBounds} />
              </td>
            </Row>
          )}

          {showAdvanced && (
            <Row>
              <KeyCell>{t('Waveform height')}</KeyCell>
              <td>
                <Button iconBefore={CogIcon} onClick={() => onTunerRequested('waveformHeight')}>{t('Change value')}</Button>
              </td>
            </Row>
          )}

          {showAdvanced && (
            <Row>
              <KeyCell>{t('Auto load timecode from file as an offset in the timeline?')}</KeyCell>
              <td>
                <Switch checked={autoLoadTimecode} onCheckedChange={setAutoLoadTimecode} />
              </td>
            </Row>
          )}

          {showAdvanced && (
            <Row>
              <KeyCell>{t('Enable HEVC / H265 hardware decoding (you may need to turn this off if you have problems with HEVC files)')}</KeyCell>
              <td>
                <Switch checked={enableNativeHevc} onCheckedChange={setEnableNativeHevc} />
              </td>
            </Row>
          )}

          {showAdvanced && (
            <Row>
              <KeyCell>{t('Try to automatically convert to supported format when opening unsupported file?')}</KeyCell>
              <td>
                <Switch checked={enableAutoHtml5ify} onCheckedChange={setEnableAutoHtml5ify} />
              </td>
            </Row>
          )}

          <Row>
            <KeyCell>{t('Prefer strong colors')}</KeyCell>
            <td>
              <Switch checked={preferStrongColors} onCheckedChange={setPreferStrongColors} />
            </td>
          </Row>

          <Row>
            <KeyCell>{t('In timecode show')}</KeyCell>
            <td>
              <Button iconBefore={timecodeFormat === 'frameCount' ? NumericalIcon : TimeIcon} onClick={onTimecodeFormatClick}>
                {timecodeFormatOptions[timecodeFormat]}
              </Button>
            </td>
          </Row>


          <Header title={t('Prompts and dialogs')} />

          <Row>
            <KeyCell>{t('Show notifications')}</KeyCell>
            <td>
              <Switch checked={!hideOsNotifications} onCheckedChange={(v) => setHideOsNotifications(v ? undefined : 'all')} />
            </td>
          </Row>

          <Row>
            <KeyCell>{t('Show informational in-app notifications')}</KeyCell>
            <td>
              <Switch checked={!hideNotifications} onCheckedChange={(v) => setHideNotifications(v ? undefined : 'all')} />
            </td>
          </Row>

          <Row>
            <KeyCell>{t('Ask for confirmation when closing app or file?')}</KeyCell>
            <td>
              <Switch checked={askBeforeClose} onCheckedChange={setAskBeforeClose} />
            </td>
          </Row>

          {showAdvanced && (
            <Row>
              <KeyCell>{t('Ask about what to do when opening a new file when another file is already already open?')}</KeyCell>
              <td>
                <Switch checked={enableAskForFileOpenAction} onCheckedChange={setEnableAskForFileOpenAction} />
              </td>
            </Row>
          )}

          {showAdvanced && (
            <Row>
              <KeyCell>{t('Ask about importing chapters from opened file?')}</KeyCell>
              <td>
                <Switch checked={enableAskForImportChapters} onCheckedChange={setEnableAskForImportChapters} />
              </td>
            </Row>
          )}
        </tbody>
      </table> */}
    </>
  );
}

export default memo(Settings);
