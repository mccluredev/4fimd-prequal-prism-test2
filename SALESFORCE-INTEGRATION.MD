<!--  ----------------------------------------------------------------------  -->
<!--  NOTE: Please add the following <META> element to your page <HEAD>.      -->
<!--  If necessary, please modify the charset parameter to specify the        -->
<!--  character set of your HTML page.                                        -->
<!--  ----------------------------------------------------------------------  -->

<META HTTP-EQUIV="Content-type" CONTENT="text/html; charset=UTF-8">
<script src="https://www.google.com/recaptcha/api.js"></script>
<script>
 function timestamp() { var response = document.getElementById("g-recaptcha-response"); if (response == null || response.value.trim() == "") {var elems = JSON.parse(document.getElementsByName("captcha_settings")[0].value);elems["ts"] = JSON.stringify(new Date().getTime());document.getElementsByName("captcha_settings")[0].value = JSON.stringify(elems); } } setInterval(timestamp, 500); 
</script>

<!--  ----------------------------------------------------------------------  -->
<!--  NOTE: Please add the following <FORM> element to your page.             -->
<!--  ----------------------------------------------------------------------  -->

<form action="https://test.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00DQL00000F5hdB" method="POST">

<input type=hidden name='captcha_settings' value='{"keyname":"PrequalReCaptchaV3","fallback":"true","orgId":"00DQL00000F5hdB","ts":""}'>
<input type=hidden name="oid" value="00DQL00000F5hdB">
<input type=hidden name="retURL" value="http://4fimd.com">

<!--  ----------------------------------------------------------------------  -->
<!--  NOTE: These fields are optional debugging elements. Please uncomment    -->
<!--  these lines if you wish to test in debug mode.                          -->
<!--  <input type="hidden" name="debug" value=1>                              -->
<!--  <input type="hidden" name="debugEmail" value="lewis.m@4fimd.com">       -->
<!--  ----------------------------------------------------------------------  -->

<label for="first_name">First Name</label><input  id="first_name" maxlength="40" name="first_name" size="20" type="text" /><br>

<label for="last_name">Last Name</label><input  id="last_name" maxlength="80" name="last_name" size="20" type="text" /><br>

<label for="email">Email</label><input  id="email" maxlength="80" name="email" size="20" type="text" /><br>

<label for="mobile">Mobile</label><input  id="mobile" maxlength="40" name="mobile" size="20" type="text" /><br>

Loan Amount:<input  id="00NHs00000lzslH" name="00NHs00000lzslH" size="20" type="text" /><br>

