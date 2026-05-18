import { readFile, writeFile } from "node:fs/promises";

const profiles = {
  "story-fahad-al-harbi.html": {
    id: "fahad",
    name: "Fahad Al-Harbi",
    role: "Field Operator, Onshore Operations",
    summary:
      "Fahad supports onshore drilling crews through daily field preparation, equipment checks, and safe task execution. His career path shows how operational discipline and crew communication build trust on the rig.",
    careerStage: "Experienced field operator",
    functionName: "Onshore Drilling",
    qualifications: "Operational field training, permit-to-work awareness, rig safety routines",
    strengths: "Crew coordination, equipment readiness, safe task planning",
  },
  "story-majed-al-otaibi.html": {
    id: "majed",
    name: "Majed Al-Otaibi",
    role: "Assistant Driller, Offshore Operations",
    summary:
      "Majed works with offshore drilling crews where preparation, communication, and attention to procedure are essential. His experience highlights the move from hands-on crew support into more accountable drilling responsibilities.",
    careerStage: "Offshore operations specialist",
    functionName: "Offshore Drilling",
    qualifications: "Drilling operations training, offshore safety induction, critical-task preparation",
    strengths: "Operational readiness, procedure discipline, shift communication",
  },
  "story-hassan-al-shammari.html": {
    id: "hassan",
    name: "Hassan Al-Shammari",
    role: "Rig Floor Crew Member, Field Readiness",
    summary:
      "Hassan is part of the rig floor team, supporting safe field readiness before and during operations. His story focuses on learning the basics well, checking work with the crew, and speaking early when something needs attention.",
    careerStage: "Field crew member",
    functionName: "Field Operations",
    qualifications: "Rig floor orientation, safety conversations, equipment-handling routines",
    strengths: "Teamwork, communication, task discipline",
  },
  "story-noura-al-qahtani.html": {
    id: "noura",
    name: "Noura Al-Qahtani",
    role: "Graduate Engineer, Technical Support",
    summary:
      "Noura joined as a graduate engineer and developed through technical assignments that connect office-based support with operational needs. Her profile shows the early-career bridge between engineering learning, safety expectations, and business contribution.",
    careerStage: "Graduate engineer",
    functionName: "Graduate Development",
    qualifications: "Engineering degree, graduate development assignments, technical coordination",
    strengths: "Analytical thinking, documentation, cross-functional learning",
  },
  "story-lama-al-dossari.html": {
    id: "lama",
    name: "Lama Al-Dossari",
    role: "HR Graduate Trainee, Business Support",
    summary:
      "Lama supports people processes across the employee journey, learning how HR connects policy, service, and employee experience. Her page positions HR as a practical business partner for field, technical, and corporate teams.",
    careerStage: "Graduate trainee",
    functionName: "Human Resources",
    qualifications: "HR graduate pathway, employee services exposure, business support rotations",
    strengths: "Employee service, follow-through, process awareness",
  },
  "story-omar-al-fahad.html": {
    id: "omar",
    name: "Omar Al-Fahad",
    role: "Maintenance Graduate Engineer, Technical Development",
    summary:
      "Omar’s work links engineering development with rig reliability and performance. His profile explains how maintenance planning, site exposure, and technical communication help teams prevent problems before they affect operations.",
    careerStage: "Graduate engineer",
    functionName: "Maintenance Engineering",
    qualifications: "Engineering degree, maintenance planning exposure, reliability fundamentals",
    strengths: "Planning, technical communication, reliability mindset",
  },
  "story-salem-al-mutairi.html": {
    id: "salem",
    name: "Salem Al-Mutairi",
    role: "Rig Supervisor, Operations",
    summary:
      "Salem leads operational teams by setting clear standards, coaching crew members, and keeping communication calm under pressure. His story shows the transition from technical credibility into people leadership.",
    careerStage: "Operations leader",
    functionName: "Operations Leadership",
    qualifications: "Rig supervision experience, operational standards, crew leadership",
    strengths: "Coaching, decision-making, safe execution",
  },
  "story-reem-al-nasser.html": {
    id: "reem",
    name: "Reem Al-Nasser",
    role: "Talent Development Manager, Corporate Leadership",
    summary:
      "Reem works on capability building and career development, helping employees and managers turn feedback into practical growth actions. Her profile explains how learning, leadership, and career conversations support retention and performance.",
    careerStage: "Corporate leader",
    functionName: "Talent Development",
    qualifications: "Talent development leadership, learning programs, career coaching",
    strengths: "Capability building, feedback design, employee development",
  },
  "story-abdullah-al-rashid.html": {
    id: "abdullah",
    name: "Abdullah Al-Rashid",
    role: "HSE Supervisor, Safety Leadership",
    summary:
      "Abdullah supports safety leadership by making risk conversations visible, practical, and connected to real work. His profile shows how HSE supervisors guide teams through consistent standards and speak-up culture.",
    careerStage: "Safety leader",
    functionName: "HSE",
    qualifications: "HSE supervision, risk control practices, incident-prevention routines",
    strengths: "Safety coaching, risk awareness, visible leadership",
  },
};

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const careerSection = (profile) => `<section class="section employee-career-section" aria-labelledby="career-profile-${profile.id}"><div class="container employee-career-grid"><div class="employee-career-intro"><span class="form-eyebrow">Career profile</span><h2 id="career-profile-${profile.id}">${escapeHtml(profile.name)}'s career at Arabian Drilling</h2><p>${escapeHtml(profile.summary)}</p></div><aside class="employee-career-panel" aria-label="${escapeHtml(profile.name)} career snapshot"><h3>${escapeHtml(profile.role)}</h3><dl><div><dt>Career stage</dt><dd>${escapeHtml(profile.careerStage)}</dd></div><div><dt>Job function</dt><dd>${escapeHtml(profile.functionName)}</dd></div><div><dt>Qualifications</dt><dd>${escapeHtml(profile.qualifications)}</dd></div><div><dt>Core strengths</dt><dd>${escapeHtml(profile.strengths)}</dd></div></dl></aside></div></section>`;

for (const [file, profile] of Object.entries(profiles)) {
  let html = await readFile(file, "utf8");
  if (!html.includes("employee-career-section")) {
    html = html.replace(
      '<section class="section story-feature-section">',
      `${careerSection(profile)}<section class="section story-feature-section">`,
    );
  }
  html = html.replaceAll(
    "<span>Employee biography</span>",
    "<span>Employee reflection</span>",
  );
  await writeFile(file, html, "utf8");
}
