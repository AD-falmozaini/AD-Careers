const showFormStatus = (form, message, tone = "success") => {
  let status = form.querySelector(".form-status");
  if (!status) {
    status = document.createElement("p");
    status.className = "form-status";
    status.setAttribute("role", "status");
    form.appendChild(status);
  }

  status.textContent = message;
  status.dataset.tone = tone;
  status.scrollIntoView({ block: "nearest" });
};

const megaMenuSections = {
  "Jobs": {
    eyebrow: "Opportunities",
    columns: [
      {
        title: "Search and apply",
        links: [
          ["All Jobs", "jobs.html"],
          ["Featured Job: HSE Officer", "job-detail.html"],
          ["Candidate Profile", "profile.html"],
          ["Talent Community", "talent-community.html"]
        ]
      },
      {
        title: "Career levels",
        links: [
          ["Students & Graduates", "students-graduates.html"],
          ["Entry-Level Jobs", "entry-level-jobs.html"],
          ["Experienced Professionals", "professionals.html"],
          ["Career Events", "events.html"]
        ]
      }
    ]
  },
  "Talent Pools": {
    eyebrow: "Talent pools",
    columns: [
      {
        title: "Field operations",
        links: [
          ["Onshore Drilling", "onshore-drilling-jobs.html"],
          ["Offshore Drilling", "offshore-drilling-jobs.html"],
          ["HSE", "hse-jobs.html"],
          ["Fleet & Operations", "fleet-operations.html"]
        ]
      },
      {
        title: "Support functions",
        links: [
          ["Maintenance & Engineering", "maintenance-engineering-jobs.html"],
          ["Supply Chain & Logistics", "supply-chain-logistics-jobs.html"],
          ["Corporate Careers", "corporate-jobs.html"],
          ["All Talent Pools", "job-areas.html"]
        ]
      }
    ]
  },
  "Life at AD": {
    eyebrow: "People and culture",
    columns: [
      {
        title: "Employee experience",
        links: [
          ["Life at Arabian Drilling", "life-at-arabian-drilling.html"],
          ["Why Join AD", "why-join-ad.html"],
          ["Benefits & Rewards", "benefits.html"],
          ["Employee Stories", "employee-stories.html"]
        ]
      },
      {
        title: "Values and growth",
        links: [
          ["Learning & Development", "learning-development.html"],
          ["Safety Culture", "safety-culture.html"],
          ["Diversity, Saudization & Inclusion", "diversity-saudization-inclusion.html"],
          ["Awards & Recognition", "awards-recognition.html"]
        ]
      }
    ]
  },
  "Students": {
    eyebrow: "Early careers",
    columns: [
      {
        title: "Start your journey",
        links: [
          ["Students & Graduates", "students-graduates.html"],
          ["Internship Program", "internships.html"],
          ["Graduate Program", "graduate-program.html"],
          ["Entry-Level Jobs", "entry-level-jobs.html"]
        ]
      }
    ]
  },
  "Hiring": {
    eyebrow: "Candidate resources",
    columns: [
      {
        title: "Recruitment support",
        links: [
          ["Hiring Process", "hiring-process.html"],
          ["Careers FAQ", "faq.html"],
          ["Recruiting Fraud", "recruiting-fraud.html"],
          ["Ethical AI in Recruitment", "ethical-ai-recruitment.html"]
        ]
      },
      {
        title: "Candidate account",
        links: [
          ["Join Talent Community", "talent-community.html"],
          ["Candidate Sign In", "talent-community-members.html"],
          ["Candidate Privacy", "candidate-privacy.html"],
          ["About AD for Candidates", "about-ad.html"]
        ]
      }
    ]
  }
};

