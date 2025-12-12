document.addEventListener("DOMContentLoaded", () => {
  const allSteps = Array.from(document.querySelectorAll(".step"));
  let currentBranch = null; // 'employed' or 'owner'
  
  // Hide branch-specific steps initially
  document.querySelectorAll('.branch-employed, .branch-owner').forEach(step => {
    step.style.display = 'none';
  });

  let currentIndex = 0;
  let furthestIndex = 0;

  const formatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

  function formatCurrency(value) {
    const num = Number(value || 0);
    return "$" + formatter.format(num);
  }

  function setSummary(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || "—";
  }

  // Get currently visible steps based on branch
  function getVisibleSteps() {
    return allSteps.filter(step => {
      const style = window.getComputedStyle(step);
      return style.display !== 'none';
    });
  }

  // Build section metadata from visible steps
  function buildSectionMeta() {
    const sectionMeta = {};
    const visibleSteps = getVisibleSteps();
    
    visibleSteps.forEach((step, index) => {
      const sec = step.dataset.section;
      if (!sectionMeta[sec]) {
        sectionMeta[sec] = { min: index, max: index };
      } else {
        sectionMeta[sec].max = index;
      }
    });
    
    return sectionMeta;
  }

  /* ==========================
     Branch Management
  ========================== */
  function setBranch(branch) {
    currentBranch = branch;
    
    // Hide all branch-specific steps
    document.querySelectorAll('.branch-employed, .branch-owner').forEach(step => {
      step.style.display = 'none';
    });
    
    // Show only steps for selected branch
    if (branch === 'employed') {
      document.querySelectorAll('.branch-employed').forEach(step => {
        step.style.display = 'block';
      });
    } else if (branch === 'owner') {
      document.querySelectorAll('.branch-owner').forEach(step => {
        step.style.display = 'block';
      });
    }
  }

  /* ==========================
     Navigation
  ========================== */
  function goToStep(id) {
    const target = document.getElementById(id);
    if (!target) return;

    const visibleSteps = getVisibleSteps();
    
    allSteps.forEach((step) => step.classList.remove("active"));
    target.classList.add("active");

    currentIndex = visibleSteps.indexOf(target);
    furthestIndex = Math.max(furthestIndex, currentIndex);

    document.querySelector(".content-area").scrollTop = 0;

    updateSidebar();
    updateProgress();
  }

  // Next buttons
  document.querySelectorAll(".btn-next").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.dataset.next;
      if (!next) return;

      if (next === "complete") {
        // Placeholder: later hook into Salesforce + estimate
        window.location.href = "complete/index.html";
        return;
      }

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
     Sidebar Pills - Click to Navigate
  ========================== */
  document.querySelectorAll(".section-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      // Only allow clicking completed sections
      if (!pill.classList.contains("complete")) return;
      
      const targetSection = pill.dataset.section;
      const visibleSteps = getVisibleSteps();
      
      // Find first visible step in that section
      const firstStep = visibleSteps.find(step => step.dataset.section === targetSection);
      if (firstStep) {
        goToStep(firstStep.id);
      }
    });
  });

  /* ==========================
     Sidebar highlighting + completion
  ========================== */
  function updateSidebar() {
    const visibleSteps = getVisibleSteps();
    const activeStep = visibleSteps[currentIndex];
    if (!activeStep) return;
    
    const activeSection = activeStep.dataset.section;
    const sectionMeta = buildSectionMeta();
    
    document.querySelectorAll(".section-pill").forEach((pill) => {
      const sec = pill.dataset.section;
      const meta = sectionMeta[sec];

      // If section doesn't exist in current branch, show as inactive
      if (!meta) {
        pill.classList.remove("active", "complete");
        return;
      }

      pill.classList.toggle("active", sec === activeSection);

      // Section is "complete" if user has progressed past all its steps
      const isComplete = meta && meta.max < furthestIndex && sec !== activeSection;
      pill.classList.toggle("complete", isComplete);
    });
  }

  /* ==========================
     Progress Dial
  ========================== */
  const dial = document.querySelector(".dial-progress");
  const label = document.getElementById("progress-label");
  const circumference = 157; // Semi-circle arc length

  function updateProgress() {
    const visibleSteps = getVisibleSteps();
    const totalSteps = visibleSteps.length;
    const pct = Math.round(((currentIndex + 1) / totalSteps) * 100);
    const offset = circumference - (pct / 100) * circumference;
    dial.style.strokeDashoffset = offset;
    label.textContent = `${pct}%`;
  }

  /* ==========================
     Employment Structure Branching
  ========================== */
  document.querySelectorAll('input[name="employment-structure"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const branch = e.target.dataset.branch;
      
      // If changing branches, reset progress after employment structure
      if (currentBranch && currentBranch !== branch) {
        const visibleSteps = getVisibleSteps();
        const employmentStep = allSteps.find(s => s.id === 'step-employment-structure');
        const employmentIndex = visibleSteps.indexOf(employmentStep);
        if (employmentIndex !== -1) {
          furthestIndex = employmentIndex;
        }
      }
      
      setBranch(branch);
      
      // Update Continue button
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

  // Initialize
  updateProgress();
  updateSidebar();

  /* ==========================
     Prefill Loan Amount from ?amount=
  ========================== */
  const loanInput = document.getElementById("loan-amount-input");
  const params = new URLSearchParams(window.location.search);
  const amountParam = params.get("amount");

  if (loanInput) {
    if (amountParam) {
      const clean = amountParam.replace(/[^\d]/g, "");
      loanInput.value = formatter.format(clean);
      setSummary("summary-loan-amount", formatCurrency(clean));
    }

    loanInput.addEventListener("input", () => {
      let raw = loanInput.value.replace(/[^\d]/g, "");
      if (!raw) {
        loanInput.value = "";
        setSummary("summary-loan-amount", "—");
        return;
      }
      loanInput.value = formatter.format(raw);
      setSummary("summary-loan-amount", formatCurrency(raw));
    });
  }

  /* ==========================
     Map radio groups to summary
  ========================== */
  function mapRadioGroup(name, summaryId) {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    if (!radios.length) return;

    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        const selected = Array.from(radios).find((r) => r.checked);
        setSummary(summaryId, selected ? selected.value : "—");
      });
    });
  }

  mapRadioGroup("loan-purpose", "summary-loan-purpose");
  mapRadioGroup("credit-score", "summary-credit-score");
  mapRadioGroup("employment-structure", "summary-employment");

  /* ==========================
     Sliders (Income & Debt)
  ========================== */
  const incomeSlider = document.getElementById("income-input");
  const incomeDisplay = document.getElementById("income-display");

  if (incomeSlider && incomeDisplay) {
    const updateIncome = () => {
      const val = Number(incomeSlider.value || 0);
      const text = val >= 100000 ? "$100K+" : formatCurrency(val);
      incomeDisplay.textContent = text;
      setSummary("summary-income", text);
      
      // Update CSS custom property for gradient fill
      const percent = (val / 100000) * 100;
      incomeSlider.style.setProperty('--value', percent + '%');
    };
    incomeSlider.addEventListener("input", updateIncome);
    updateIncome();
  }

  const debtSlider = document.getElementById("debt-input");
  const debtDisplay = document.getElementById("debt-display");

  if (debtSlider && debtDisplay) {
    const updateDebt = () => {
      const val = Number(debtSlider.value || 0);
      const text = val >= 50000 ? "$50K+" : formatCurrency(val);
      debtDisplay.textContent = text;
      setSummary("summary-debt", text);
      
      // Update CSS custom property for gradient fill
      const percent = (val / 50000) * 100;
      debtSlider.style.setProperty('--value', percent + '%');
    };
    debtSlider.addEventListener("input", updateDebt);
    updateDebt();
  }

  /* ==========================
     Insurance checkbox summary
  ========================== */
  const insuranceGroup = document.getElementById("insurance-group");
  if (insuranceGroup) {
    insuranceGroup.addEventListener("change", () => {
      const selected = Array.from(
        insuranceGroup.querySelectorAll('input[type="checkbox"]:checked')
      ).map((c) => c.value);
      setSummary("summary-insurance", selected.join(", ") || "—");
    });
  }

  /* ==========================
     Phone number formatting
  ========================== */
  const phoneInput = document.getElementById("phone-input");
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 10) value = value.slice(0, 10);
      
      if (value.length >= 6) {
        e.target.value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
      } else if (value.length >= 3) {
        e.target.value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
      } else {
        e.target.value = value;
      }
    });
  }

  /* ==========================
     NPI number validation
  ========================== */
  const npiInput = document.getElementById("npi-input");
  if (npiInput) {
    npiInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 10) value = value.slice(0, 10);
      e.target.value = value;
    });
  }

  /* ==========================
     Collect Form Data (for submission)
  ========================== */
  function collectFormData() {
    const formData = {};
    
    // Text inputs
    document.querySelectorAll('input[type="text"], input[type="email"], input[type="number"]').forEach(input => {
      if (input.id) {
        formData[input.id] = input.value;
      }
    });
    
    // Radio buttons
    document.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
      formData[radio.name] = radio.value;
    });
    
    // Checkboxes
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
      if (!formData[checkbox.name]) {
        formData[checkbox.name] = [];
      }
      formData[checkbox.name].push(checkbox.value);
    });
    
    // Range sliders
    document.querySelectorAll('input[type="range"]').forEach(slider => {
      if (slider.id) {
        formData[slider.id] = slider.value;
      }
    });
    
    return formData;
  }

  /* ==========================
     Submit button
  ========================== */
  const submitBtn = document.querySelector(".btn-submit");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      const formData = collectFormData();
      
      // Basic validation
      if (!formData.email || !formData['phone-input']) {
        alert("Please fill in all required fields.");
        return;
      }
      
      console.log("Form Data:", formData);
      console.log("Branch:", currentBranch);
      
      // TODO: Send to backend/Salesforce
      alert("Thank you! Your pre-qualification request has been submitted.");
    });
  }
});
