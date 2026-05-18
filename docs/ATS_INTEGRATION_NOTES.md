# ATS Integration Notes

| Integration point | Prototype location | Production connection |
|---|---|---|
| Job search API | `index.html`, `jobs.html` | SuccessFactors Recruiting search or middleware endpoint |
| Job listing feed | `jobs.html`, job family pages | Paginated requisition feed with filters |
| Job detail requisition API | `job-detail.html` | Requisition endpoint by job ID and slug |
| Apply button | `job-detail.html` | ATS apply URL or embedded application flow |
| Candidate profile login | `profile.html` | ATS candidate account login or SSO |
| Saved jobs | `job-detail.html`, `profile.html` | Candidate account saved requisitions |
| Job alerts | `talent-community.html`, `profile.html` | ATS or CRM alert subscription |
| Talent community form | `talent-community.html` | CRM or talent pool endpoint with consent capture |
| Application status | `profile.html` | Candidate account application status feed |