const enhanceMegaMenu = () => {
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelector(".nav-links");
  if (!nav || !navLinks || navLinks.dataset.megaReady === "true") return;

  navLinks.dataset.megaReady = "true";
  nav.classList.add("has-mega-menu");

  Array.from(navLinks.querySelectorAll("a")).forEach(link => {
    const label = link.textContent.trim();
    const config = megaMenuSections[label];
    const item = document.createElement("div");
    item.className = config ? "mega-menu-item has-panel" : "mega-menu-item";

    const trigger = link.cloneNode(true);
    trigger.classList.add("mega-trigger");
    trigger.textContent = label.toUpperCase();
    if (config) {
      trigger.setAttribute("aria-haspopup", "true");
      trigger.setAttribute("aria-expanded", "false");
    }

    item.appendChild(trigger);

    if (config) {
      const panel = document.createElement("div");
      panel.className = "mega-panel";
      panel.setAttribute("role", "group");
      panel.setAttribute("aria-label", `${label} menu`);

      const intro = document.createElement("div");
      intro.className = "mega-panel-intro";
      intro.innerHTML = `<span>${config.eyebrow}</span><strong>${label}</strong><p>Find the right roles, talent pools, and candidate resources for your next step.</p>`;
      panel.appendChild(intro);

      config.columns.forEach(column => {
        const columnNode = document.createElement("div");
        columnNode.className = "mega-column";

        const heading = document.createElement("h3");
        heading.textContent = column.title;
        columnNode.appendChild(heading);

        column.links.forEach(([text, href]) => {
          const childLink = document.createElement("a");
          childLink.href = href;
          childLink.textContent = text;
          columnNode.appendChild(childLink);
        });

        panel.appendChild(columnNode);
      });

      item.appendChild(panel);
      item.addEventListener("mouseenter", () => trigger.setAttribute("aria-expanded", "true"));
      item.addEventListener("mouseleave", () => trigger.setAttribute("aria-expanded", "false"));
      item.addEventListener("focusin", () => trigger.setAttribute("aria-expanded", "true"));
      item.addEventListener("focusout", event => {
        if (!item.contains(event.relatedTarget)) trigger.setAttribute("aria-expanded", "false");
      });
    }

    navLinks.appendChild(item);
    link.remove();
  });
};

enhanceMegaMenu();

