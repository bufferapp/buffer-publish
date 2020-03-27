/**
 * Component that inserts a transparent layer with uploading abilities
 * inside another component.
 *
 * Note: The component is transparent as it's expected to be displayed
 * on top of any UI to unleash its uploading power: make sure that it's
 * the last child of that parent, or play with z-index, in order for it
 * to register clicks. The parent should be positioned.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import preventXss from 'xss';
import { Button } from '@bufferapp/ui';
import { stringTokenizer } from '@bufferapp/publish-i18n';
import styled from 'styled-components';

import {
  getHumanReadableSize,
  getFileTypeFromPath,
} from '@bufferapp/publish-composer/composer/utils/StringUtils';
import createFileUploaderCallback from '../../utils/DraftUploader';

const ContentTypeMediaTypeMap = new Map([
  ['JPG', 'IMAGE'],
  ['JPEG', 'IMAGE'],
  ['PNG', 'IMAGE'],
  ['GIF', 'GIF'],
  ['MOV', 'VIDEO'],
  ['MP4', 'VIDEO'],
  ['M4V', 'VIDEO'],
  ['AVI', 'VIDEO'],
]);

const ButtonWithStyles = styled(Button)`
  color: transparent !important;
  background: transparent !important;
  border: 0 !important;
  position: absolute !important;
  width: 0;
  height: 0;
`;

const DropzoneWithStyles = styled(Dropzone)`
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: none;

  :focus {
    outline: none;
  }
`;

class UploadZone extends React.Component {
  onUploadButtonClick = () => {
    const { disabled } = this.props;
    if (disabled) return;
    this.dropzone.open();
  };

  onDrop = (files, rejected, event) => {
    /*
     * Stop event propagation.
     * If we dont' do this, file drops may propogate up from Dropzone to `react-dnd`
     * and throw errors in the console; https://github.com/react-dnd/react-dnd/issues/457
     *
     * This was happening with the story groups composer when dropping a file on
     * one of the cards. (Though the error wasn't crashing the app; it just added
     * noise to our Bugsnag reporting.)
     */
    event.stopPropagation();

    const { disabled } = this.props;
    if (disabled) return;

    this.cleanUpNotifications();
    if (files.length === 0) return;

    this.uploadFiles(files);
  };

  getUploadableNewFiles = files => {
    const { uploadFormatsConfig, queueError, translations } = this.props;

    let invalidFormatFilesCount = 0;

    const validFiles = files.filter(file => {
      const fileFormat = getFileTypeFromPath(file.name).toUpperCase();

      if (!uploadFormatsConfig.has(fileFormat)) {
        invalidFormatFilesCount++;
        return false;
      }

      const uploadFormatConfig = uploadFormatsConfig.get(fileFormat);
      if (file.size > uploadFormatConfig.maxSize) {
        const formattedMaxSize = getHumanReadableSize(
          uploadFormatConfig.maxSize
        );
        let message = translations.invalidFileSize;
        message = stringTokenizer(message, '{fileName}', preventXss(file.name));
        message = stringTokenizer(
          message,
          '{formattedMaxSize}',
          formattedMaxSize
        );

        queueError({ message });
        return false;
      }

      return true;
    });

    if (invalidFormatFilesCount > 0) {
      const acceptedFilesText = [...uploadFormatsConfig.keys()].join(', ');
      let message;

      if (invalidFormatFilesCount > 1) {
        if (invalidFormatFilesCount === files.length) {
          message = translations.invalidFormatCantUseAnyFiles;
        } else {
          message = translations.invalidFormatCantUseSomeFiles;
        }
      } else if (invalidFormatFilesCount === 1) {
        if (files.length > 1) {
          message = translations.invalidFormatCantOneOfFiles;
        } else {
          message = translations.invalidFormatCantSingleFile;
        }
      }

      //we want to insert our tokenized accepedFilesText string into our message where appropriate
      message = stringTokenizer(
        message,
        '{acceptedFilesText}',
        acceptedFilesText
      );

      queueError({ message });
    }

    return validFiles;
  };

  uploadFiles = files => {
    const {
      draftId,
      service,
      uploadDraftFile,
      mixedMediaUnsupportedCallback,
      uploadType,
      notifiers,
      supportsMixedMediaTypes,
    } = this.props;
    const { maxAttachableImagesCount } = service;

    const fileMediaTypes = files.map(file =>
      ContentTypeMediaTypeMap.get(getFileTypeFromPath(file.name).toUpperCase())
    );
    if (!supportsMixedMediaTypes) {
      const uniqueFileMediaTypes = [...new Set(fileMediaTypes)].filter(
        v => !!v
      );
      const containsMixedMediaTypes = uniqueFileMediaTypes.length > 1;

      if (containsMixedMediaTypes) {
        mixedMediaUnsupportedCallback(service);
        return;
      }
    }

    // Truncate files to upload to the max attachable images count
    if (files.length > maxAttachableImagesCount) {
      files.splice(maxAttachableImagesCount);
    }

    const uploadableNewFiles = this.getUploadableNewFiles(files);

    if (uploadableNewFiles.length > 0) {
      uploadableNewFiles.forEach(file => {
        uploadDraftFile(
          draftId,
          file,
          uploadType,
          notifiers,
          createFileUploaderCallback
        );
      });
    }
  };

  cleanUpNotifications = () => {
    const { removeAllNotifications } = this.props;
    removeAllNotifications();
  };

  render() {
    const {
      translations,
      classNames,
      multiple,
      disabled,
      uploadFormatsConfig,
      uploadButton,
    } = this.props;

    let UploadButton = ({ onClick }) => (
      <ButtonWithStyles onClick={onClick} title={translations.buttonTitle} />
    );

    if (uploadButton !== null) {
      UploadButton = uploadButton;
    }

    const acceptedFileExtensions = Array.from(uploadFormatsConfig.keys())
      .map(format => `.${format.toLowerCase()}`)
      .join();

    return (
      <div>
        <DropzoneWithStyles
          onDragOver={event => event.stopPropagation()}
          onDrop={this.onDrop}
          activeClassName={classNames && classNames.uploadZoneActive}
          disabledClassName={classNames && classNames.uploadZoneDisabled}
          className={classNames && classNames.uploadZone}
          ref={node => {
            this.dropzone = node;
          }}
          multiple={multiple}
          disabled={disabled}
        />
        <UploadButton
          title={translations.buttonTitle}
          onClick={this.onUploadButtonClick}
        />
      </div>
    );
  }
}

