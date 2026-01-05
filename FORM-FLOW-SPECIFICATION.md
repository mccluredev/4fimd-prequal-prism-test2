# 4FiMD Pre-Qualification Form - Complete Flow Specification

## Overview
This document provides a comprehensive specification of how the 4FiMD pre-qualification form should function, based on the PDF design specifications (`Prequal 4FiMD Flow 3.0.pdf`).

---

## Layout Structure

### Two-Column Layout
- **Left Sidebar (30% width)**: Fixed, non-scrollable
  - Application Summary header
  - 5 section pills (navigation)
  - Progress dial at bottom
- **Right Content Area (70% width)**: Scrollable
  - One question visible at a time
  - Continue/Back buttons
  - Content should be vertically centered when possible

### Key Layout Rules
1. **No full-page scrolling** - Only the right content area scrolls
2. **Sidebar remains fixed** - Progress dial must always be visible at bottom
3. **One step visible at a time** - Never show multiple questions simultaneously
4. **Progressive disclosure** - Only show steps relevant to user's branch choice

---

## Section Structure

### 5 Core Sections (Sidebar Pills)
1. **Loan Information**
2. **Financial Information**
3. **Employment Information**
4. **Practice Information**
5. **Personal Information**

### Section Pill States
- **Inactive** (default): Light gray border (#ebebeb), muted text (#747474)
- **Active** (current section): Dark gray 2px border (#747474), muted text
- **Complete** (passed section): Teal 2px border (#2fcab2), light fill (#fafafa), primary text, clickable

---

## Complete Question Flow

### Universal Questions (All Users)

#### **LOAN INFORMATION** (Section 1)

**Step 1: Loan Amount** (step-loan-amount)
- Currency input with $ prefix
- Prefills from URL parameter `?amount=`
- Summary field: `summary-loan-amount`
- Progress: 0%

**Step 2: Loan Purpose** (step-loan-purpose)
- 6 pill options in 2-column grid:
  - Debt Refinance/Consolidation
  - Equipment Purchase
  - Practice Acquisition/Expansion
  - Start-up Practice
  - Working Capital
  - Other
- Summary field: `summary-loan-purpose`
- Progress: 10%

#### **FINANCIAL INFORMATION** (Section 2)

**Step 3: Credit Score** (step-credit-score)
- 4 pill options (single column):
  - 720 - 850
  - 680 - 719
  - 640 - 679
  - 0 - 639
- Summary field: `summary-credit-score`
- Progress: 20%

**Step 4: Monthly Income** (step-income)
- Range slider: $0 - $100K+
- Large value display above slider (e.g., "$40,000")
- Summary field: `summary-income`
- Progress: 25%

**Step 5: Monthly Debt** (step-debt)
- Range slider: $0 - $50K+
- Large value display above slider (e.g., "$12,000")
- Summary field: `summary-debt`
- Progress: 35%

**Step 6: Transition Screen** (step-transition)
- Text-only screen with motivational message
- "Thanks! You're almost done." / "Thanks! We'd like to learn a little more about you."
- No input required
- Progress: 40%

#### **EMPLOYMENT INFORMATION** (Section 3)

**Step 7: Employment Structure** (step-employment-structure) **[BRANCHING POINT]**
- 2 pill options (single column):
  - "I am employed by a practice or system" → EMPLOYED BRANCH
  - "I am an owner or partner in a practice" → OWNER BRANCH
- Summary field: `summary-employment`
- Progress: 40%
- **CRITICAL**: This determines which steps appear next
- **RULE**: If user changes selection after progressing, show confirmation dialog

---

### EMPLOYED BRANCH (If "employed by a practice or system")

**Step 8-E: Payment Structure** (step-compensation-employed) `.branch-employed`
- 2 sub-questions on same screen:
  - "What best describes your situation?"
    - W2
    - 1099
    - Both
  - "How long have you been paid like this?"
    - Less than one year
    - More than one year
    - More than two years
- Progress: 50%

**Step 9-E: Employer Information** (step-employer-employed) `.branch-employed`
- Text input: "What's your employer's name?"
- 3 pill options: "What best describes your employer?"
  - For-profit
  - Non-profit
  - Public
- Progress: 60%

**Step 10-E: Insurance** (step-insurance) `.branch-employed`
- Checkbox group (select all that apply):
  - Life
  - Disability
  - Malpractice
- "SELECT ALL" helper text
- Summary field: `summary-insurance`
- Progress: 80%
- Back button should route to: `step-employer-employed`

---

### OWNER BRANCH (If "owner or partner in a practice")

**Step 8-O: Practice Basics** (step-practice-basics) `.branch-owner`
- 4 number inputs:
  - "How long has it been in business?"
  - "What is your business zip code?"
  - "How many physicians are in the practice?"
  - "How many providers are in the practice?"
- Progress: 60%

**Step 9-O: System Affiliations** (step-affiliations) `.branch-owner`
- 2 pill options:
  - Yes
  - No
- Question: "Do you have any system affiliations or partnerships?"
- Progress: 65%

**Step 10-O: Patient Volume** (step-patient-volume) `.branch-owner`
- Number input: "What's the estimated monthly patient volume for the practice?"
- Progress: 70%

**Step 11-O: Payer Mix** (step-payer-mix) `.branch-owner`
- Text input: "How many payers is your practice working with?"
- 4 percentage inputs (must total 100%):
  - Private %
  - Medicare %
  - Medicaid %
  - Other %
- Progress: 75%

**Step 12-O: Insurance** (step-insurance) `.branch-owner`
- Checkbox group (select all that apply):
  - Life
  - Disability
  - Malpractice
- Summary field: `summary-insurance`
- Progress: 80%
- Back button should route to: `step-payer-mix`

---

### Universal Questions (Continued - All Users)

#### **PERSONAL INFORMATION** (Section 5)

**Step 11/13: Personal Details** (step-personal-info)
- 4 text inputs:
  - First Name
  - Last Name
  - NPI Number (10 digits max)
  - Medical Specialty (dropdown)
- Disclaimer text about data privacy
- Progress: 85%

**Step 12/14: Contact Information** (step-contact)
- 2 text inputs:
  - Email
  - Phone Number (auto-formatted: (XXX) XXX-XXXX)
- Checkbox: Consent to contact
- Submit button: "See Payment Estimate"
- Progress: 95%

**Step 13/15: Payment Estimate** (step-estimate)
- Display requested loan amount
- Display loan purpose
- Large payment amount (e.g., "$1,304.56")
- Interactive term slider (36-120 months)
- Recalculates payment when slider moves
- "Next Steps" section with thank you message
- Progress: 100%

---

## Progress Dial Behavior

### Calculation
- Progress = ((currentStepIndex + 1) / totalVisibleSteps) × 100
- Rounded to nearest whole percentage
- Total steps vary by branch:
  - Employed path: ~13 steps
  - Owner path: ~15 steps

### Visual Specs
- Semi-circle arc (not full circle)
- 280px width × 140px height
- 16px stroke width
- Teal fill (#2fcab2) as progress increases
- Large percentage text at bottom (80px font)

---

## Navigation Rules

### Continue Button Behavior
1. **Always disabled until valid input** provided
2. Moves to next step via `data-next` attribute
3. Updates `currentIndex` and `furthestIndex`
4. Triggers progress dial update
5. Triggers sidebar pill state update

### Back Button Behavior
1. Moves to previous step via `data-prev` attribute
2. **Branch-aware routing**:
   - Insurance step back button checks `currentBranch`
   - Routes to `step-employer-employed` if employed
   - Routes to `step-payer-mix` if owner
3. Does NOT clear user's answers

### Sidebar Pill Click Behavior
1. **Only clickable if Active or Complete** (not inactive/gray)
2. Clicking navigates to first step of that section
3. **Preserves all user input**
4. Updates current step indicator

---

## Branch Management Logic

### Initial State
- All `.branch-employed` steps: `display: none`
- All `.branch-owner` steps: `display: none`
- No branch selected: `currentBranch = null`

### When User Selects Branch
1. Set `currentBranch` to 'employed' or 'owner'
2. Show all steps with matching class (`.branch-employed` or `.branch-owner`)
3. Hide all steps with opposite class
4. Update Continue button `data-next` attribute:
   - Employed → `step-compensation-employed`
   - Owner → `step-practice-basics`

### When User Changes Branch (After Progression)
1. **Check if progressed beyond employment structure step**
2. If yes: Show confirmation dialog
   - "Are you sure you want to change your employment structure? All answers from this point forward will be removed and you'll need to start again from this step."
3. If user confirms:
   - Clear all input values in OLD branch steps
   - Reset `currentIndex` and `furthestIndex` to employment structure step
   - Show new branch steps
   - Hide old branch steps
4. If user cancels:
   - Revert radio selection to `currentBranch`
   - No changes made

---

## Summary Field Updates

### Real-time Updates
- As user interacts with inputs, summary fields in sidebar update
- Currency values formatted: `$50,000`
- Radio selections: Show selected value text
- Checkboxes: Join selected values with ", "
- Sliders: Show formatted value (e.g., "$40,000" or "$100K+")

### Summary Field IDs
- `summary-loan-amount`
- `summary-loan-purpose`
- `summary-credit-score`
- `summary-income`
- `summary-debt`
- `summary-employment`
- `summary-insurance`

---

## Critical Issues Identified (From Screenshot)

### Issue 1: Multiple Steps Visible
- **Problem**: Multiple questions showing at once (transition screen + payment structure + employer questions)
- **Expected**: Only ONE step visible at a time
- **Root Cause**: `.step.active` logic not working correctly; multiple steps have `active` class

### Issue 2: Progress Dial Cut Off
- **Problem**: Bottom of progress dial not visible
- **Expected**: Full semi-circle visible with percentage text at bottom
- **Root Cause**: Sidebar height calculation or overflow settings

### Issue 3: Sidebar Pills Not Updating
- **Problem**: Pills don't change state after employment structure
- **Expected**:
  - "Loan Information" and "Financial Information" should be COMPLETE (teal border, light fill)
  - "Employment Information" should be ACTIVE (dark border)
  - "Practice Information" and "Personal Information" should be INACTIVE (gray)
- **Root Cause**: `updateSidebar()` function not correctly calculating section states based on `currentIndex`

### Issue 4: Branch Steps All Showing
- **Problem**: All branch-specific steps visible simultaneously
- **Expected**: Only steps for selected branch should have `display: block`
- **Root Cause**: `setBranch()` not being called, or display property being overridden

---

## Step Visibility Logic (How It Should Work)

### Initial Page Load
```javascript
// All steps hidden
allSteps.forEach(step => step.classList.remove('active'));

// Only first step visible
document.getElementById('step-loan-amount').classList.add('active');
currentIndex = 0;
```

### On Continue Click
```javascript
// Hide current step
visibleSteps[currentIndex].classList.remove('active');

// Show next step
const nextStepId = button.dataset.next;
const nextStep = document.getElementById(nextStepId);
nextStep.classList.add('active');

// Update indices
currentIndex = visibleSteps.indexOf(nextStep);
furthestIndex = Math.max(furthestIndex, currentIndex);

// Update UI
updateSidebar();
updateProgress();
```

### Branch Selection Impact
```javascript
// When branch selected, recalculate visible steps
function getVisibleSteps() {
  return allSteps.filter(step => {
    // Check if step is displayed (not branch-hidden)
    const style = window.getComputedStyle(step);
    return style.display !== 'none';
  });
}

// This list changes when branch is selected
// BEFORE selection: ~7 steps visible (universal questions only)
// AFTER "employed": ~13 steps visible (universal + employed branch)
// AFTER "owner": ~15 steps visible (universal + owner branch)
```

---

## Testing Checklist

### Visual Tests
- [ ] Only one step visible at a time
- [ ] Sidebar pills show correct states (inactive/active/complete)
- [ ] Progress dial fully visible (not cut off)
- [ ] Progress percentage updates correctly
- [ ] Slider values display large above slider
- [ ] Pill buttons have correct hover/selected states

### Navigation Tests
- [ ] Continue button moves to next step
- [ ] Back button moves to previous step
- [ ] Sidebar pill clicks work (only on active/complete)
- [ ] Branch-aware back button routes correctly

### Branch Logic Tests
- [ ] Selecting "employed" shows only employed steps
- [ ] Selecting "owner" shows only owner steps
- [ ] Changing branch shows confirmation dialog
- [ ] Changing branch clears old branch data
- [ ] Branch steps hidden until selection made

### Data Persistence Tests
- [ ] Navigating back preserves answers
- [ ] Clicking sidebar pills preserves answers
- [ ] Only branch change clears data

---

## Expected Visual State (Step-by-Step)

### At Employment Structure Question (40% progress)
**Sidebar Pills:**
- Loan Information: COMPLETE ✓ (teal border, light fill, clickable)
- Financial Information: COMPLETE ✓ (teal border, light fill, clickable)
- Employment Information: ACTIVE (dark border, current)
- Practice Information: INACTIVE (gray, not clickable)
- Personal Information: INACTIVE (gray, not clickable)

**Progress Dial:** 40% filled (teal arc ~40% of semi-circle)

**Content Area:** Only employment structure question visible

### After Selecting "Employed" → Payment Structure (50% progress)
**Sidebar Pills:**
- Loan Information: COMPLETE ✓
- Financial Information: COMPLETE ✓
- Employment Information: ACTIVE (still active, within section)
- Practice Information: INACTIVE (gray) ← Should remain gray/hidden
- Personal Information: INACTIVE (gray)

**Progress Dial:** 50% filled

**Content Area:** Only payment structure question visible (W2/1099 + duration)

### At Insurance Question - Employed Path (80% progress)
**Sidebar Pills:**
- Loan Information: COMPLETE ✓
- Financial Information: COMPLETE ✓
- Employment Information: COMPLETE ✓
- Practice Information: COMPLETE ✓ (even though no practice questions in employed path)
- Personal Information: ACTIVE

**Progress Dial:** 80% filled

---

## File Structure

### HTML Steps (step-* IDs)
- step-loan-amount
- step-loan-purpose
- step-credit-score
- step-income
- step-debt
- step-transition
- step-employment-structure
- step-compensation-employed `.branch-employed`
- step-employer-employed `.branch-employed`
- step-practice-basics `.branch-owner`
- step-affiliations `.branch-owner`
- step-patient-volume `.branch-owner`
- step-payer-mix `.branch-owner`
- step-insurance (universal, but routing differs)
- step-personal-info
- step-contact
- step-estimate

### CSS Classes
- `.step` - All step containers
- `.step.active` - Currently visible step
- `.branch-employed` - Employed-only steps
- `.branch-owner` - Owner-only steps
- `.section-pill` - Sidebar navigation pills
- `.section-pill.active` - Current section
- `.section-pill.complete` - Completed section

---

## Implementation Priority

### Critical Fixes (P0)
1. **Fix step visibility** - Only one `.step.active` at a time
2. **Fix sidebar overflow** - Show full progress dial
3. **Fix branch logic** - Hide/show correct steps based on selection
4. **Fix pill state updates** - Correct active/complete states

### Important Fixes (P1)
5. Fix progress calculation for branch-specific paths
6. Implement branch-aware back button routing
7. Add confirmation dialog for branch changes

### Nice-to-Have (P2)
8. Smooth transitions between steps
9. Form validation before Continue enabled
10. Summary field real-time updates

---

## Questions for Clarification

1. **Practice Information section for employed users**:
   - Should this section pill exist for employed users?
   - Or should it be hidden/skipped entirely?
   - Current behavior: Shows as inactive but never becomes active

2. **Insurance step section assignment**:
   - PDF shows it at 80% in both flows
   - Which section does it belong to?
   - Currently: No data-section attribute specified

3. **Estimate screen**:
   - Is this part of "Personal Information" section?
   - Or standalone final screen?
   - Should it show in sidebar navigation?
