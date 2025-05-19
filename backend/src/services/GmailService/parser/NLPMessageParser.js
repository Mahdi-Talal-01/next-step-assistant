import IAdvancedMessageParser from '../interfaces/IAdvancedMessageParser.js';
import BaseMessageParser from './BaseMessageParser.js';

/**
 * Advanced message parser with NLP capabilities
 */
class NLPMessageParser extends IAdvancedMessageParser {
  constructor() {
    super();
    // Use composition to reuse base parser functionality
    this.baseParser = new BaseMessageParser();
  }

  /**
   * Parse Gmail message to a more readable format (delegated to base parser)
   * @param {object} message - Gmail message
   * @returns {object} - Parsed email
   */
  parseMessage(message) {
    // Delegate to base parser implementation
    const parsed = this.baseParser.parseMessage(message);
    // console.log("body", parsed.body);
    // const jobApplications = this.extractJobApplicationData(parsed);
    return parsed ;
  }

  /**
   * Extract job application data from an array of parsed emails
   * @param {Array<object>} parsedEmails - Array of parsed emails from parseMessage
   * @returns {Array<object>} - Array of job application data
   */
  extractJobApplicationData(parsedEmails) {
    try {
      // Ensure we have an array of emails
      if (!Array.isArray(parsedEmails)) {
        console.warn("Expected array of emails but received:", typeof parsedEmails);
        parsedEmails = [parsedEmails]; // Convert to array if single email
      }

      // Process each email to extract job data
      const jobApplications = parsedEmails.map(parsedEmail => {
        return this._processEmailForJobData(parsedEmail);
      });
      return jobApplications;
    } catch (error) {
      console.error('Job application data extraction error:', error);
      return [];
    }
  }