UploadZone.propTypes = {
  uploadButton: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.func,
  ]),
  draftId: PropTypes.string.isRequired,
  className: PropTypes.string,
  classNames: PropTypes.shape({
    uploadZone: PropTypes.string,
    uploadZoneActive: PropTypes.string,
    uploadZoneDisabled: PropTypes.string,
  }).isRequired,
  uploadFormatsConfig: PropTypes.object,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  uploadType: PropTypes.string.isRequired,
  service: PropTypes.shape({
    maxAttachableImagesCount: PropTypes.number,
    canHaveMediaAttachmentType: PropTypes.func,
  }).isRequired,
  uploadDraftFile: PropTypes.func.isRequired,
  removeAllNotifications: PropTypes.func.isRequired,
  supportsMixedMediaTypes: PropTypes.bool.isRequired,
  mixedMediaUnsupportedCallback: PropTypes.func.isRequired,
  queueError: PropTypes.func.isRequired,
  notifiers: PropTypes.shape({
    uploadStarted: PropTypes.func,
    uploadedLinkThumbnail: PropTypes.func,
    uploadedDraftImage: PropTypes.func,
    uploadedDraftVideo: PropTypes.func,
    draftGifUploaded: PropTypes.func,
    queueError: PropTypes.func,
    monitorFileUploadProgress: PropTypes.func,
  }).isRequired,
  translations: PropTypes.shape({
    invalidFormatCantUseAnyFiles: PropTypes.string,
    invalidFormatCantUseSomeFiles: PropTypes.string,
    invalidFormatCantOneOfFiles: PropTypes.string,
    invalidFormatCantSingleFile: PropTypes.string,
    invalidFileSize: PropTypes.string,
    buttonTitle: PropTypes.string,
  }).isRequired,
};

UploadZone.defaultProps = {
  uploadButton: null,
  supportsMixedMediaTypes: false,
  disabled: false,
  multiple: true,
  classNames: {
    uploadZone: '',
    uploadZoneActive: '',
    uploadZoneDisabled: '',
  },
};

export default UploadZone;
