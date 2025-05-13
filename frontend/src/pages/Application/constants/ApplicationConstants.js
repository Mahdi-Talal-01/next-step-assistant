/**
 * Application status options
 */
export const STATUS_OPTIONS = [
    { value: 'applied', label: 'Applied', icon: 'mdi:send' },
    { value: 'interview', label: 'Interview', icon: 'mdi:calendar' },
    { value: 'assessment', label: 'Assessment', icon: 'mdi:file-document' },
    { value: 'offer', label: 'Offer', icon: 'mdi:handshake' },
    { value: 'rejected', label: 'Rejected', icon: 'mdi:close' }
  ];
  /**
 * Filter status options (includes 'all')
 */
export const FILTER_STATUS_OPTIONS = [
    { value: 'all', label: 'All Status' },
    ...STATUS_OPTIONS
  ];
  /**
 * Job type options
 */
export const JOB_TYPE_OPTIONS = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Freelance'
  ];
  /**
 * Filter job type options (includes 'all')
 */
export const FILTER_JOB_TYPE_OPTIONS = [
    { value: 'all', label: 'All Types' },
    ...JOB_TYPE_OPTIONS.map(type => ({ value: type, label: type }))
  ];