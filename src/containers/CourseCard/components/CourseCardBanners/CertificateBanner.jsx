/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';

import { MailtoLink, Hyperlink } from '@openedx/paragon';
import { CheckCircle, WarningFilled } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import { utilHooks, reduxHooks } from 'hooks';
import Banner from 'components/Banner';

import messages from './messages';

const { useFormatDate } = utilHooks;

export const CertificateBanner = ({ cardId }) => {
  const certificate = reduxHooks.useCardCertificateData(cardId);
  const {
    isAudit,
    isVerified,
    hasStarted,
  } = reduxHooks.useCardEnrollmentData(cardId);
  const { isPassing } = reduxHooks.useCardGradeData(cardId);
  const { isArchived } = reduxHooks.useCardCourseRunData(cardId);
  const { minPassingGrade, progressUrl } = reduxHooks.useCardCourseRunData(cardId);
  const { completeCount, incompleteCount, lockedCount } = reduxHooks.useCardCompletionSummaryData(cardId);
  const numTotalUnits = completeCount + incompleteCount + lockedCount;
  const completePercentage = completeCount ? Number(((completeCount / numTotalUnits) * 100).toFixed(0)) : 0;
  const { supportEmail, billingEmail } = reduxHooks.usePlatformSettingsData();
  const { formatMessage } = useIntl();
  const formatDate = useFormatDate();

  const emailLink = address => <MailtoLink to={address}>{address}</MailtoLink>;

  // TeachSim customization: when this course has an active certificate
  // configured in Studio (Activate/Deactivate toggle), show the "mixed"
  // messaging - a "this module offers a certificate" lead-in followed by
  // the grade/certificate-aware messaging that existed before this course
  // family had no certificates at all. Courses without an active
  // certificate keep the pre-existing completion-percentage-only banners.
  if (certificate.isCertActive) {
    const certificateOffered = formatMessage(messages.certificateOffered);
    if (certificate.isRestricted) {
      return (
        <Banner variant="danger">
          {certificateOffered}
          {'  '}
          { supportEmail ? formatMessage(messages.certRestricted, { supportEmail: emailLink(supportEmail) }) : formatMessage(messages.certRestrictedNoEmail)}
          {isVerified && '  '}
          {isVerified && (billingEmail ? formatMessage(messages.certRefundContactBilling, { billingEmail: emailLink(billingEmail) }) : formatMessage(messages.certRefundContactBillingNoEmail))}
        </Banner>
      );
    }
    if (certificate.isDownloadable) {
      return (
        <Banner variant="success" icon={CheckCircle}>
          {certificateOffered}
          {'  '}
          {formatMessage(messages.certReady)}
          {certificate.certPreviewUrl && (
            <>
              {'  '}
              <Hyperlink isInline destination={certificate.certPreviewUrl}>
                {formatMessage(messages.viewCertificate)}
              </Hyperlink>
            </>
          )}
        </Banner>
      );
    }
    if (!isPassing) {
      if (isAudit) {
        return (
          <Banner>
            {certificateOffered}
            {'  '}
            {formatMessage(messages.passingGrade, { minPassingGrade })}
          </Banner>
        );
      }
      if (isArchived) {
        return (
          <Banner variant="warning">
            {certificateOffered}
            {'  '}
            {formatMessage(messages.notEligibleForCert)}
            {'  '}
            <Hyperlink isInline destination={progressUrl}>{formatMessage(messages.viewGrades)}</Hyperlink>
          </Banner>
        );
      }
      return (
        <Banner variant="warning">
          {certificateOffered}
          {'  '}
          {formatMessage(messages.certMinGrade, { minPassingGrade })}
        </Banner>
      );
    }
    if (certificate.isEarnedButUnavailable) {
      return (
        <Banner>
          {certificateOffered}
          {'  '}
          {formatMessage(
            messages.gradeAndCertReadyAfter,
            { availableDate: formatDate(certificate.availableDate) },
          )}
        </Banner>
      );
    }
    return null;
  }

  const certificateNotOffered = formatMessage(messages.certificateNotOffered);
  if (completePercentage === 100) {
    return (
      <Banner variant="success" icon={CheckCircle}>
        {certificateNotOffered}
        {'  '}
        {formatMessage(messages.fullyCompleted)}
      </Banner>
    );
  }
  if (!hasStarted && completePercentage === 0) {
    return (
      <Banner variant="warning" icon={WarningFilled}>
        {certificateNotOffered}
        {'  '}
        {formatMessage(messages.notStarted)}
      </Banner>
    );
  }
  return (
    <Banner>
      {certificateNotOffered}
      {'  '}
      {formatMessage(messages.partiallyCompleted, { completePercentage })}
    </Banner>
  );
};
CertificateBanner.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CertificateBanner;
