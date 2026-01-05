document.addEventListener("DOMContentLoaded", () => {
  const allSteps = Array.from(document.querySelectorAll(".step"));
  let currentBranch = null; // 'employed' or 'owner'
  
  // Hide branch-specific steps initially (add hidden class)
  document.querySelectorAll('.branch-employed, .branch-owner').forEach(step => {
    step.classList.add('branch-hidden');
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
      // Exclude steps that are branch-hidden
      return !step.classList.contains('branch-hidden');
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

    // Hide all branch-specific steps (use class, not inline style)
    document.querySelectorAll('.branch-employed, .branch-owner').forEach(step => {
      step.classList.add('branch-hidden');
    });

    // Show only steps for selected branch (remove hidden class)
    if (branch === 'employed') {
      document.querySelectorAll('.branch-employed').forEach(step => {
        step.classList.remove('branch-hidden');
      });
    } else if (branch === 'owner') {
      document.querySelectorAll('.branch-owner').forEach(step => {
        step.classList.remove('branch-hidden');
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

  /* ==========================
     Validation Functions
  ========================== */
  function showValidationMessage(step, message) {
    // Remove any existing validation message
    const existing = step.querySelector('.validation-message');
    if (existing) existing.remove();

    // Create and insert new validation message
    const validationDiv = document.createElement('div');
    validationDiv.className = 'validation-message show';
    validationDiv.textContent = message;

    // Insert after the step-actions div (after the Continue button)
    const actions = step.querySelector('.step-actions');
    if (actions) {
      actions.after(validationDiv);
    } else {
      step.appendChild(validationDiv);
    }

    // Scroll to the message
    validationDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-hide after 5 seconds
    setTimeout(() => {
      validationDiv.classList.remove('show');
      setTimeout(() => validationDiv.remove(), 300);
    }, 5000);
  }

  function validateStep(stepId) {
    const step = document.getElementById(stepId);
    if (!step) return true;

    // Loan amount validation
    if (stepId === 'step-loan-amount') {
      const loanInput = document.getElementById('loan-amount-input');
      const value = loanInput.value.replace(/[^0-9]/g, '');
      if (!value || parseInt(value) === 0) {
        showValidationMessage(step, 'Please enter a loan amount');
        return false;
      }
    }

    // Radio button validation (loan purpose, credit score, employment structure, etc.)
    const radioGroups = step.querySelectorAll('input[type="radio"]');
    if (radioGroups.length > 0) {
      const radioNames = [...new Set([...radioGroups].map(r => r.name))];
      for (const name of radioNames) {
        const checked = step.querySelector(`input[name="${name}"]:checked`);
        if (!checked) {
          showValidationMessage(step, 'Please select an option to continue');
          return false;
        }
      }
    }

    // Text input validation for personal info
    if (stepId === 'step-personal') {
      const firstName = document.getElementById('first-name-input');
      const lastName = document.getElementById('last-name-input');
      const npi = document.getElementById('npi-input');
      const specialty = document.getElementById('specialty-input');

      if (!firstName.value.trim()) {
        showValidationMessage(step, 'Please enter your first name');
        return false;
      }
      if (!lastName.value.trim()) {
        showValidationMessage(step, 'Please enter your last name');
        return false;
      }
      if (!npi.value.trim()) {
        showValidationMessage(step, 'Please enter your NPI number');
        return false;
      }
      if (!specialty.value) {
        showValidationMessage(step, 'Please select your medical specialty');
        return false;
      }
    }

    // Contact validation
    if (stepId === 'step-contact') {
      const email = document.getElementById('email-input');
      const phone = document.getElementById('phone-input');
      const consent = document.getElementById('consent-input');

      if (!email.value.trim()) {
        showValidationMessage(step, 'Please enter your email address');
        return false;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        showValidationMessage(step, 'Please enter a valid email address');
        return false;
      }
      if (!phone.value.trim()) {
        showValidationMessage(step, 'Please enter your phone number');
        return false;
      }
      if (!consent.checked) {
        showValidationMessage(step, 'Please agree to the contact terms to continue');
        return false;
      }
    }

    // Employer name validation (employed branch)
    if (stepId === 'step-employer-employed') {
      const employerName = document.getElementById('employer-name-input');
      if (!employerName.value.trim()) {
        showValidationMessage(step, 'Please enter your employer name');
        return false;
      }
    }

    // Practice basics validation (owner branch)
    if (stepId === 'step-practice-basics') {
      const physiciansCount = document.getElementById('physicians-count-input');
      const providersCount = document.getElementById('providers-count-input');
      if (!physiciansCount.value || !providersCount.value) {
        showValidationMessage(step, 'Please fill in all practice information');
        return false;
      }
    }

    // Patient volume validation (owner branch)
    if (stepId === 'step-patient-volume') {
      const patientVolume = document.getElementById('patient-volume-input');
      if (!patientVolume.value) {
        showValidationMessage(step, 'Please enter the monthly patient volume');
        return false;
      }
    }

    // Payer mix validation (owner branch)
    if (stepId === 'step-payer-mix') {
      const payersCount = document.getElementById('payers-count-input');
      const privateInput = document.getElementById('payer-private-input');
      const medicareInput = document.getElementById('payer-medicare-input');
      const medicaidInput = document.getElementById('payer-medicaid-input');
      const otherInput = document.getElementById('payer-other-input');

      if (!payersCount.value) {
        showValidationMessage(step, 'Please enter the number of unique payers');
        return false;
      }

      const total = parseInt(privateInput.value || 0) +
                    parseInt(medicareInput.value || 0) +
                    parseInt(medicaidInput.value || 0) +
                    parseInt(otherInput.value || 0);

      if (total !== 100) {
        showValidationMessage(step, 'Payer percentages must add up to 100%');
        return false;
      }
    }

    return true;
  }

  // Next buttons
  document.querySelectorAll(".btn-next").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.dataset.next;
      if (!next) return;

      // Get current step ID
      const currentStep = document.querySelector('.step.active');
      const currentStepId = currentStep ? currentStep.id : null;

      // Validate before proceeding
      if (currentStepId && !validateStep(currentStepId)) {
        return;
      }

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
      let prev = btn.dataset.prev;

      // Handle branch-aware back buttons
      if (btn.hasAttribute('data-branch-prev')) {
        if (currentBranch === 'employed') {
          prev = 'step-employer-employed';
        } else if (currentBranch === 'owner') {
          prev = 'step-payer-mix';
        }
      }

      if (prev) goToStep(prev);
    });
  });

  /* ==========================
     Sidebar Pills - Click to Navigate
  ========================== */
  let formSubmitted = false; // Track if form has been submitted

  document.querySelectorAll(".section-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      // Disable navigation if form has been submitted
      if (formSubmitted) return;

      // Allow clicking active or completed sections (not gray/inactive ones)
      if (!pill.classList.contains("complete") && !pill.classList.contains("active")) return;

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

      // Remove all states first
      pill.classList.remove("active", "complete");

      // If section doesn't exist in current branch, leave it inactive (gray)
      if (!meta) {
        return;
      }

      // Section is ACTIVE if we're currently in it
      if (sec === activeSection) {
        pill.classList.add("active");
        return;
      }

      // Section is COMPLETE if user has progressed past all its steps
      if (meta.max < currentIndex) {
        pill.classList.add("complete");
      }
    });
  }

  /* ==========================
     Progress Dial
  ========================== */
  const dial = document.querySelector(".dial-progress");
  const label = document.getElementById("progress-label");
  const circumference = 157; // Semi-circle arc length: π * radius = π * 50 ≈ 157

  function updateProgress() {
    const visibleSteps = getVisibleSteps();
    const totalSteps = visibleSteps.length;
    const pct = Math.round(((currentIndex + 1) / totalSteps) * 100);
    const offset = circumference - (pct / 100) * circumference;
    dial.style.strokeDashoffset = offset;
    label.textContent = `${pct}%`;
  }

  /* ==========================
     Clear Branch-Specific Form Data
  ========================== */
  function clearBranchData(branch) {
    // Clear all inputs in the branch-specific steps
    const branchClass = branch === 'employed' ? '.branch-employed' : '.branch-owner';
    document.querySelectorAll(`${branchClass} input, ${branchClass} select`).forEach(input => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false;
      } else if (input.type === 'range') {
        input.value = input.defaultValue || input.min || 0;
        // Trigger change event to update displays
        input.dispatchEvent(new Event('input'));
      } else {
        input.value = '';
      }
    });
  }

  /* ==========================
     Employment Structure Branching
  ========================== */
  document.querySelectorAll('input[name="employment-structure"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const newBranch = e.target.dataset.branch;

      // If changing branches and user has progressed beyond employment structure
      if (currentBranch && currentBranch !== newBranch) {
        const visibleSteps = getVisibleSteps();
        const employmentStep = allSteps.find(s => s.id === 'step-employment-structure');
        const employmentIndex = visibleSteps.indexOf(employmentStep);

        // Check if user has progressed beyond employment structure step
        if (currentIndex > employmentIndex) {
          // Show confirmation dialog
          const confirmed = confirm(
            "Are you sure you want to change your employment structure? All answers from this point forward will be removed and you'll need to start again from this step."
          );

          if (!confirmed) {
            // Revert the radio selection to current branch
            document.querySelector(`input[name="employment-structure"][data-branch="${currentBranch}"]`).checked = true;
            return;
          }

          // Clear data from the OLD branch before switching
          clearBranchData(currentBranch);

          // Reset progress to employment structure step
          furthestIndex = employmentIndex;
          currentIndex = employmentIndex;
        }
      }

      setBranch(newBranch);

      // Update Continue button
      const continueBtn = document.querySelector('#step-employment-structure .btn-next');
      if (newBranch === 'employed') {
        continueBtn.dataset.next = 'step-compensation-employed';
      } else if (newBranch === 'owner') {
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
     Business zip code validation (5 digits)
  ========================== */
  const businessZipInput = document.getElementById("business-zip-input");
  if (businessZipInput) {
    businessZipInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 5) value = value.slice(0, 5);
      e.target.value = value;
    });
  }

  /* ==========================
     Payer mix auto-calculation
  ========================== */
  const payerInputs = document.querySelectorAll('.payer-percentage');
  const payerTotalDisplay = document.getElementById('payer-total-display');

  if (payerInputs.length > 0 && payerTotalDisplay) {
    function updatePayerTotal() {
      const private = parseInt(document.getElementById('payer-private-input').value) || 0;
      const medicare = parseInt(document.getElementById('payer-medicare-input').value) || 0;
      const medicaid = parseInt(document.getElementById('payer-medicaid-input').value) || 0;
      const other = parseInt(document.getElementById('payer-other-input').value) || 0;

      const total = private + medicare + medicaid + other;

      if (total === 0) {
        payerTotalDisplay.textContent = '';
      } else if (total === 100) {
        payerTotalDisplay.textContent = 'Total: 100% ✓';
        payerTotalDisplay.style.color = 'var(--color-brand-teal)';
      } else {
        payerTotalDisplay.textContent = `Total: ${total}% (must equal 100%)`;
        payerTotalDisplay.style.color = 'var(--color-font-muted)';
      }
    }

    // Auto-fill last field to reach 100%
    payerInputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        updatePayerTotal();

        // Auto-calculate the empty field if 3 fields are filled
        const filledInputs = Array.from(payerInputs).filter(inp => inp.value && parseInt(inp.value) > 0);
        const emptyInputs = Array.from(payerInputs).filter(inp => !inp.value || parseInt(inp.value) === 0);

        if (filledInputs.length === 3 && emptyInputs.length === 1) {
          const private = parseInt(document.getElementById('payer-private-input').value) || 0;
          const medicare = parseInt(document.getElementById('payer-medicare-input').value) || 0;
          const medicaid = parseInt(document.getElementById('payer-medicaid-input').value) || 0;
          const other = parseInt(document.getElementById('payer-other-input').value) || 0;

          const currentTotal = private + medicare + medicaid + other;
          const remaining = 100 - currentTotal;

          if (remaining >= 0 && remaining <= 100) {
            emptyInputs[0].value = remaining;
            updatePayerTotal();
          }
        }
      });
    });
  }

  /* ==========================
     Collect Form Data (for submission)
  ========================== */
  function collectFormData() {
    const formData = {};

    // Text inputs
    document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="number"]').forEach(input => {
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

    // Dropdown selects
    document.querySelectorAll('select').forEach(select => {
      if (select.id) {
        formData[select.id] = select.value;
      }
    });

    return formData;
  }

  /* ==========================
     Populate Hidden Salesforce Fields
  ========================== */
  function populateSalesforceFields(formData) {
    // Map personal information
    document.getElementById('sf-first-name').value = formData['first-name-input'] || '';
    document.getElementById('sf-last-name').value = formData['last-name-input'] || '';
    document.getElementById('sf-email').value = formData['email-input'] || '';
    document.getElementById('sf-mobile').value = formData['phone-input'] || '';

    // Map loan information
    const loanAmount = (formData['loan-amount-input'] || '').replace(/[^0-9]/g, '');
    document.getElementById('sf-loan-amount').value = loanAmount;
    document.getElementById('sf-loan-purpose').value = formData['loan-purpose'] || '';

    // Map financial information - Convert credit score range to lowest number
    let creditScore = '';
    const creditScoreRange = formData['credit-score'] || '';
    if (creditScoreRange === '720-850') {
      creditScore = '720';
    } else if (creditScoreRange === '680-719') {
      creditScore = '680';
    } else if (creditScoreRange === '640-679') {
      creditScore = '640';
    } else if (creditScoreRange === '0-639') {
      creditScore = '600';
    }
    document.getElementById('sf-credit-score').value = creditScore;
    document.getElementById('sf-income').value = formData['income-input'] || '';
    document.getElementById('sf-debt').value = formData['debt-input'] || '';

    // Map employment information
    document.getElementById('sf-employment-structure').value = formData['employment-structure'] || '';
    document.getElementById('sf-payment-type').value = formData['payment-type'] || '';
    document.getElementById('sf-payment-duration').value = formData['payment-duration'] || '';

    // Map employer information (employed branch)
    document.getElementById('sf-employer-name').value = formData['employer-name-input'] || '';
    document.getElementById('sf-employer-type').value = formData['employer-type'] || '';

    // Map practice information (owner branch)
    document.getElementById('sf-business-years').value = formData['business-years-input'] || '';
    document.getElementById('sf-business-zip').value = formData['business-zip-input'] || '';
    document.getElementById('sf-physicians-count').value = formData['physicians-count-input'] || '';
    document.getElementById('sf-providers-count').value = formData['providers-count-input'] || '';
    document.getElementById('sf-affiliations').value = formData['affiliations'] || '';
    document.getElementById('sf-patient-volume').value = formData['patient-volume-input'] || '';

    // Map payer mix information
    document.getElementById('sf-payers-count').value = formData['payers-count-input'] || '';
    document.getElementById('sf-private-insurance').value = formData['payer-private-input'] || '';
    document.getElementById('sf-medicare').value = formData['payer-medicare-input'] || '';
    document.getElementById('sf-medicaid').value = formData['payer-medicaid-input'] || '';
    document.getElementById('sf-other-payer').value = formData['payer-other-input'] || '';

    // Map insurance types (join array with semicolons for multi-select)
    if (formData['insurance'] && Array.isArray(formData['insurance'])) {
      document.getElementById('sf-insurance-types').value = formData['insurance'].join(';');
    }

    // Map NPI and specialty
    document.getElementById('sf-npi').value = formData['npi-input'] || '';
    document.getElementById('sf-specialty').value = formData['specialty-input'] || '';
  }

  /* ==========================
     Submit button
  ========================== */
  const submitBtn = document.querySelector(".btn-submit");
  if (submitBtn) {
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent immediate form submission

      const formData = collectFormData();

      // Basic validation (this is now handled by the Continue button validation)
      // But we can keep it as a failsafe
      const emailInput = document.getElementById('email-input');
      const phoneInput = document.getElementById('phone-input');
      const consentInput = document.getElementById('consent-input');
      const contactStep = document.getElementById('step-contact');

      if (!emailInput.value || !phoneInput.value) {
        showValidationMessage(contactStep, "Please fill in all required fields.");
        return;
      }

      if (!consentInput.checked) {
        showValidationMessage(contactStep, "Please agree to the contact terms to continue.");
        return;
      }

      console.log("Form Data:", formData);
      console.log("Branch:", currentBranch);

      // Mark form as submitted to lock sidebar navigation
      formSubmitted = true;

      // Disable all sidebar pills (visual feedback)
      document.querySelectorAll(".section-pill").forEach(pill => {
        pill.style.cursor = 'not-allowed';
        pill.style.opacity = '0.6';
      });

      // Show loading screen
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'loading-screen';
      loadingDiv.innerHTML = `
        <div class="spinner"></div>
        <p>Submitting your application...</p>
      `;
      document.body.appendChild(loadingDiv);

      // Store form data in localStorage for retrieval on complete page
      try {
        localStorage.setItem('prequalFormData', JSON.stringify(formData));

        // Store loan amount with proper formatting
        const loanAmount = formData['loan-amount-input'] || '';
        const numericAmount = parseInt(loanAmount.replace(/[^0-9]/g, ''));
        if (!isNaN(numericAmount)) {
          localStorage.setItem('loan_amount', '$' + numericAmount.toLocaleString('en-US'));
        } else {
          localStorage.setItem('loan_amount', loanAmount);
        }

        localStorage.setItem('loan_purpose', formData['loan-purpose'] || '');
        localStorage.setItem('formSubmitted', 'true');
        console.log("Form data saved to localStorage");
      } catch (e) {
        console.error("Failed to save form data to localStorage:", e);
      }

      // Execute reCAPTCHA Enterprise and submit form
      grecaptcha.enterprise.ready(async function() {
        try {
          const token = await grecaptcha.enterprise.execute('6LdH30AsAAAAACFtYvyqfxw6BCw_ro_1K7oAFWsm', {action: 'submit'});

          // Add token to form
          document.getElementById('g-recaptcha-response').value = token;
          console.log('reCAPTCHA Enterprise token generated:', token);

          // Update timestamp in captcha_settings
          const captchaSettings = JSON.parse(document.querySelector('input[name="captcha_settings"]').value);
          captchaSettings.ts = JSON.stringify(new Date().getTime());
          document.querySelector('input[name="captcha_settings"]').value = JSON.stringify(captchaSettings);

          // Populate hidden Salesforce fields
          populateSalesforceFields(formData);

          // Submit form to hidden iframe so we can control redirect
          const iframe = document.createElement('iframe');
          iframe.name = 'salesforce-frame';
          iframe.style.display = 'none';
          document.body.appendChild(iframe);

          const form = document.getElementById('prequal-form');
          form.target = 'salesforce-frame';
          form.submit();

          // Wait for Salesforce submission, then redirect manually
          setTimeout(() => {
            window.location.href = '/complete/?submitted=true';
          }, 2000);

        } catch (error) {
          console.error('reCAPTCHA Enterprise error:', error);
          alert('There was an issue with reCAPTCHA. Please try again.');
        }
      });
    });
  }

  /* ==========================
     Populate Estimate Screen
  ========================== */
  function populateEstimate(formData) {
    // Loan amount
    const loanAmount = formData['loan-amount-input'] || '50,000';
    const cleanAmount = loanAmount.replace(/,/g, '');
    document.getElementById('estimate-loan-amount').textContent = formatCurrency(cleanAmount);

    // Loan purpose
    const loanPurpose = formData['loan-purpose'] || 'Not specified';
    document.getElementById('estimate-loan-purpose').textContent = loanPurpose;

    // Calculate payment (simplified formula)
    calculatePayment(parseFloat(cleanAmount), 54);
  }

  /* ==========================
     Payment Calculator
  ========================== */
  function calculatePayment(principal, months) {
    // Simplified interest rate assumption (8% annual)
    const annualRate = 0.08;
    const monthlyRate = annualRate / 12;

    // Monthly payment formula: P * [r(1+r)^n] / [(1+r)^n - 1]
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

    document.getElementById('estimate-payment-amount').textContent = formatCurrency(payment.toFixed(2));
  }

  /* ==========================
     Term Slider
  ========================== */
  const termSlider = document.getElementById('term-slider');
  const termDisplay = document.getElementById('term-display');

  if (termSlider && termDisplay) {
    termSlider.addEventListener('input', () => {
      const term = parseInt(termSlider.value);
      termDisplay.textContent = `${term} Months`;

      // Recalculate payment
      const loanAmountText = document.getElementById('estimate-loan-amount').textContent;
      const amount = parseFloat(loanAmountText.replace(/[$,]/g, ''));
      calculatePayment(amount, term);

      // Update CSS custom property for gradient fill
      const percent = ((term - 36) / (120 - 36)) * 100;
      termSlider.style.setProperty('--value', percent + '%');
    });

    // Initialize slider gradient
    const initialPercent = ((54 - 36) / (120 - 36)) * 100;
    termSlider.style.setProperty('--value', initialPercent + '%');
  }
});
