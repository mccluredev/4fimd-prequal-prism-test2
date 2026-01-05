# Salesforce Field Mapping for 4FiMD Pre-Qualification Form

## Recommended Salesforce Object
**Lead** or **Custom Object: Pre_Qualification_Application__c**

---

## Section 1: Loan Information

### Field: Requested Loan Amount
- **Form Field ID:** `loan-amount-input`
- **Field Type:** Currency
- **Salesforce Field Name:** `Requested_Loan_Amount__c`
- **Salesforce Field Type:** Currency(16,2)
- **Required:** Yes
- **Example Value:** $50,000

### Field: Loan Purpose
- **Form Field ID:** `loan-purpose` (radio button group)
- **Field Type:** Picklist (Single Select)
- **Salesforce Field Name:** `Loan_Purpose__c`
- **Salesforce Field Type:** Picklist
- **Required:** Yes
- **Picklist Values:**
  - Debt Refinance/Consolidation
  - Equipment Purchase
  - Practice Acquisition/Expansion
  - Start-up Practice
  - Working Capital
  - Other

---

## Section 2: Financial Information

### Field: Credit Score Range
- **Form Field ID:** `credit-score` (radio button group)
- **Field Type:** Picklist (Single Select)
- **Salesforce Field Name:** `Credit_Score_Range__c`
- **Salesforce Field Type:** Picklist
- **Required:** Yes
- **Picklist Values:**
  - 720-850
  - 680-719
  - 640-679
  - 0-639

### Field: Annual Income
- **Form Field ID:** `income-input` (range slider)
- **Field Type:** Currency
- **Salesforce Field Name:** `Annual_Income__c`
- **Salesforce Field Type:** Currency(16,2)
- **Required:** Yes
- **Range:** $0 - $100,000+
- **Note:** Values at max (100000) represent "$100K+"

### Field: Total Debt
- **Form Field ID:** `debt-input` (range slider)
- **Field Type:** Currency
- **Salesforce Field Name:** `Total_Debt__c`
- **Salesforce Field Type:** Currency(16,2)
- **Required:** Yes
- **Range:** $0 - $50,000+
- **Note:** Values at max (50000) represent "$50K+"

---

## Section 3: Employment Information

### Field: Employment Structure
- **Form Field ID:** `employment-structure` (radio button group)
- **Field Type:** Picklist (Single Select)
- **Salesforce Field Name:** `Employment_Structure__c`
- **Salesforce Field Type:** Picklist
- **Required:** Yes
- **Picklist Values:**
  - Employed
  - Owner
- **Note:** This field determines which branch of questions follows

---

## Section 3a: Employed Branch Fields

### Field: Payment Type
- **Form Field ID:** `payment-type` (radio button group)
- **Field Type:** Picklist (Single Select)
- **Salesforce Field Name:** `Payment_Type__c`
- **Salesforce Field Type:** Picklist
- **Required:** Yes (if employed)
- **Picklist Values:**
  - W2
  - 1099
  - Both

### Field: Payment Duration
- **Form Field ID:** `payment-duration` (radio button group)
- **Field Type:** Picklist (Single Select)
- **Salesforce Field Name:** `Payment_Duration__c`
- **Salesforce Field Type:** Picklist
- **Required:** Yes (if employed)
- **Picklist Values:**
  - Less than one year
  - More than one year
  - More than two years

### Field: Employer Name
- **Form Field ID:** `employer-name-input`
- **Field Type:** Text
- **Salesforce Field Name:** `Employer_Name__c`
- **Salesforce Field Type:** Text(255)
- **Required:** Yes (if employed)

### Field: Employer Type
- **Form Field ID:** `employer-type` (radio button group)
- **Field Type:** Picklist (Single Select)
- **Salesforce Field Name:** `Employer_Type__c`
- **Salesforce Field Type:** Picklist
- **Required:** No
- **Picklist Values:**
  - For-profit
  - Non-profit
  - Public

---

## Section 3b: Practice Owner Branch Fields

### Field: Business Years in Operation
- **Form Field ID:** `business-years-input`
- **Field Type:** Text
- **Salesforce Field Name:** `Business_Years_In_Operation__c`
- **Salesforce Field Type:** Text(50)
- **Required:** No
- **Example:** "5 years"