const setupMobileHeader = () => {
  const nav = document.querySelector(".header .nav");
  const logo = nav?.querySelector(".logo");
  const navLinks = nav?.querySelector(".nav-links");
  if (!nav || !logo || !navLinks || nav.dataset.mobileHeaderReady === "true") return;

  nav.dataset.mobileHeaderReady = "true";

  const controls = document.createElement("div");
  controls.className = "mobile-header-controls";
  controls.innerHTML = `
    <button class="mobile-header-button mobile-search-button" id="searchToggleBtn" type="button" aria-label="Search jobs" aria-controls="searchSlideNav" aria-expanded="false" title="Search jobs">
      <span aria-hidden="true">⌕</span>
    </button>
    <button class="mobile-header-button mobile-menu-button" id="hamburgerToggleBtn" type="button" aria-label="Menu" aria-controls="nav-collapse-design1" aria-expanded="false">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </button>
  `;

  logo.insertAdjacentElement("afterend", controls);
  navLinks.id = navLinks.id || "nav-collapse-design1";
  nav.classList.remove("mobile-menu-open");

  const searchPanel = document.createElement("form");
  searchPanel.id = "searchSlideNav";
  searchPanel.className = "mobile-search-panel";
  searchPanel.setAttribute("role", "search");
  searchPanel.setAttribute("action", "jobs.html");
  searchPanel.innerHTML = `
    <label class="sr-only" for="mobileKeywordSearch">Search by keyword</label>
    <input id="mobileKeywordSearch" name="q" type="search" placeholder="Search by Keyword" autocomplete="off">
    <button class="btn primary" type="submit">Search Jobs</button>
  `;
  controls.insertAdjacentElement("afterend", searchPanel);

  const menuButton = controls.querySelector(".mobile-menu-button");
  const searchButton = controls.querySelector(".mobile-search-button");
  const desktopSearchLinks = nav.querySelectorAll(".nav-search-action");
  const closePanels = except => {
    if (except !== "menu") {
      nav.classList.remove("mobile-menu-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
    if (except !== "search") {
      nav.classList.remove("mobile-search-open");
      searchButton.setAttribute("aria-expanded", "false");
      desktopSearchLinks.forEach(link => {
        link.setAttribute("aria-expanded", "false");
      });
    }
  };

  menuButton.setAttribute("aria-expanded", "false");
  menuButton.addEventListener("click", () => {
    closePanels("menu");
    const isOpen = nav.classList.toggle("mobile-menu-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  searchButton.setAttribute("aria-expanded", "false");
  searchButton.addEventListener("click", () => {
    closePanels("search");
    const isOpen = nav.classList.toggle("mobile-search-open");
    searchButton.setAttribute("aria-expanded", String(isOpen));
    desktopSearchLinks.forEach(link => {
      link.setAttribute("aria-expanded", String(isOpen));
    });
    if (isOpen) searchPanel.querySelector("input")?.focus();
  });

  desktopSearchLinks.forEach(desktopSearchLink => {
    desktopSearchLink.setAttribute("aria-controls", "searchSlideNav");
    desktopSearchLink.setAttribute("aria-expanded", "false");
    desktopSearchLink.addEventListener("click", event => {
      event.preventDefault();
      closePanels("search");
      const isOpen = nav.classList.toggle("mobile-search-open");
      searchButton.setAttribute("aria-expanded", String(isOpen));
      nav.querySelectorAll(".nav-search-action").forEach(link => {
        link.setAttribute("aria-expanded", String(isOpen));
      });
      if (isOpen) searchPanel.querySelector("input")?.focus();
    });
  });

  navLinks.addEventListener("click", event => {
    if (event.target.closest("a")) {
      closePanels();
    }
  });

  document.addEventListener("click", event => {
    if (!nav.contains(event.target)) {
      closePanels();
    }
  });
};

setupMobileHeader();

document.querySelectorAll("form").forEach(form => {
  form.addEventListener("submit", event => {
    event.preventDefault();

    if (form.classList.contains("search-box")) {
      document.querySelector(".jobs-list")?.scrollIntoView({ block: "start" });
      showFormStatus(form, "Showing prototype results. Connect this form to the ATS job search API.", "info");
      return;
    }

    if (form.classList.contains("talent-register-form")) {
      showFormStatus(form, "Account created for prototype review. Next step: complete your candidate profile and submit your application.", "success");
      return;
    }

    if (form.classList.contains("talent-login-form")) {
      showFormStatus(form, "Signed in for prototype review. In production, this connects to SuccessFactors candidate authentication.", "success");
      return;
    }

    showFormStatus(form, "Form submitted for prototype review.", "success");
  });
});

document.querySelectorAll('button[type="button"]').forEach(button => {
  button.addEventListener("click", () => {
    const form = button.closest("form");
    if (!form) return;

    if (button.textContent.trim().toLowerCase() === "show") {
      const password = button.closest(".password-line")?.querySelector("input");
      if (!password) return;
      const showing = password.type === "text";
      password.type = showing ? "password" : "text";
      button.textContent = showing ? "Show" : "Hide";
      return;
    }

    if (form.classList.contains("talent-register-form")) {
      showFormStatus(form, "Account created for prototype review. Next step: complete your candidate profile and submit your application.", "success");
    } else if (form.classList.contains("talent-login-form")) {
      showFormStatus(form, "Signed in for prototype review. In production, this connects to SuccessFactors candidate authentication.", "success");
    }
  });
});

document.querySelectorAll("[data-save]").forEach(button => {
  button.addEventListener("click", () => {
    button.textContent = "Saved";
    button.setAttribute("aria-pressed", "true");
    button.classList.add("is-saved");
  });
});

const normalize = value => (value || "").toString().trim().toLowerCase();

const updateResultCount = (node, visible, total, label = "results") => {
  if (!node) return;
  node.textContent = `${visible} of ${total} ${label}`;
};

const getApplyPageHref = () => "talent-community.html";
const getJobPostHref = title => `job-post-${normalize(title).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.html`;

const enhanceJobFilters = () => {
  const form = document.querySelector("[data-job-filter-form]");
  const list = document.querySelector("[data-job-results]");
  if (!form || !list) return;

  const cards = Array.from(list.querySelectorAll("[data-job-card]"));
  const count = document.querySelector("[data-job-count]");
  const empty = document.querySelector("[data-job-empty]");

  const applyFilters = () => {
    const keyword = normalize(form.querySelector('[name="keyword"]')?.value || form.querySelector('[name="q"]')?.value);
    const location = normalize(form.querySelector('[name="location"]')?.value);
    const area = normalize(form.querySelector('[name="area"]')?.value);
    const level = normalize(form.querySelector('[name="level"]')?.value);
    let visible = 0;

    cards.forEach(card => {
      const haystack = normalize(`${card.dataset.title} ${card.dataset.location} ${card.dataset.area} ${card.dataset.level} ${card.textContent}`);
      const isVisible = (!keyword || haystack.includes(keyword)) &&
        (!location || normalize(card.dataset.location).includes(location)) &&
        (!area || normalize(card.dataset.area) === area) &&
        (!level || normalize(card.dataset.level) === level);

      card.hidden = !isVisible;
      if (isVisible) visible += 1;
    });

    updateResultCount(count, visible, cards.length, "open roles");
    if (empty) empty.hidden = visible !== 0;
  };

  form.addEventListener("input", applyFilters);
  form.addEventListener("change", applyFilters);
  form.addEventListener("reset", () => window.setTimeout(applyFilters, 0));
  applyFilters();
};

const enhanceStoryFilters = () => {
  const filter = document.querySelector("[data-story-filter]");
  const groups = Array.from(document.querySelectorAll("[data-story-group]"));
  if (!filter || !groups.length) return;

  const count = document.querySelector("[data-story-count]");
  const cards = Array.from(document.querySelectorAll("[data-story-card]"));

  const applyFilter = selected => {
    groups.forEach(group => {
      group.hidden = selected !== "all" && group.dataset.storyGroup !== selected;
    });

    filter.querySelectorAll("[data-story-filter-value]").forEach(button => {
      const active = button.dataset.storyFilterValue === selected;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    const visibleCards = cards.filter(card => !card.closest("[data-story-group]")?.hidden).length;
    updateResultCount(count, visibleCards, cards.length, "employee stories");
  };

  filter.addEventListener("click", event => {
    const button = event.target.closest("[data-story-filter-value]");
    if (button) applyFilter(button.dataset.storyFilterValue);
  });

  applyFilter("all");
};

const talentPoolJobLists = {
  "logistics": {
    title: "Logistics role examples",
    intro: "Roles in this pool keep people, materials, marine support, and rig moves coordinated across Arabian Drilling operations.",
    cta: "View logistics jobs",
    href: "supply-chain-logistics-jobs.html",
    jobs: [
      ["Rig Move Coordinator", "Plans rig moves, transport timing, vendors, and field readiness.", "supply-chain-logistics-jobs.html"],
      ["Marine Logistics Coordinator", "Coordinates marine support, materials flow, and offshore mobilization.", "supply-chain-logistics-jobs.html"],
      ["Lifting Supervisor", "Supports lifting activity, equipment readiness, and safe movement planning.", "supply-chain-logistics-jobs.html"]
    ]
  },
  "human-resources": {
    title: "Human Resources role examples",
    intro: "Roles in this pool support people services, capability, rewards, government relations, and employee experience.",
    cta: "View HR jobs",
    href: "corporate-jobs.html",
    jobs: [
      ["HR Business Partner", "Supports leaders and employees across workforce planning and people matters.", "corporate-jobs.html"],
      ["Compensation and Benefits Specialist", "Maintains reward processes, benefits coordination, and policy-aligned support.", "benefits.html"],
      ["Competency Specialist", "Connects capability frameworks, training records, and development planning.", "learning-development.html"]
    ]
  },
  "supply-chain": {
    title: "Supply Chain role examples",
    intro: "Roles in this pool help operations secure materials, contracts, suppliers, inventory, and expediting support.",
    cta: "View supply chain jobs",
    href: "supply-chain-logistics-jobs.html",
    jobs: [
      ["Procurement Specialist", "Manages sourcing activity and supplier coordination for operational needs.", "supply-chain-logistics-jobs.html"],
      ["Materials Controller", "Tracks inventory, material availability, and issue readiness.", "supply-chain-logistics-jobs.html"],
      ["Contracts Coordinator", "Supports contract administration, documentation, and service coordination.", "supply-chain-logistics-jobs.html"]
    ]
  },
  "legal-contracts": {
    title: "Legal and Contracts role examples",
    intro: "Roles in this pool support commercial decisions, legal review, contracts, governance, and specialist advisory work.",
    cta: "View legal and contracts jobs",
    href: "corporate-jobs.html",
    jobs: [
      ["Contracts Specialist", "Supports contract review, obligations tracking, and stakeholder coordination.", "corporate-jobs.html"],
      ["Legal Counsel", "Provides legal advice for business, operations, and corporate matters.", "corporate-jobs.html"],
      ["Litigation Coordinator", "Coordinates case documentation, timelines, and legal follow-up.", "corporate-jobs.html"]
    ]
  },
  "hses": {
    title: "HSES role examples",
    intro: "Roles in this pool help teams work safely, protect the environment, and maintain compliance in field and office settings.",
    cta: "View HSES jobs",
    href: "hse-jobs.html",
    jobs: [
      ["HSE Officer", "Supports inspections, coaching, incident prevention, and safe work practices.", "job-detail.html"],
      ["Environmental Specialist", "Coordinates environmental controls, reporting, and site compliance activity.", "hse-jobs.html"],
      ["Safety Coach", "Reinforces safe behaviors, readiness, and practical field guidance.", "safety-culture.html"]
    ]
  },
  "information-technology": {
    title: "Information Technology role examples",
    intro: "Roles in this pool support digital systems, cyber security, data, infrastructure, and business technology services.",
    cta: "View IT jobs",
    href: "corporate-jobs.html",
    jobs: [
      ["Systems Analyst", "Supports business systems, requirements, testing, and user adoption.", "corporate-jobs.html"],
      ["Cyber Security Specialist", "Protects systems, access, data, and security practices across the business.", "corporate-jobs.html"],
      ["ERP Support Specialist", "Maintains ERP processes, issue resolution, and functional support.", "corporate-jobs.html"]
    ]
  },
  "internal-audit": {
    title: "Internal Audit role examples",
    intro: "Roles in this pool support assurance, governance, operational audits, and continuous control improvement.",
    cta: "View audit jobs",
    href: "corporate-jobs.html",
    jobs: [
      ["Internal Auditor", "Reviews controls, evidence, and business processes across functions.", "corporate-jobs.html"],
      ["Operational Audit Specialist", "Assesses operational practices, compliance, and improvement opportunities.", "corporate-jobs.html"],
      ["Compliance Assurance Analyst", "Supports audit follow-up, reporting, and governance documentation.", "corporate-jobs.html"]
    ]
  },
  "facilities": {
    title: "Facilities role examples",
    intro: "Roles in this pool keep workplaces, camps, services, and facilities ready for daily operations.",
    cta: "View facilities jobs",
    href: "maintenance-engineering-jobs.html",
    jobs: [
      ["Facilities Coordinator", "Coordinates workplace services, vendors, requests, and facility readiness.", "maintenance-engineering-jobs.html"],
      ["Camp Services Supervisor", "Supports lodging, services, and team needs at operational locations.", "maintenance-engineering-jobs.html"],
      ["Maintenance Services Planner", "Plans facility maintenance activity, work orders, and service schedules.", "maintenance-engineering-jobs.html"]
    ]
  },
  "drilling-operations": {
    title: "Drilling Operations role examples",
    intro: "Roles in this pool run safe, disciplined drilling activity across rigs, yards, training, and performance teams.",
    cta: "View drilling jobs",
    href: "onshore-drilling-jobs.html",
    jobs: [
      ["Driller", "Leads rig floor activity, drilling execution, and crew coordination.", "onshore-drilling-jobs.html"],
      ["Assistant Driller", "Supports drilling operations, equipment checks, and crew readiness.", "offshore-drilling-jobs.html"],
      ["Rig Superintendent", "Oversees rig performance, safety, people, and operational priorities.", "onshore-drilling-jobs.html"]
    ]
  },
  "risk-compliance": {
    title: "Risk and Compliance role examples",
    intro: "Roles in this pool support risk awareness, business controls, compliance activity, and governance routines.",
    cta: "View risk and compliance jobs",
    href: "corporate-jobs.html",
    jobs: [
      ["Risk Analyst", "Tracks risk registers, mitigation actions, and business reporting.", "corporate-jobs.html"],
      ["Compliance Officer", "Supports policy compliance, reviews, evidence, and follow-up.", "corporate-jobs.html"],
      ["Governance Specialist", "Maintains governance routines, documentation, and stakeholder actions.", "corporate-jobs.html"]
    ]
  },
  "commercial-marketing": {
    title: "Commercial and Marketing role examples",
    intro: "Roles in this pool connect customer relationships, market insight, contracts, and business growth.",
    cta: "View commercial jobs",
    href: "corporate-jobs.html",
    jobs: [
      ["Commercial Analyst", "Supports commercial analysis, tender inputs, and business reporting.", "corporate-jobs.html"],
      ["Sales and Marketing Specialist", "Coordinates market communication, customer engagement, and growth support.", "corporate-jobs.html"],
      ["Customer Contracts Coordinator", "Maintains customer contract actions, documentation, and internal follow-up.", "corporate-jobs.html"]
    ]
  },
  "finance": {
    title: "Finance role examples",
    intro: "Roles in this pool support accounting, reporting, billing, planning, analysis, and financial control.",
    cta: "View finance jobs",
    href: "corporate-jobs.html",
    jobs: [
      ["Accountant", "Supports accounting entries, reconciliations, and financial records.", "corporate-jobs.html"],
      ["Financial Planning Analyst", "Prepares planning inputs, analysis, forecasts, and management reporting.", "corporate-jobs.html"],
      ["Billing Controller", "Coordinates billing accuracy, customer invoices, and follow-up.", "corporate-jobs.html"]
    ]
  },
  "communication": {
    title: "Communication role examples",
    intro: "Roles in this pool support internal communication, events, content, and stakeholder engagement.",
    cta: "View communication jobs",
    href: "corporate-jobs.html",
    jobs: [
      ["Communications Specialist", "Creates communication plans, internal messages, and stakeholder updates.", "corporate-jobs.html"],
      ["Events Coordinator", "Supports events, logistics, schedules, and participant communication.", "events.html"],
      ["Content Specialist", "Develops content for campaigns, employee messages, and digital channels.", "corporate-jobs.html"]
    ]
  },
  "administrative": {
    title: "Administrative role examples",
    intro: "Roles in this pool keep teams organized through coordination, records, services, and office support.",
    cta: "View administrative jobs",
    href: "corporate-jobs.html",
    jobs: [
      ["Executive Assistant", "Supports schedules, meetings, travel, and leadership coordination.", "corporate-jobs.html"],
      ["Office Administrator", "Maintains office services, requests, documentation, and team support.", "corporate-jobs.html"],
      ["Document Controller", "Manages records, document flow, version control, and filing routines.", "corporate-jobs.html"]
    ]
  },
  "asset-management": {
    title: "Asset Management role examples",
    intro: "Roles in this pool improve asset readiness through engineering, design, QAQC, and lifecycle support.",
    cta: "View asset management jobs",
    href: "maintenance-engineering-jobs.html",
    jobs: [
      ["Asset Integrity Engineer", "Supports asset condition, lifecycle planning, inspections, and reliability actions.", "maintenance-engineering-jobs.html"],
      ["QAQC Engineer", "Maintains quality checks, technical standards, and engineering documentation.", "maintenance-engineering-jobs.html"],
      ["Technical Design Specialist", "Supports design review, engineering drawings, and modification readiness.", "maintenance-engineering-jobs.html"]
    ]
  }
};

const enhanceTalentPoolFilters = () => {
  const filter = document.querySelector("[data-talent-pool-filters]");
  const grid = document.querySelector("[data-talent-pool-grid]");
  if (!filter || !grid) return;

  const isReady = filter.dataset.filterReady === "true";
  const buttons = Array.from(filter.querySelectorAll("[data-talent-filter]"));
  const tiles = Array.from(grid.querySelectorAll("[data-talent-category]"));
  const count = document.querySelector("[data-talent-pool-count]");
  const jobsPanel = document.querySelector("[data-talent-pool-jobs]");

  const renderJobsPanel = selected => {
    if (!jobsPanel) return;

    const content = talentPoolJobLists[selected];
    if (!content || selected === "all") {
      jobsPanel.hidden = true;
      jobsPanel.innerHTML = "";
      return;
    }

    const poolLabel = content.title.replace(" role examples", "");
    jobsPanel.innerHTML = `
      <div class="talent-pool-jobs-header">
        <span class="kicker dark">Open role examples</span>
        <h3>${content.title}</h3>
        <p>${content.intro}</p>
      </div>
      <div class="talent-pool-job-list" aria-label="${poolLabel} jobs">
        ${content.jobs.map(([title, detail]) => `
          <article class="talent-pool-job-card">
            <div>
              <h4>${title}</h4>
              <p>${detail}</p>
              <div class="job-meta">
                <span>Saudi Arabia</span>
                <span>${poolLabel}</span>
                <span>Full-time</span>
              </div>
            </div>
            <div class="talent-pool-job-actions">
              <a class="btn secondary" href="${getJobPostHref(title)}">View job</a>
              <a class="btn primary" href="${getApplyPageHref(title)}">Apply now</a>
            </div>
          </article>
        `).join("")}
      </div>
      <a class="corporate-text-link" href="${content.href}">${content.cta} <span aria-hidden="true">→</span></a>
    `;
    jobsPanel.hidden = false;
  };

  const applyFilter = selected => {
    let visible = 0;

    tiles.forEach(tile => {
      const categories = (tile.dataset.talentCategory || "").split(/\s+/);
      const isVisible = selected === "all" || categories.includes(selected);
      tile.hidden = !isVisible;
      if (isVisible) visible += 1;
    });

    buttons.forEach(button => {
      const active = button.dataset.talentFilter === selected;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    updateResultCount(count, visible, tiles.length, "talent pools");
    renderJobsPanel(selected);
  };

  if (!isReady) {
    filter.dataset.filterReady = "true";
    filter.addEventListener("click", event => {
      const button = event.target.closest("[data-talent-filter]");
      if (!button) return;
      applyFilter(button.dataset.talentFilter);
    });
  }

  if (grid.dataset.tileFilterReady !== "true") {
    grid.dataset.tileFilterReady = "true";
    grid.addEventListener("click", event => {
      const tile = event.target.closest("[data-talent-category]");
      if (!tile) return;

      event.preventDefault();
      const selected = (tile.dataset.talentCategory || "").split(/\s+/)[0];
      if (!selected) return;

      applyFilter(selected);
      const activeButton = buttons.find(button => button.dataset.talentFilter === selected);
      if (activeButton) {
        activeButton.focus({ preventScroll: true });
      }
      filter.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  applyFilter("all");
};

const enhanceAnalyticsHooks = () => {
  document.querySelectorAll("a, button").forEach(element => {
    if (element.dataset.analyticsReady === "true") return;
    element.dataset.analyticsReady = "true";
    element.addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent("ad-careers-interaction", {
        detail: {
          label: element.textContent.trim().replace(/\s+/g, " "),
          href: element.getAttribute("href") || "",
          page: document.body.className,
          timestamp: new Date().toISOString()
        }
      }));
    });
  });
};

const storyRecommendations = {
  "story-fahad-al-harbi.html": {
    stories: [["Majed Al-Otaibi", "story-majed-al-otaibi.html"], ["Hassan Al-Shammari", "story-hassan-al-shammari.html"]],
    jobs: [["Onshore Drilling Jobs", "onshore-drilling-jobs.html"], ["HSE Officer", "job-detail.html"]]
  },
  "story-majed-al-otaibi.html": {
    stories: [["Fahad Al-Harbi", "story-fahad-al-harbi.html"], ["Hassan Al-Shammari", "story-hassan-al-shammari.html"]],
    jobs: [["Offshore Drilling Jobs", "offshore-drilling-jobs.html"], ["Offshore Electrician", "jobs.html"]]
  },
  "story-hassan-al-shammari.html": {
    stories: [["Fahad Al-Harbi", "story-fahad-al-harbi.html"], ["Abdullah Al-Rashid", "story-abdullah-al-rashid.html"]],
    jobs: [["HSE Jobs", "hse-jobs.html"], ["Field Roles", "jobs.html"]]
  },
  "story-noura-al-qahtani.html": {
    stories: [["Lama Al-Dossari", "story-lama-al-dossari.html"], ["Omar Al-Fahad", "story-omar-al-fahad.html"]],
    jobs: [["Graduate Program", "graduate-program.html"], ["Entry-Level Jobs", "entry-level-jobs.html"]]
  },
  "story-lama-al-dossari.html": {
    stories: [["Noura Al-Qahtani", "story-noura-al-qahtani.html"], ["Reem Al-Nasser", "story-reem-al-nasser.html"]],
    jobs: [["Corporate Careers", "corporate-jobs.html"], ["Talent Community", "talent-community.html"]]
  },
  "story-omar-al-fahad.html": {
    stories: [["Noura Al-Qahtani", "story-noura-al-qahtani.html"], ["Majed Al-Otaibi", "story-majed-al-otaibi.html"]],
    jobs: [["Maintenance & Engineering Jobs", "maintenance-engineering-jobs.html"], ["Graduate Program", "graduate-program.html"]]
  },
  "story-salem-al-mutairi.html": {
    stories: [["Reem Al-Nasser", "story-reem-al-nasser.html"], ["Abdullah Al-Rashid", "story-abdullah-al-rashid.html"]],
    jobs: [["Experienced Professionals", "professionals.html"], ["Operations Jobs", "jobs.html"]]
  },
  "story-reem-al-nasser.html": {
    stories: [["Salem Al-Mutairi", "story-salem-al-mutairi.html"], ["Lama Al-Dossari", "story-lama-al-dossari.html"]],
    jobs: [["Learning & Development", "learning-development.html"], ["Corporate Careers", "corporate-jobs.html"]]
  },
  "story-abdullah-al-rashid.html": {
    stories: [["Salem Al-Mutairi", "story-salem-al-mutairi.html"], ["Hassan Al-Shammari", "story-hassan-al-shammari.html"]],
    jobs: [["HSE Jobs", "hse-jobs.html"], ["Safety Culture", "safety-culture.html"]]
  }
};

const enhanceRelatedStoryContent = () => {
  const slug = window.location.pathname.split("/").pop();
  const config = storyRecommendations[slug];
  const main = document.querySelector("main");
  const cta = document.querySelector(".explore-cta-section");
  if (!config || !main || document.querySelector(".related-story-section")) return;

  const section = document.createElement("section");
  section.className = "section related-story-section";
  section.innerHTML = `
    <div class="container">
      <div class="section-head">
        <div><span class="kicker dark">Continue exploring</span><h2>Related stories and jobs</h2></div>
        <p>Move from an employee story into related talent pools, similar people stories, or open roles.</p>
      </div>
      <div class="related-story-grid">
        <div>
          <h3>Related employee stories</h3>
          ${config.stories.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
        </div>
        <div>
          <h3>Related talent pools</h3>
          ${config.jobs.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
        </div>
      </div>
    </div>
  `;

  main.insertBefore(section, cta || null);
};

document.querySelectorAll("[data-scroll-target]").forEach(button => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.scrollTarget);
    if (!target) return;

    const direction = Number(button.dataset.scrollDir || 1);
    target.scrollBy({
      left: direction * Math.max(target.clientWidth * 0.7, 280),
      behavior: "smooth"
    });
  });
});

document.querySelectorAll(".sidebar").forEach(sidebar => {
  const links = Array.from(sidebar.querySelectorAll('a[href^="#"]'));
  const sections = links
    .map(link => {
      const id = link.getAttribute("href")?.slice(1);
      const section = id ? document.getElementById(id) : null;
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  let hashLockUntil = 0;

  const setActive = activeLink => {
    links.forEach(link => {
      const isActive = link === activeLink;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const updateActiveSection = () => {
    if (window.location.hash && Date.now() < hashLockUntil) return;

    const offset = Math.min(window.innerHeight * 0.38, 260);
    let current = sections[0];

    sections.forEach(item => {
      const top = item.section.getBoundingClientRect().top;
      if (top <= offset) current = item;
    });

    setActive(current.link);
  };

  const updateActiveFromHash = () => {
    const hash = window.location.hash;
    if (!hash) {
      updateActiveSection();
      return;
    }

    const matching = links.find(link => link.getAttribute("href") === hash);
    if (matching) {
      hashLockUntil = Date.now() + 900;
      setActive(matching);
    }
  };

  links.forEach(link => {
    link.addEventListener("click", () => setActive(link));
  });

  updateActiveSection();
  requestAnimationFrame(updateActiveSection);
  window.setTimeout(updateActiveFromHash, 150);
  window.setTimeout(updateActiveFromHash, 500);
  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("hashchange", () => {
    window.setTimeout(updateActiveFromHash, 150);
  });
  window.addEventListener("resize", updateActiveSection);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      if (window.location.hash && Date.now() < hashLockUntil) return;

      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

      if (!visible) return;

      const match = sections.find(item => item.section === visible.target);
      if (match) setActive(match.link);
    }, {
      rootMargin: "-30% 0px -55% 0px",
      threshold: 0
    });

    sections.forEach(item => observer.observe(item.section));
  }
});

enhanceJobFilters();
enhanceStoryFilters();
enhanceTalentPoolFilters();
enhanceRelatedStoryContent();
enhanceAnalyticsHooks();