  /**
   * Process a single email to extract job application data
   * @private
   * @param {object} parsedEmail - Single parsed email
   * @returns {object} - Job application data
   */
  _processEmailForJobData(parsedEmail) {
    try {
      // Strip HTML tags to get plain text for easier processing
      const stripHtml = (html) => {
        return html.replace(/<[^>]*>?/gm, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      };

      const subject = parsedEmail.subject || '';
      const plainBody = stripHtml(parsedEmail.body || '');
      const from = parsedEmail.from || '';
      const combined = `${subject} ${plainBody} ${from}`;
      
      // Initialize the result object with detailed job signals
      const result = {
        emailId: parsedEmail.id,
        title: '',
        company: '',
        location: '',
        status: '',
        appliedAt: null,
        jobUrl: '',
        platform: '',
        isJobRelated: false,
        jobConfidenceScore: 0,
        jobSignals: {
          subjectSignals: [],
          bodySignals: [],
          senderSignals: [],
          metadataSignals: []
        },
        salary: null,
        jobDescription: '',
        requirements: [],
        benefits: [],
        contactInfo: '',
        applicationDeadline: null,
        hasAttachments: parsedEmail.hasAttachments || false
      };

      // Track confidence score factors
      let confidencePoints = 0;
      const maxConfidencePoints = 100;
      
      // 1. Subject line analysis
      const jobKeywordsInSubject = [
        { pattern: /\b(job|position|role|opening|opportunity|vacancy|career)\b/i, points: 10, label: 'Job term in subject' },
        { pattern: /\b(application|applied|applying|submit|consider|candidacy)\b/i, points: 15, label: 'Application term in subject' },
        { pattern: /\b(interview|assessment|test|evaluation|screen|recruiter|hiring)\b/i, points: 20, label: 'Interview process term in subject' },
        { pattern: /\b(offer|contract|employment|hired|selected|start date)\b/i, points: 25, label: 'Offer/hiring term in subject' },
        { pattern: /\b(resume|cv|cover letter|portfolio|qualification)\b/i, points: 15, label: 'Resume term in subject' },
        { pattern: /\b(rejection|unfortunately|not proceed|other candidates)\b/i, points: 20, label: 'Rejection term in subject' },
        { pattern: /\b(thank you|received|confirmation|acknowledge)\b/i, points: 5, label: 'Acknowledgment in subject' }
      ];

      for (const keyword of jobKeywordsInSubject) {
        if (subject.match(keyword.pattern)) {
          confidencePoints += keyword.points;
          result.jobSignals.subjectSignals.push(keyword.label);
        }
      }

      // 2. Sender analysis
      const senderPatterns = [
        { pattern: /\b(careers|jobs|recruiting|talent|hr|recruitment|apply|hiring|noreply)\b/i, points: 15, label: 'Recruiting-related sender' },
        { pattern: /@(talent|careers|jobs|hr|recruiting|recruitment|apply|hiring)\./i, points: 20, label: 'Recruiting domain' },
        { pattern: /\b(human\s*resources|talent\s*acquisition|recruiter|hiring\s*manager)\b/i, points: 10, label: 'HR-related title in sender' },
        { pattern: /\b(interview|assessment|screening|evaluation|test|exam)\b/i, points: 12, label: 'Assessment-related sender' },
        { pattern: /\b(offer|contract|agreement|onboarding|orientation)\b/i, points: 12, label: 'Offer or onboarding-related sender' },
        { pattern: /\b(background\s*check|reference\s*check|verification)\b/i, points: 10, label: 'Background check-related sender' },
        { pattern: /\b(schedule|appointment|calendar|invite)\b/i, points: 8, label: 'Scheduling-related sender' },
        { pattern: /\b(update|status|progress|feedback)\b/i, points: 5, label: 'Status update-related sender' },
        { pattern: /\b(noreply|no-reply|donotreply|do-not-reply)\b/i, points: 3, label: 'Automated sender' },
        { pattern: /@(interview|assessment|offer|onboarding|backgroundcheck|noreply|donotreply|do-not-reply)\./i, points: 15, label: 'Process stage domain' }
      ];

      for (const pattern of senderPatterns) {
        if (from.match(pattern.pattern)) {
          confidencePoints += pattern.points;
          result.jobSignals.senderSignals.push(pattern.label);
        }
      }

      // 3. Body content analysis
      const bodyKeywords = [
        // Job description & role details
        { pattern: /\b(job\s*title|role\s*overview|position\s*summary|responsibilities|duties|qualifications|requirements|skills\s*(?:required|preferred)|experience\s*level)\b/i, points: 15, label: 'Job description markers' },
      
        // Compensation & perks
        { pattern: /\b(salary|compensation|benefits|package|stock\s*options|equity|bonus|401k|pension|health\s*insurance|medical\s*cover(age)?|vacation|pto|perks)\b/i, points: 12, label: 'Compensation terms' },
      
        // Location & work arrangement
        { pattern: /\b(location|office\s*location|remote|onsite|hybrid|work\s*from\s*home|telecommute)\b/i, points: 8, label: 'Location/work‐arrangement indicators' },
      
        // Application received & status
        { pattern: /\b(application\s*received|thank\s*you\s*for\s*(?:applying|your\s*application)|we\s*have\s*received|your\s*submission)\b/i, points: 20, label: 'Application received indicators' },
        { pattern: /\b(application\s*status|currently\s*under\s*review|next\s*steps|in\s*review|shortlist|screening)\b/i, points: 18, label: 'Status update indicators' },
      
        // Request for more information or documents
        { pattern: /\b(please\s*(?:send|provide|attach)|submit\s*(?:your\s*resume|your\s*cv|portfolio|references)|share\s*(?:availability|preferred\s*times|contact\s*number))\b/i, points: 15, label: 'Document/request indicators' },
      
        // Interview scheduling & prep
        { pattern: /\b(interview\s*(?:schedule|invitation|confirmation|details)|screening\s*call|video\s*call|onsite\s*interview|panel\s*interview)\b/i, points: 25, label: 'Interview scheduling indicators' },
        { pattern: /\b(prepare\s*for|please\s*review|agenda|meeting\s*link|zoom\s*link|microsoft\s*teams|google\s*meet)\b/i, points: 10, label: 'Interview prep indicators' },
      
        // Pre‑employment checks
        { pattern: /\b(background\s*check|reference\s*check|drug\s*test|pre[-\s]?employment|verification)\b/i, points: 20, label: 'Pre‑employment screening' },
      
        // Offer & onboarding
        { pattern: /\b(we\s*are\s*pleased|congratulations|offer\s*letter|job\s*offer|employment\s*contract|terms\s*and\s*conditions)\b/i, points: 30, label: 'Job offer indicators' },
        { pattern: /\b(start\s*date|onboarding|first\s*day|orientation|welcome\s*aboard|new\s*hiring|team\s*introduction)\b/i, points: 15, label: 'Start date/onboarding indicators' },
      
        // Rejection & closing
        { pattern: /\b(unfortunately|regret\s*to\s*inform|not\s*selected|other\s*candidates|not\s*moving\s*forward|we\s*wish\s*you|future\s*opportunities)\b/i, points: 25, label: 'Rejection indicators' },
      
        // Follow‑up & next‑steps
        { pattern: /\b(next\s*steps|follow[-\s]?up|touching\s*base|checking\s*in)\b/i, points: 10, label: 'Follow‑up indicators' },
      
        // Automated & no‑reply
        { pattern: /\b(noreply|no-reply|donotreply|do-not-reply)\b/i, points: 3, label: 'Automated sender/body' }
      ];

      for (const keyword of bodyKeywords) {
        if (plainBody.match(keyword.pattern)) {
          confidencePoints += keyword.points;
          result.jobSignals.bodySignals.push(keyword.label);
        }
      }

      // 4. Metadata signals
      if (parsedEmail.hasAttachments) {
        confidencePoints += 10;
        result.jobSignals.metadataSignals.push('Has attachments');
      }

      if (plainBody.length > 1000) {
        confidencePoints += 5;
        result.jobSignals.metadataSignals.push('Long email (potential detailed job info)');
      }

      // Extract job title - common patterns in job application emails
      const titlePatterns = [
        /(?:application|applied|job|position|role|opportunity)(?:\s+for)?(?:\s+the)?(?:\s+position)?(?:\s+of)?[\s:]+["']?([^"'\n.]+(?:\s+[^"'\n.]+){0,7})["']?/i,
        /(?:regarding|re:|about)[\s:]+["']?([^"'\n.]+(?:\s+[^"'\n.]+){0,7})["']?/i,
        /position[\s:]+["']?([^"'\n.]+(?:\s+[^"'\n.]+){0,5})["']?/i,
        /job[\s:]+["']?([^"'\n.]+(?:\s+[^"'\n.]+){0,5})["']?/i
      ];
      
      for (const pattern of titlePatterns) {
        const match = combined.match(pattern);
        if (match && match[1] && match[1].length > 3) {
          result.title = match[1].trim();
          confidencePoints += 15;
          break;
        }
      }

      // Extract from subject if no match found
      if (!result.title && subject.length > 5 && !subject.match(/^re:/i)) {
        result.title = subject.replace(/^re:/i, '').trim();
      }

      // Extract company name
      const companyPatterns = [
        /(?:at|with|from|for)[\s:]+["']?([A-Z][^"'\n.]+(?:\s+[^"'\n.]+){0,3})["']?/i,
        /company[\s:]+["']?([^"'\n.]+(?:\s+[^"'\n.]+){0,3})["']?/i,
        /(?:application|applied)(?:\s+to)?[\s:]+["']?([A-Z][^"'\n.]+(?:\s+[^"'\n.]+){0,3})["']?/i
      ];
      
      for (const pattern of companyPatterns) {
        const match = combined.match(pattern);
        if (match && match[1] && match[1].length > 1) {
          result.company = match[1].trim();
          confidencePoints += 15;
          break;
        }
      }
      
      // Extract from the sender domain as fallback
      if (!result.company) {
        const domainMatch = from.match(/@([^.]+)\./i);
        if (domainMatch && domainMatch[1]) {
          result.company = domainMatch[1].charAt(0).toUpperCase() + domainMatch[1].slice(1);
          confidencePoints += 5;
        }
      }

      // Extract location
      const locationPatterns = [
        /(?:in|at|location|based in)[\s:]+["']?([A-Za-z][^"'\n.]+(?:,\s+[A-Za-z][^"'\n.]+)?)["']?/i,
        /(?:remote|on-site|hybrid)[\s:]+["']?([A-Za-z][^"'\n.]+(?:,\s+[A-Za-z][^"'\n.]+)?)["']?/i
      ];
      
      for (const pattern of locationPatterns) {
        const match = combined.match(pattern);
        if (match && match[1] && match[1].length > 2) {
          result.location = match[1].trim();
          confidencePoints += 10;
          break;
        }
      }

      // Detect if remote
      if (combined.match(/\b(remote|work from home|wfh)\b/i)) {
        result.location = result.location || 'Remote';
        confidencePoints += 5;
      }

      // Extract salary information
      const salaryPatterns = [
        /salary[\s:]+[$€£]?([\d,.]+)[-–][$€£]?([\d,.]+)[\s/]*(year|month|annum|yr|annual|pa)/i,
        /compensation[\s:]+[$€£]?([\d,.]+)[-–][$€£]?([\d,.]+)[\s/]*(year|month|annum|yr|annual|pa)/i,
        /[$€£]([\d,.]+)[-–][$€£]?([\d,.]+)[\s/]*(year|month|annum|yr|annual|pa)/i
      ];
      
      for (const pattern of salaryPatterns) {
        const match = combined.match(pattern);
        if (match) {
          result.salary = {
            min: match[1].replace(/[^\d.]/g, ''),
            max: match[2].replace(/[^\d.]/g, ''),
            period: match[3]
          };
          confidencePoints += 15;
          break;
        }
      }

      // Extract job description snippet
      const jobDescriptionPattern = /job\s*description[\s:]*([^]*?)(?:\b(requirements|qualifications|responsibilities|about\s+us)\b|$)/i;
      const jobDescMatch = plainBody.match(jobDescriptionPattern);
      if (jobDescMatch && jobDescMatch[1]) {
        result.jobDescription = jobDescMatch[1].trim().substring(0, 500) + (jobDescMatch[1].length > 500 ? '...' : '');
        confidencePoints += 15;
      }

      // Extract requirements
      const requirementsPattern = /\b(requirements|qualifications)[\s:]*([^]*?)(?:\b(benefits|about\s+us|how\s+to\s+apply|next\s+steps)\b|$)/i;
      const reqMatch = plainBody.match(requirementsPattern);
      if (reqMatch && reqMatch[2]) {
        // Try to extract bullet points
        const bulletPoints = reqMatch[2].match(/[•\-\*]\s*([^\n•\-\*]+)/g);
        if (bulletPoints && bulletPoints.length > 0) {
          result.requirements = bulletPoints.map(point => 
            point.replace(/^[•\-\*]\s*/, '').trim()
          ).filter(point => point.length > 10).slice(0, 5);
          confidencePoints += 15;
        }
      }

      // Extract contact info
      const contactPattern = /\b(contact|questions|reach out|get in touch)[\s:]*([^]*?)(?:\b(thank you|sincerely|regards)\b|$)/i;
      const contactMatch = plainBody.match(contactPattern);
      if (contactMatch && contactMatch[2]) {
        result.contactInfo = contactMatch[2].trim().substring(0, 200);
        confidencePoints += 5;
      }

      // Extract status (applied, interview, rejected, etc.)
      const statusKeywords = [
        { pattern: /\b(applied|application\s+submitted|application\s+received)\b/i, status: 'Applied' },
        { pattern: /\b(interview|schedule\s+an\s+interview|interview\s+invitation)\b/i, status: 'Interview' },
        { pattern: /\b(offer|job\s+offer|position\s+offer)\b/i, status: 'Offer' },
        { pattern: /\b(rejected|not\s+proceeding|not\s+selected|decided\s+to\s+move\s+forward|other\s+candidates)\b/i, status: 'Rejected' },
        { pattern: /\b(thank\s+you\s+for\s+applying|received\s+your\s+application|confirmation)\b/i, status: 'Applied' }
      ];
      
      for (const { pattern, status } of statusKeywords) {
        if (combined.match(pattern)) {
          result.status = status;
          confidencePoints += 10;
          break;
        }
      }
      
      // Default status
      if (!result.status) {
        result.status = 'Applied';
      }

      // Extract application deadline if present
      const deadlinePatterns = [
        /(?:deadline|apply by|applications close|closing date)[\s:]*([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?[\s,]+\d{4})/i,
        /(?:deadline|apply by|applications close|closing date)[\s:]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i
      ];
      
      for (const pattern of deadlinePatterns) {
        const match = combined.match(pattern);
        if (match && match[1]) {
          try {
            result.applicationDeadline = new Date(match[1]);
            confidencePoints += 10;
          } catch (e) {
            // Invalid date format, ignore
          }
          break;
        }
      }

      // Extract date - use email date if available
      try {
        result.appliedAt = parsedEmail.date ? new Date(parsedEmail.date) : new Date();
      } catch (e) {
        result.appliedAt = new Date();
      }

      // Extract job URL
      const urlMatch = plainBody.match(/(https?:\/\/[^\s"'<>]+(?:jobs|careers|apply|position|opening)[^\s"'<>]*)/i) || 
                       plainBody.match(/(https?:\/\/[^\s"'<>]+)/i);
      
      if (urlMatch && urlMatch[1]) {
        result.jobUrl = urlMatch[1];
        confidencePoints += 5;
      }

      // Identify platform
      const platforms = [
        { pattern: /linkedin/i, name: 'LinkedIn' },
        { pattern: /indeed/i, name: 'Indeed' },
        { pattern: /glassdoor/i, name: 'Glassdoor' },
        { pattern: /monster/i, name: 'Monster' },
        { pattern: /ziprecruiter/i, name: 'ZipRecruiter' },
        { pattern: /dice/i, name: 'Dice' },
        { pattern: /workday/i, name: 'Workday' },
        { pattern: /greenhouse/i, name: 'Greenhouse' },
        { pattern: /lever/i, name: 'Lever' },
        { pattern: /smartrecruiters/i, name: 'SmartRecruiters' },
        { pattern: /jobvite/i, name: 'Jobvite' },
        { pattern: /taleo/i, name: 'Taleo' }
      ];
      
      for (const { pattern, name } of platforms) {
        if (combined.match(pattern) || (result.jobUrl && result.jobUrl.match(pattern))) {
          result.platform = name;
          confidencePoints += 10;
          break;
        }
      }
      
      // If no platform detected but URL exists, extract domain
      if (!result.platform && result.jobUrl) {
        const urlDomainMatch = result.jobUrl.match(/https?:\/\/(?:www\.)?([^\/]+)/i);
        if (urlDomainMatch && urlDomainMatch[1]) {
          const domain = urlDomainMatch[1].split('.')[0];
          result.platform = domain.charAt(0).toUpperCase() + domain.slice(1);
        }
      }
      
      // Default platform if none detected
      if (!result.platform) {
        result.platform = 'Email';
      }
    //   console.log("result", result);

      // Final confidence calculation, capped at 100
      result.jobConfidenceScore = Math.min(Math.round(confidencePoints), maxConfidencePoints);
      
      // Determine if this is job-related based on confidence score
      result.isJobRelated = result.jobConfidenceScore >= 30;

      // If the job confidence score is high (≥ 75), log the email body
      if (result.jobConfidenceScore >= 75) {
        console.log('========== HIGH CONFIDENCE JOB EMAIL DETECTED ==========');
        console.log(`Subject: ${subject}`);
        console.log(`From: ${from}`);
        console.log(`Job Confidence Score: ${result.jobConfidenceScore}`);
        console.log(`Email Body: ${parsedEmail.body}`);
        console.log('=======================================================');
      }

      return result;
    } catch (error) {
      console.error('Error processing email for job data:', error);
      return {
        emailId: parsedEmail?.id || 'unknown',
        title: '',
        company: '',
        location: '',
        status: 'Applied',
        appliedAt: new Date(),
        jobUrl: '',
        platform: 'Email',
        isJobRelated: false,
        jobConfidenceScore: 0,
        jobSignals: {
          subjectSignals: [],
          bodySignals: [],
          senderSignals: [],
          metadataSignals: []
        }
      };
    }
  }
}

export default NLPMessageParser; 