Area of Expertise:<select  id="00NHs00000lzslR" name="00NHs00000lzslR" title="Area of Expertise"><option value="">--None--</option><option value="Acupuncturist (LAc, DAOM)">Acupuncturist (LAc, DAOM)</option>
<option value="Advanced Practicing Registered Nurse (APRN)">Advanced Practicing Registered Nurse (APRN)</option>
<option value="Advanced Registered Nurse Practitioner (ARNP, NP)">Advanced Registered Nurse Practitioner (ARNP, NP)</option>
<option value="Certified Registered Nurse Anesthetist (CRNA)">Certified Registered Nurse Anesthetist (CRNA)</option>
<option value="Chiropractor (DC)">Chiropractor (DC)</option>
<option value="Dental Hygienist (RDH)">Dental Hygienist (RDH)</option>
<option value="Dentist (DDS, DMD)">Dentist (DDS, DMD)</option>
<option value="Doctor of Physical Therapy (DPT)">Doctor of Physical Therapy (DPT)</option>
<option value="Healthcare Administrator (MBA, MHA, FACHE)">Healthcare Administrator (MBA, MHA, FACHE)</option>
<option value="Home Health Aide (HHA, PCA, CNA)">Home Health Aide (HHA, PCA, CNA)</option>
<option value="Licensed Practical Nurse (LPN, LVN)">Licensed Practical Nurse (LPN, LVN)</option>
<option value="Medical Assistant (CMA, RMA, CCMA)">Medical Assistant (CMA, RMA, CCMA)</option>
<option value="Medical Laboratory Scientist (MLS, MT, CLS)">Medical Laboratory Scientist (MLS, MT, CLS)</option>
<option value="Mental Health Counselor (LPC, LMHC, NCC)">Mental Health Counselor (LPC, LMHC, NCC)</option>
<option value="Naturopathic Doctor (ND, NMD)">Naturopathic Doctor (ND, NMD)</option>
<option value="Occupational Therapist (OTR, OTD)">Occupational Therapist (OTR, OTD)</option>
<option value="Optometrist (OD)">Optometrist (OD)</option>
<option value="Osteopath (DO)">Osteopath (DO)</option>
<option value="Other">Other</option>
<option value="Paramedic (EMT-P, NRP)">Paramedic (EMT-P, NRP)</option>
<option value="Pharmacist (PharmD, RPh)">Pharmacist (PharmD, RPh)</option>
<option value="Physical Therapist (PT, DPT)">Physical Therapist (PT, DPT)</option>
<option value="Physician/Surgeon (MD, DO)">Physician/Surgeon (MD, DO)</option>
<option value="Physician Assistant (PA, PA-C)">Physician Assistant (PA, PA-C)</option>
<option value="Podiatrist (DPM)">Podiatrist (DPM)</option>
<option value="Psychologist (PhD, PsyD, EdD)">Psychologist (PhD, PsyD, EdD)</option>
<option value="Radiologic Technologist (RT, ARRT)">Radiologic Technologist (RT, ARRT)</option>
<option value="Registered Nurse (RN)">Registered Nurse (RN)</option>
<option value="Respiratory Therapist (RRT, CRT)">Respiratory Therapist (RRT, CRT)</option>
<option value="Social Worker (LCSW, MSW, LICSW)">Social Worker (LCSW, MSW, LICSW)</option>
<option value="Speech-Language Pathologist (SLP, CCC-SLP)">Speech-Language Pathologist (SLP, CCC-SLP)</option>
<option value="Surgical Technologist (CST, CRCST)">Surgical Technologist (CST, CRCST)</option>
<option value="Veterinarian (DVM)">Veterinarian (DVM)</option>
<option value="Veterinary Technician (RVT, LVT, CVT)">Veterinary Technician (RVT, LVT, CVT)</option>
<option value="Acupuncturist">Acupuncturist</option>
<option value="Advanced Practising RN">Advanced Practising RN</option>
<option value="Advanced Registered NP">Advanced Registered NP</option>
<option value="Certified Registered Nurse Anaesthetist">Certified Registered Nurse Anaesthetist</option>
<option value="Chiropractor">Chiropractor</option>
<option value="Dental Hygienist">Dental Hygienist</option>
<option value="Dentist">Dentist</option>
<option value="Doctor of Physical Therapy">Doctor of Physical Therapy</option>
<option value="Licensed Practical Nurse">Licensed Practical Nurse</option>
<option value="Naturopathic">Naturopathic</option>
<option value="Occupational Therapist">Occupational Therapist</option>
<option value="Optometrist">Optometrist</option>
<option value="Osteopath">Osteopath</option>
<option value="Pharmacist">Pharmacist</option>
<option value="Physical Therapist">Physical Therapist</option>
<option value="Physician/Surgeon">Physician/Surgeon</option>
<option value="Physician Assistant">Physician Assistant</option>
<option value="Podiatrist">Podiatrist</option>
<option value="Psychologist">Psychologist</option>
<option value="Registered Nurse">Registered Nurse</option>
<option value="Speech-Language Pathologist">Speech-Language Pathologist</option>
<option value="Veterinarian">Veterinarian</option>
<option value="Other / Healthcare, Other">Other / Healthcare, Other</option>
</select><br>

Estimated Credit Score:<input  id="00NHs00000m08cg" name="00NHs00000m08cg" size="20" type="text" /><br>

Estimated Monthly Income:<input  id="00NHs00000m08cl" name="00NHs00000m08cl" size="20" type="text" /><br>

Estimated Monthly Debt:<input  id="00NHs00000m08cq" name="00NHs00000m08cq" size="20" type="text" /><br>

Time in Business:<input  id="00NHs00000m08cv" name="00NHs00000m08cv" size="20" type="text" /><br>

