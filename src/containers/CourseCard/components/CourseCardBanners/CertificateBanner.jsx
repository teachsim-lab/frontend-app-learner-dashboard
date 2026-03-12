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

  if (completePercentage === 100) {
    return (
      <Banner variant="success" icon={CheckCircle}>
        {formatMessage(messages.fullyCompleted)}
      </Banner>
    );
  }
  if (!hasStarted && completePercentage === 0) {
    return (
      <Banner variant="warning" icon={WarningFilled}>
        {formatMessage(messages.notStarted)}
      </Banner>
    );
  }
  return (
    <Banner>
      {formatMessage(messages.partiallyCompleted, { completePercentage })}
    </Banner>
  );
};
CertificateBanner.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CertificateBanner;
