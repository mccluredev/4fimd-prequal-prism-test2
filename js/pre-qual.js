document.addEventListener("DOMContentLoaded", () => {
  const steps = Array.from(document.querySelectorAll(".step"));
  const totalSteps = steps.length;

  // Build section metadata for completion tracking
  const sectionMeta = {};
  steps.forEach((step, index) => {
    const sec = step.dataset.section;
    if (!sectionMeta[sec]) {
      sectionMeta[sec] = { min: index, max: index };
    } else {
      sectionMeta[sec].max = index;
    }
  });

  let currentIndex = 0;
  let furthestIndex = 0;
  let employmentType = null; // Track employment structure choice

  const formatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

  function formatCurrency(value) {
    const num = Number(value || 0);
    return "$" + formatter.format(num);
  }

  /* ==========================
     Navigation
  ========================== */
  function goToStep(id) {
    const target = document.getElementById(id);
    if (!target) return;

    steps.forEach((step) => step.classList.remove("active"));
    target.classList.add("active");

    currentIndex = steps.indexOf(target);
    furthestIndex = Math.max(furthestIndex, currentIndex);

    // Scroll to top of content area
    document.querySelector(".content-area").scrollTop = 0;

    updateSidebar();
    updateProgress();
  }

  /* ==========================
     Sidebar Section Navigation
  ========================== */
  document.querySelectorAll(".section-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      const targetSection = pill.dataset.section;
      
      // Find the first step in that section
      const firstStepInSection = steps.find((step) => step.dataset.section === targetSection);
      
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

  /* ==========================
     Employment Structure Branching
  ========================== */
  document.querySelectorAll('input[name="employment-structure"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      employmentType = e.target.value;
      console.log("Employment type selected:", employmentType);
      
      // You can add logic here to show/hide specific steps based on the choice
      // For now, we'll just track it
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
    
    // Show success message or redirect to results page
    alert("Thank you! Your pre-qualification request has been submitted.");
  });

  /* ==========================
     Sidebar highlighting + completion
  ========================== */
  function updateSidebar() {
    const activeSection = steps[currentIndex].dataset.section;
    document.querySelectorAll(".section-pill").forEach((pill) => {
      const sec = pill.dataset.section;
      const meta = sectionMeta[sec];

      pill.classList.toggle("active", sec === activeSection);

      // A section is "complete" if all of its steps are at or before furthestIndex
      const isComplete =
        meta && meta.max <= furthestIndex && sec !== activeSection;
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
