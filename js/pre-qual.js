document.addEventListener("DOMContentLoaded", () => {
  const steps = Array.from(document.querySelectorAll(".step"));
  let currentBranch = null; // 'employed' or 'owner'

  // Build section metadata for completion tracking
  const sectionMeta = {};
  
  function rebuildSectionMeta() {
    Object.keys(sectionMeta).forEach(key => delete sectionMeta[key]);
    
    const visibleSteps = steps.filter(step => {
      if (!currentBranch) return !step.classList.contains('branch-employed') && !step.classList.contains('branch-owner');
      if (currentBranch === 'employed') return !step.classList.contains('branch-owner');
      if (currentBranch === 'owner') return !step.classList.contains('branch-employed');
      return true;
    });
    
    visibleSteps.forEach((step, index) => {
      const sec = step.dataset.section;
      if (!sectionMeta[sec]) {
        sectionMeta[sec] = { min: index, max: index };
      } else {
        sectionMeta[sec].max = index;
      }
    });
  }
  
  rebuildSectionMeta();

  let currentIndex = 0;
  let furthestIndex = 0;

  const formatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

  function formatCurrency(value) {
    const num = Number(value || 0);
    return "$" + formatter.format(num);
  }

  /* ==========================
     Branch Management
  ========================== */
  function setBranch(branch) {
    currentBranch = branch;
    console.log("Branch set to:", branch);
    
    // Hide all branch-specific steps
    document.querySelectorAll('.branch-employed, .branch-owner').forEach(step => {
      step.style.display = 'none';
    });
    
    // Show only steps for the selected branch
    if (branch === 'employed') {
      document.querySelectorAll('.branch-employed').forEach(step => {
        step.style.display = 'block';
      });
    } else if (branch === 'owner') {
      document.querySelectorAll('.branch-owner').forEach(step => {
        step.style.display = 'block';
      });
    }
    
    rebuildSectionMeta();
  }

  // Initially hide all branch-specific steps
  document.querySelectorAll('.branch-employed, .branch-owner').forEach(step => {
    step.style.display = 'none';
  });

  /* ==========================
     Navigation
  ========================== */
  function goToStep(id) {
    const target = document.getElementById(id);
    if (!target) return;

    // Check if target step is visible based on current branch
    if (target.classList.contains('branch-employed') && currentBranch !== 'employed') return;
    if (target.classList.contains('branch-owner') && currentBranch !== 'owner') return;

    steps.forEach((step) => step.classList.remove("active"));
    target.classList.add("active");

    // Calculate index among visible steps only
    const visibleSteps = steps.filter(step => {
      const style = window.getComputedStyle(step);
      return style.display !== 'none';
    });
    
    currentIndex = visibleSteps.indexOf(target);
    furthestIndex = Math.max(furthestIndex, currentIndex);

    // Scroll to top of content area
    document.querySelector(".content-area").scrollTop = 0;

    updateSidebar();
    updateProgress();
  }

  /* ==========================
     Employment Structure Branching
  ========================== */
  document.querySelectorAll('input[name="employment-structure"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const branch = e.target.dataset.branch;
      
      // If branch is changing, reset furthest index for affected sections
      if (currentBranch && currentBranch !== branch) {
        console.log("Branch changed from", currentBranch, "to", branch);
        // Reset progress past the employment structure question
        const employmentStepIndex = steps.findIndex(s => s.id === 'step-employment-structure');
        const visibleSteps = steps.filter(step => {
          const style = window.getComputedStyle(step);
          return style.display !== 'none';
        });
        const currentVisibleIndex = visibleSteps.indexOf(steps[employmentStepIndex]);
        furthestIndex = Math.min(furthestIndex, currentVisibleIndex);
      }
      
      setBranch(branch);
      
      // Update the Continue button to go to the correct next step
      const continueBtn = document.querySelector('#step-employment-structure .btn-next');
      if (branch === 'employed') {
        continueBtn.dataset.next = 'step-compensation-employed';
      } else if (branch === 'owner') {
        continueBtn.dataset.next = 'step-practice-basics';
      }
      
      updateSidebar();
      updateProgress();
    });
  });

  /* ==========================
     Sidebar Section Navigation
  ========================== */
  document.querySelectorAll(".section-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      const targetSection = pill.dataset.section;
      
      // Find the first visible step in that section
      const firstStepInSection = steps.find((step) => {
        if (step.dataset.section !== targetSection) return false;
        
        // Check if step is visible
        const style = window.getComputedStyle(step);
        if (style.display === 'none') return false;
        
        // Check branch compatibility
        if (step.classList.contains('branch-employed') && currentBranch !== 'employed') return false;
        if (step.classList.contains('branch-owner') && currentBranch !== 'owner') return false;
        
        return true;
      });
      
      if (firstStepInSection) {
        goToStep(firstStepInSection.id);
      }
    });
  });

  // Next buttons
  document.querySelectorAll(".btn-next").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.dataset.next;
      if (!next) return;
      goToStep(next);
    });
  });

  // Previous buttons
  document.querySelectorAll(".btn-prev").forEach((btn) => {
    btn.addEventListener("click", () => {
      const prev = btn.dataset.prev;
      if (prev) goToStep(prev);
    });
  });

  // Submit button
  document.querySelector(".btn-submit")?.addEventListener("click", () => {
    // Collect form data
    const formData = collectFormData();
    
    // Validate required fields
    if (!formData.email || !formData.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    // Log form data (in production, send to server)
    console.log("Form Data:", formData);
    console.log("Branch:", currentBranch);
    
    // Show success message or redirect to results page
    alert("Thank you! Your pre-qualification request has been submitted.");
  });

  /* ==========================
     Sidebar highlighting + completion
  ========================== */
  function updateSidebar() {
    const activeStep = steps.find(s => s.classList.contains('active'));
    if (!activeStep) return;
    
    const activeSection = activeStep.dataset.section;
    
    document.querySelectorAll(".section-pill").forEach((pill) => {
      const sec = pill.dataset.section;
      const meta = sectionMeta[sec];

      pill.classList.toggle("active", sec === activeSection);

      // A section is "complete" if all of its steps are PAST furthestIndex (not at or before)
      // and it's not the current section
      const isComplete = meta && meta.max < currentIndex && sec !== activeSection;
      pill.classList.toggle("completed", isComplete);
    });
  }

  /* ==========================
     Progress Dial
  ========================== */
  const dial = document.querySelector(".dial-progress");
  const label = document.getElementById("progress-label");
  const circumference = 157; // Arc length for the dial

  function updateProgress() {
    // Count only visible steps
    const visibleSteps = steps.filter(step => {
      const style = window.getComputedStyle(step);
      return style.display !== 'none';
    });
    
    const totalSteps = visibleSteps.length;
    const pct = Math.round(((currentIndex + 1) / totalSteps) * 100);
    const offset = circumference - (pct / 100) * circumference;
    dial.style.strokeDashoffset = offset;
    label.textContent = `${pct}%`;
  }

  updateProgress();
  updateSidebar();

  /* ==========================
     Slider Updates
  ========================== */
  const incomeSlider = document.getElementById("income-input");
  const incomeDisplay = document.getElementById("income-display");

  if (incomeSlider && incomeDisplay) {
    const updateIncome = () => {
      const val = Number(incomeSlider.value || 0);
      const max = Number(incomeSlider.max);
      const progress = (val / max) * 100;
      
      // Update display text
      const text = val >= 100000 ? "$100K+" : formatCurrency(val);
      incomeDisplay.textContent = text;
      
      // Update slider background gradient
      incomeSlider.style.setProperty('--slider-progress', progress + '%');
    };
    incomeSlider.addEventListener("input", updateIncome);
    updateIncome();
  }

  const debtSlider = document.getElementById("debt-input");
  const debtDisplay = document.getElementById("debt-display");

  if (debtSlider && debtDisplay) {
    const updateDebt = () => {
      const val = Number(debtSlider.value || 0);
      const max = Number(debtSlider.max);
      const progress = (val / max) * 100;
      
      // Update display text
      const text = val >= 50000 ? "$50K+" : formatCurrency(val);
      debtDisplay.textContent = text;
      
      // Update slider background gradient
      debtSlider.style.setProperty('--slider-progress', progress + '%');
    };
    debtSlider.addEventListener("input", updateDebt);
    updateDebt();
  }

  /* ==========================
     Form Data Collection
  ========================== */
  function collectFormData() {
    const formData = {};

    // Radio buttons
    const radioGroups = [
      "loan-purpose",
      "credit-score",
      "employment-structure",
      "payment-type",
      "payment-duration",
      "employer-type"
    ];

    radioGroups.forEach((name) => {
      const selected = document.querySelector(`input[name="${name}"]:checked`);
      formData[name] = selected ? selected.value : null;
    });

    // Sliders
    formData.income = incomeSlider ? incomeSlider.value : null;
    formData.debt = debtSlider ? debtSlider.value : null;

    // Text inputs
    formData.employerName = document.getElementById("employer-name-input")?.value || null;
    formData.firstName = document.getElementById("first-name-input")?.value || null;
    formData.lastName = document.getElementById("last-name-input")?.value || null;
    formData.npi = document.getElementById("npi-input")?.value || null;
    formData.specialty = document.getElementById("specialty-input")?.value || null;
    formData.email = document.getElementById("email-input")?.value || null;
    formData.phone = document.getElementById("phone-input")?.value || null;

    // Checkboxes
    const insuranceChecks = Array.from(
      document.querySelectorAll('input[name="insurance"]:checked')
    ).map((c) => c.value);
    formData.insurance = insuranceChecks.length > 0 ? insuranceChecks : null;

    formData.consent = document.getElementById("consent-input")?.checked || false;

    return formData;
  }

  /* ==========================
     Auto-enable continue buttons when options selected
  ========================== */
  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      // Find the step this radio belongs to
      const step = radio.closest(".step");
      if (step) {
        const continueBtn = step.querySelector(".btn-next");
        if (continueBtn) {
          continueBtn.classList.remove("disabled");
          continueBtn.disabled = false;
        }
      }
    });
  });

  /* ==========================
     Smooth scroll behavior
  ========================== */
  const contentArea = document.querySelector(".content-area");
  if (contentArea) {
    contentArea.style.scrollBehavior = "smooth";
  }

  /* ==========================
     Prevent form submission on Enter
  ========================== */
  document.getElementById("prequal-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  /* ==========================
     Input validation and formatting
  ========================== */
  
  // Phone number formatting
  const phoneInput = document.getElementById("phone-input");
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 10) value = value.slice(0, 10);
      
      if (value.length >= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
      } else if (value.length >= 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
      }
      
      e.target.value = value;
    });
  }

  // NPI number formatting (10 digits only)
  const npiInput = document.getElementById("npi-input");
  if (npiInput) {
    npiInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 10) value = value.slice(0, 10);
      e.target.value = value;
    });
  }

  /* ==========================
     Keyboard navigation
  ========================== */
  document.addEventListener("keydown", (e) => {
    // Allow Enter to click Continue button
    if (e.key === "Enter" && document.activeElement.tagName !== "TEXTAREA") {
      const activeStep = document.querySelector(".step.active");
      if (activeStep) {
        const continueBtn = activeStep.querySelector(".btn-next, .btn-submit");
        if (continueBtn && !continueBtn.disabled) {
          continueBtn.click();
        }
      }
    }
  });
});