### Field: Business Zip Code
- **Form Field ID:** `business-zip-input`
- **Field Type:** Text
- **Salesforce Field Name:** `Business_Zip_Code__c`
- **Salesforce Field Type:** Text(10)
- **Required:** No
- **Example:** "12345"

### Field: Number of Physicians
- **Form Field ID:** `physicians-count-input`
- **Field Type:** Number
- **Salesforce Field Name:** `Number_of_Physicians__c`
- **Salesforce Field Type:** Number(18,0)
- **Required:** Yes (if owner)

### Field: Number of Providers
- **Form Field ID:** `providers-count-input`
- **Field Type:** Number
- **Salesforce Field Name:** `Number_of_Providers__c`
- **Salesforce Field Type:** Number(18,0)
- **Required:** Yes (if owner)

### Field: Hospital Affiliations
- **Form Field ID:** `affiliations` (radio button group)
- **Field Type:** Picklist (Single Select)
- **Salesforce Field Name:** `Hospital_Affiliations__c`
- **Salesforce Field Type:** Picklist
- **Required:** No
- **Picklist Values:**
  - Yes
  - No

### Field: Monthly Patient Volume
- **Form Field ID:** `patient-volume-input`
- **Field Type:** Number
- **Salesforce Field Name:** `Monthly_Patient_Volume__c`
- **Salesforce Field Type:** Number(18,0)
- **Required:** Yes (if owner)

### Field: Number of Payers
- **Form Field ID:** `payers-count-input`
- **Field Type:** Number
- **Salesforce Field Name:** `Number_of_Payers__c`
- **Salesforce Field Type:** Number(18,0)
- **Required:** Yes (if owner)

### Field: Private Insurance Percentage
- **Form Field ID:** `payer-private-input`
- **Field Type:** Percent
- **Salesforce Field Name:** `Private_Insurance_Percentage__c`
- **Salesforce Field Type:** Percent(5,2)
- **Required:** Yes (if owner)
- **Validation:** Must sum to 100% with other payer percentages

### Field: Medicare Percentage
- **Form Field ID:** `payer-medicare-input`
- **Field Type:** Percent
- **Salesforce Field Name:** `Medicare_Percentage__c`
- **Salesforce Field Type:** Percent(5,2)
- **Required:** Yes (if owner)
- **Validation:** Must sum to 100% with other payer percentages

### Field: Medicaid Percentage
- **Form Field ID:** `payer-medicaid-input`
- **Field Type:** Percent
- **Salesforce Field Name:** `Medicaid_Percentage__c`
- **Salesforce Field Type:** Percent(5,2)
- **Required:** Yes (if owner)
- **Validation:** Must sum to 100% with other payer percentages

### Field: Other Payer Percentage
- **Form Field ID:** `payer-other-input`
- **Field Type:** Percent
- **Salesforce Field Name:** `Other_Payer_Percentage__c`
- **Salesforce Field Type:** Percent(5,2)
- **Required:** Yes (if owner)
- **Validation:** Must sum to 100% with other payer percentages

---

## Section 4: Insurance Information

### Field: Insurance Types
- **Form Field ID:** `insurance` (checkbox group)
- **Field Type:** Multi-Select Picklist
- **Salesforce Field Name:** `Insurance_Types__c`
- **Salesforce Field Type:** Multi-Select Picklist
- **Required:** No
- **Picklist Values:**
  - Life
  - Disability
  - Malpractice
- **Note:** Multiple selections allowed, stored as semicolon-separated values

---

## Section 5: Personal Information

### Field: First Name
- **Form Field ID:** `first-name-input`
- **Field Type:** Text
- **Salesforce Field Name:** `FirstName` (Standard) or `First_Name__c`
- **Salesforce Field Type:** Text(40)
- **Required:** Yes

### Field: Last Name
- **Form Field ID:** `last-name-input`
- **Field Type:** Text
- **Salesforce Field Name:** `LastName` (Standard) or `Last_Name__c`
- **Salesforce Field Type:** Text(80)
- **Required:** Yes

### Field: NPI Number
- **Form Field ID:** `npi-input`
- **Field Type:** Text
- **Salesforce Field Name:** `NPI_Number__c`
- **Salesforce Field Type:** Text(10)
- **Required:** Yes
- **Validation:** 10-digit number

