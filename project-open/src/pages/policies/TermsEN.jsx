import "../../styles/main.sass"
import "../../styles/styles.sass"
import "../../styles/pages/Policies.sass"
import Header2 from "../../components/Header2";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet";

const TermsPoliciesEN = () => {
  const { t } = useTranslation();

  return (
      <aside id="Policies" className="Container NoMenu">
        <Helmet>
          <title>Terms of Use - Ilhanet</title>
        </Helmet>

        <Header2/>

        <div className="Main">
          <div className="info-alert mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
            </svg>
            <Link to="/i/policies/pt/terms">
              {t("AvailableLanguage")}.
            </Link>
          </div>

          <h1>Terms of Use</h1>

          <h2>1. Terms</h2>

          <p>By accessing the Ilhanet website, you agree to comply with our Terms of use, the <Link className="col-3" to="/i/policies/community">Community Guidelines</Link>, and all applicable laws and regulations, and agree that you are responsible for compliance with all applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>

          <h2>2. Minimum Age</h2>
          <p>By creating an account on our platform, you represent and warrant that you are 18 years of age or older. It is your responsibility to ensure that you meet this requirement before completing the registration process.</p>
          
          <h2>3. Use of License</h2>

          <p>Permission is granted to temporarily download one copy of the materials (information or software) on Ilhanet´s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: </p>
          <ol>
          <li><b>1.</b> modify or copy the materials;</li>
          <li><b>2.</b> use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
          <li><b>3.</b> attempt to decompile or reverse engineer any software contained on the Ilhanet website;</li>
          <li><b>4.</b> remove any copyright or other proprietary notations from the materials; or</li>
          <li><b>5.</b> transfer the materials to another person or mirror the materials on any other server.</li>
          </ol>
          <p>This license will automatically terminate if you violate any of these restrictions and may be terminated by Ilhanet at any time. Upon termination of viewing of these materials or upon termination of this license, you must destroy all downloaded materials in your possession, whether in electronic or printed format.</p>

          <h2>4. Disclaimer</h2>

          <ol>
          <li>The materials on Ilhanet´s website are provided as is. Ilhanet makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</li>

          <li>Furthermore, Ilhanet does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</li>
          </ol>

          <h2>5. Limitations</h2>
          <p>In no event shall Ilhanet or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Ilhanet, even if Ilhanet or an Ilhanet authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>

          <h2>6. Accuracy of materials</h2>
          <p>The materials displayed on Ilhanet´s website could include technical, typographical, or photographic errors. Ilhanet does not warrant that any of the materials on its website are accurate, complete or current. Ilhanet may make changes to the materials contained on its website at any time without notice. However, Ilhanet does not make any commitment to update the materials.</p>

          <h2>7. Links</h2>
          <p>Ilhanet has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Ilhanet of the site. Use of any such linked website is at the user´s own risk.</p>

          <h3>Modifications</h3>
          <p>Ilhanet may revise these website terms of service at any time without notice. By using this website, you agree to be bound by the then current version of these terms of service.</p>

          <h3>Applicable Law</h3>
          <p>These terms and conditions are governed by and construed in accordance with the laws of State of Florida, FL (USA), and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
        </div>
      </aside>
  );
}

export default TermsPoliciesEN;
