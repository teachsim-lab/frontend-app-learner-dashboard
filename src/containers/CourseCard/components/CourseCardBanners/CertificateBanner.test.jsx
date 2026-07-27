import { shallow } from '@edx/react-unit-test-utils';

import { reduxHooks } from 'hooks';
import CertificateBanner from './CertificateBanner';
import messages from './messages';

jest.mock('hooks', () => ({
  utilHooks: {
    useFormatDate: jest.fn(() => date => date),
  },
  reduxHooks: {
    useCardCertificateData: jest.fn(),
    useCardCourseRunData: jest.fn(),
    useCardEnrollmentData: jest.fn(),
    useCardGradeData: jest.fn(),
    useCardCompletionSummaryData: jest.fn(),
    usePlatformSettingsData: jest.fn(),
  },
}));

jest.mock('components/Banner', () => 'Banner');

describe('CertificateBanner', () => {
  const props = { cardId: 'cardId' };
  reduxHooks.useCardCourseRunData.mockReturnValue({
    minPassingGrade: 0.8,
    progressUrl: 'progressUrl',
  });

  const defaultCertificate = {
    isCertActive: true,
    availableDate: '10/20/3030',
    isRestricted: false,
    isDownloadable: false,
    isEarnedButUnavailable: false,
  };
  const defaultEnrollment = {
    isAudit: false,
    isVerified: false,
    hasStarted: true,
  };
  const defaultCourseRun = { isArchived: false };
  const defaultGrade = { isPassing: false };
  const defaultCompletionSummary = { completeCount: 1, incompleteCount: 9, lockedCount: 0 };
  const defaultPlatformSettings = {};
  const createWrapper = ({
    certificate = {},
    enrollment = {},
    grade = {},
    courseRun = {},
    completionSummary = {},
    platformSettings = {},
  }) => {
    reduxHooks.useCardGradeData.mockReturnValueOnce({ ...defaultGrade, ...grade });
    reduxHooks.useCardCertificateData.mockReturnValueOnce({ ...defaultCertificate, ...certificate });
    reduxHooks.useCardEnrollmentData.mockReturnValueOnce({ ...defaultEnrollment, ...enrollment });
    reduxHooks.useCardCourseRunData.mockReturnValueOnce({ ...defaultCourseRun, ...courseRun });
    reduxHooks.useCardCompletionSummaryData.mockReturnValueOnce({ ...defaultCompletionSummary, ...completionSummary });
    reduxHooks.usePlatformSettingsData.mockReturnValueOnce({ ...defaultPlatformSettings, ...platformSettings });
    return shallow(<CertificateBanner {...props} />);
  };
  /** TODO: Update tests to validate snapshots **/
  describe('snapshot', () => {
    describe('with an active certificate', () => {
      test('is restricted', () => {
        const wrapper = createWrapper({
          certificate: {
            isRestricted: true,
          },
        });
        expect(wrapper.snapshot).toMatchSnapshot();
      });
      test('is restricted with support email', () => {
        const wrapper = createWrapper({
          certificate: {
            isRestricted: true,
          },
          platformSettings: {
            supportEmail: 'suport@email',
          },
        });
        expect(wrapper.snapshot).toMatchSnapshot();
      });
      test('is restricted with billing email', () => {
        const wrapper = createWrapper({
          certificate: {
            isRestricted: true,
          },
          platformSettings: {
            billingEmail: 'billing@email',
          },
        });
        expect(wrapper.snapshot).toMatchSnapshot();
      });
      test('is restricted and verified', () => {
        const wrapper = createWrapper({
          certificate: {
            isRestricted: true,
          },
          enrollment: {
            isVerified: true,
          },
        });
        expect(wrapper.snapshot).toMatchSnapshot();
      });
      test('is restricted and verified with support email', () => {
        const wrapper = createWrapper({
          certificate: {
            isRestricted: true,
          },
          enrollment: {
            isVerified: true,
          },
          platformSettings: {
            supportEmail: 'suport@email',
          },
        });
        expect(wrapper.snapshot).toMatchSnapshot();
      });
      test('is restricted and verified with billing email', () => {
        const wrapper = createWrapper({
          certificate: {
            isRestricted: true,
          },
          enrollment: {
            isVerified: true,
          },
          platformSettings: {
            billingEmail: 'billing@email',
          },
        });
        expect(wrapper.snapshot).toMatchSnapshot();
      });
      test('is restricted and verified with support and billing email', () => {
        const wrapper = createWrapper({
          certificate: {
            isRestricted: true,
          },
          enrollment: {
            isVerified: true,
          },
          platformSettings: {
            supportEmail: 'suport@email',
            billingEmail: 'billing@email',
          },
        });
        expect(wrapper.snapshot).toMatchSnapshot();
      });
      test('is passing and is downloadable', () => {
        const wrapper = createWrapper({
          grade: { isPassing: true },
          certificate: { isDownloadable: true },
        });
        expect(wrapper.snapshot).toMatchSnapshot();
      });
      test('not passing and is downloadable', () => {
        const wrapper = createWrapper({
          grade: { isPassing: false },
          certificate: { isDownloadable: true },
        });
        expect(wrapper.snapshot).toMatchSnapshot();
      });
      test('not passing and audit', () => {
        const wrapper = createWrapper({
          enrollment: {
            isAudit: true,
          },
        });
        expect(wrapper.snapshot).toMatchSnapshot();
      });
      test('not passing and has finished', () => {
        const wrapper = createWrapper({
          courseRun: { isArchived: true },
        });
        expect(wrapper.snapshot).toMatchSnapshot();
      });
      test('not passing and not audit and not finished', () => {
        const wrapper = createWrapper({});
        expect(wrapper.snapshot).toMatchSnapshot();
      });
      test('is passing and is earned but unavailable', () => {
        const wrapper = createWrapper({
          grade: {
            isPassing: true,
          },
          certificate: {
            isEarnedButUnavailable: true,
          },
        });
        expect(wrapper.snapshot).toMatchSnapshot();
      });
      test('is passing and not downloadable render empty', () => {
        const wrapper = createWrapper({
          grade: {
            isPassing: true,
          },
        });
        expect(wrapper.snapshot).toMatchSnapshot();
      });
    });
    describe('with no active certificate', () => {
      test('is fully completed', () => {
        const wrapper = createWrapper({
          certificate: { isCertActive: false },
          completionSummary: { completeCount: 10, incompleteCount: 0, lockedCount: 0 },
        });
        expect(wrapper.snapshot).toMatchSnapshot();
      });
      test('has not started', () => {
        const wrapper = createWrapper({
          certificate: { isCertActive: false },
          enrollment: { hasStarted: false },
          completionSummary: { completeCount: 0, incompleteCount: 10, lockedCount: 0 },
        });
        expect(wrapper.snapshot).toMatchSnapshot();
      });
      test('is partially completed', () => {
        const wrapper = createWrapper({
          certificate: { isCertActive: false },
          completionSummary: { completeCount: 3, incompleteCount: 7, lockedCount: 0 },
        });
        expect(wrapper.snapshot).toMatchSnapshot();
      });
    });
  });
  describe('behavior', () => {
    it('is restricted', () => {
      const wrapper = createWrapper({
        certificate: {
          isRestricted: true,
        },
        platformSettings: {
          supportEmail: 'suport@email',
          billingEmail: 'billing@email',
        },
      });
      // certificateOffered has no non-primitive values, so the mocked
      // formatMessage resolves it to a plain string rather than a
      // <format-message-function> marker element - check the rendered
      // output directly instead of findByType.
      expect(JSON.stringify(wrapper.snapshot)).toContain(messages.certificateOffered.defaultMessage);
      const bannerMessage = wrapper.instance.findByType('format-message-function').map(el => el.props.message.defaultMessage).join('\n');
      expect(bannerMessage).toContain(messages.certRestricted.defaultMessage);
    });
    it('is restricted and verified', () => {
      const wrapper = createWrapper({
        certificate: {
          isRestricted: true,
        },
        enrollment: {
          isVerified: true,
        },
        platformSettings: {
          supportEmail: 'suport@email',
          billingEmail: 'billing@email',
        },
      });
      const bannerMessage = wrapper.instance.findByType('format-message-function').map(el => el.props.message.defaultMessage).join('\n');
      expect(bannerMessage).toContain(messages.certRestricted.defaultMessage);
      expect(bannerMessage).toContain(messages.certRefundContactBilling.defaultMessage);
    });
    it('does not show certificate-offered lead-in when there is no active certificate', () => {
      const wrapper = createWrapper({
        certificate: { isCertActive: false },
        completionSummary: { completeCount: 3, incompleteCount: 7, lockedCount: 0 },
      });
      const bannerText = JSON.stringify(wrapper.snapshot);
      expect(bannerText).not.toContain(messages.certificateOffered.defaultMessage);
      expect(bannerText).toContain('You have completed 30% of the module.');
    });
  });
});