### Field: Medical Specialty
- **Form Field ID:** `specialty-input`
- **Field Type:** Picklist (Single Select)
- **Salesforce Field Name:** `Medical_Specialty__c`
- **Salesforce Field Type:** Picklist
- **Required:** Yes
- **Picklist Values:**
  - Family Medicine
  - Internal Medicine
  - Pediatrics
  - Surgery
  - Psychiatry
  - Anesthesiology
  - Emergency Medicine
  - Other

---

## Section 6: Contact Information

### Field: Email
- **Form Field ID:** `email-input`
- **Field Type:** Email
- **Salesforce Field Name:** `Email` (Standard) or `Email__c`
- **Salesforce Field Type:** Email
- **Required:** Yes
- **Validation:** Valid email format

### Field: Phone Number
- **Form Field ID:** `phone-input`
- **Field Type:** Phone
- **Salesforce Field Name:** `Phone` (Standard) or `Phone__c`
- **Salesforce Field Type:** Phone
- **Required:** Yes
- **Note:** Formatted as (XXX) XXX-XXXX

### Field: Contact Consent
- **Form Field ID:** `consent-input`
- **Field Type:** Checkbox
- **Salesforce Field Name:** `Contact_Consent__c`
- **Salesforce Field Type:** Checkbox
- **Required:** Yes
- **Default Value:** false

---

## Additional Metadata Fields (Recommended)

### Field: Application Branch
- **Salesforce Field Name:** `Application_Branch__c`
- **Salesforce Field Type:** Picklist
- **Values:** Employed, Owner
- **Note:** Tracks which branch of the form was completed

### Field: Application Completion Date
- **Salesforce Field Name:** `Application_Completion_Date__c`
- **Salesforce Field Type:** DateTime
- **Auto-populated:** Yes

### Field: Estimated Monthly Payment
- **Salesforce Field Name:** `Estimated_Monthly_Payment__c`
- **Salesforce Field Type:** Currency(16,2)
- **Note:** Calculated value shown on estimate screen

### Field: Selected Loan Term (Months)
- **Salesforce Field Name:** `Selected_Loan_Term_Months__c`
- **Salesforce Field Type:** Number(18,0)
- **Range:** 36-120
- **Default:** 54

### Field: Form Version
- **Salesforce Field Name:** `Form_Version__c`
- **Salesforce Field Type:** Text(20)
- **Note:** Track which version of the form was used

### Field: Lead Source
- **Salesforce Field Name:** `LeadSource` (Standard)
- **Salesforce Field Type:** Picklist
- **Default Value:** "Web Form - Pre-Qualification"

---

## Validation Rules to Create in Salesforce

1. **Payer Percentage Total Validation**
   - Rule: `Private_Insurance_Percentage__c + Medicare_Percentage__c + Medicaid_Percentage__c + Other_Payer_Percentage__c = 100`
   - Error Message: "Payer percentages must total 100%"

2. **NPI Number Format**
   - Rule: `LEN(NPI_Number__c) = 10 AND ISNUMBER(NPI_Number__c)`
   - Error Message: "NPI Number must be exactly 10 digits"

3. **Branch Field Requirements**
   - If `Application_Branch__c = "Employed"`: Require employer fields
   - If `Application_Branch__c = "Owner"`: Require practice owner fields

---

## Object Relationships (If using Custom Object)

### Related To
- **Account** (if employer/practice already exists)
- **Contact** (create Contact record from personal info)
- **Opportunity** (convert to Opportunity if qualified)

---

## Field-Level Security Recommendations

- All fields should be visible to Sales, Finance, and Admin profiles
- Contact Consent field should be read-only after submission
- NPI Number should be encrypted if handling PHI

---

## Page Layout Recommendations

### Page Layout Sections:
1. **Loan Information**
2. **Financial Information**
3. **Employment Information**
4. **Practice Information** (conditional visibility)
5. **Personal Information**
6. **Contact Information**
7. **Insurance Information**
8. **System Information** (metadata fields)

---

## Notes for Implementation

1. Use **Lead** object if you want to use standard Salesforce Lead-to-Opportunity conversion
2. Use **Custom Object** if you need more control over the qualification workflow
3. Consider creating a **Process Builder** or **Flow** to:
   - Auto-assign leads based on loan amount or specialty
   - Send confirmation emails
   - Create tasks for follow-up
4. Set up **duplicate rules** to prevent duplicate submissions based on Email + NPI Number
5. Consider **field history tracking** for audit purposes