Loan Purpose:<select  id="00NHs00000scaqg" name="00NHs00000scaqg" title="Loan Purpose"><option value="">--None--</option><option value="Emergency loan (ER Loan)">Emergency loan (ER Loan)</option>
<option value="Equipment Purchase">Equipment Purchase</option>
<option value="Other">Other</option>
<option value="Practice Acquisition">Practice Acquisition</option>
<option value="Practice Buyout">Practice Buyout</option>
<option value="Practice Expansion">Practice Expansion</option>
<option value="Start up practice">Start up practice</option>
<option value="Working Capital">Working Capital</option>
<option value="Debt Refinance/Consolidation">Debt Refinance/Consolidation</option>
<option value="Practice Acquisition/Expansion">Practice Acquisition/Expansion</option>
<option value="Start-up Practice">Start-up Practice</option>
</select><br>

Business Zip Code:<input  id="00NHs00000sduCM" maxlength="5" name="00NHs00000sduCM" size="20" type="text" /><br>

Employment Structure:<select  id="00NQL00000m27g5" name="00NQL00000m27g5" title="Employment Structure"><option value="">--None--</option><option value="Employed">Employed</option>
<option value="Owner">Owner</option>
</select><br>

Payment Type:<select  id="00NQL00000m2Ckb" name="00NQL00000m2Ckb" title="Payment Type"><option value="">--None--</option><option value="W2">W2</option>
<option value="1099">1099</option>
<option value="Both">Both</option>
</select><br>

Payment Duration:<select  id="00NQL00000mBFqb" name="00NQL00000mBFqb" title="Payment Duration"><option value="">--None--</option><option value="Less than one year">Less than one year</option>
<option value="More than one year">More than one year</option>
<option value="More than two years">More than two years</option>
</select><br>

Employer Name:<textarea  id="00NQL00000mBLez" name="00NQL00000mBLez" type="text" wrap="soft"></textarea><br>

Employer Type:<select  id="00NQL00000mBLjp" name="00NQL00000mBLjp" title="Employer Type"><option value="">--None--</option><option value="For-profit">For-profit</option>
<option value="Non-profit">Non-profit</option>
<option value="Public">Public</option>
</select><br>

Number of Physicians:<input  id="00NQL00000mBLtV" name="00NQL00000mBLtV" size="20" type="text" /><br>

Number of Providers:<input  id="00NQL00000mBLwj" name="00NQL00000mBLwj" size="20" type="text" /><br>

Hospital Affililation:<select  id="00NQL00000mBHEz" name="00NQL00000mBHEz" title="Hospital Affililation"><option value="">--None--</option><option value="Yes">Yes</option>
<option value="No">No</option>
</select><br>

Monthly Patient Volume:<input  id="00NQL00000mBMPl" name="00NQL00000mBMPl" size="20" type="text" /><br>

Number of Payers:<input  id="00NQL00000mBMRN" name="00NQL00000mBMRN" size="20" type="text" /><br>

Private Insurance Percentage:<input  id="00NQL00000mBMb3" name="00NQL00000mBMb3" size="20" type="text" /><br>

Medicare Percentage:<input  id="00NQL00000mBMeH" name="00NQL00000mBMeH" size="20" type="text" /><br>

Medicaid Percentage:<input  id="00NQL00000mBMhV" name="00NQL00000mBMhV" size="20" type="text" /><br>

Other Payer Percentage:<input  id="00NQL00000mBMj7" name="00NQL00000mBMj7" size="20" type="text" /><br>

Insurance Types:<select  id="00NQL00000mBMmL" multiple="multiple" name="00NQL00000mBMmL" title="Insurance Types"><option value="Life">Life</option>
<option value="Disability">Disability</option>
<option value="Malpractice">Malpractice</option>
</select><br>

NPI Number:<input  id="00NQL00000mBMpZ" name="00NQL00000mBMpZ" size="20" type="text" /><br>

<div class="g-recaptcha" data-sitekey="6LdH30AsAAAAACFtYvyqfxw6BCw_ro_1K7oAFWsm"></div><br>
<input type="submit" name="submit">

</form>
