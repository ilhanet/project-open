import "../../styles/main.sass"
import "../../styles/styles.sass"
import "../../styles/pages/Policies.sass"
import Header2 from "../../components/Header2";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const CommunityGuidelinesEN = () => {
  const { t } = useTranslation();

  return (
      <aside id="Policies" className="Container NoMenu">
        <Helmet>
          <title>Community Guidelines - Ilhanet</title>
        </Helmet>

        <Header2/>

        <div className="Main">
          <div className="info-alert mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
            </svg>
            <Link to="/i/policies/pt/community">
              {t("AvailableLanguage")}.
            </Link>
          </div>

          <h1>Community Guidelines</h1>

          <p>The Ilhanet Community Guidelines are designed to ensure that user-generated content is safe and legally compliant for everyone.</p>
          
          <h2>1. Disclosure of Sensitive Personal Information</h2>
          <p>Do not post content that reveals personal identification information of others (such as residential addresses, email addresses, and phone numbers that are not publicly available, banking information, social security/national identity numbers, and passport numbers).</p>

          <h2>2. Hateful behavior</h2>
          <p>Do not post content that promotes violence or discrimination against individuals or groups based on race, color, ethnicity, nationality, ancestry, religion, gender, or sexual orientation.</p>

          <h2>3. Non-consensual Nudity and Sexual Exploitation of Minors</h2>
          <p>Do not post content containing intimate photos or videos of individuals that have been produced or distributed without proper consent, or that depict and/or promote pornography and sexual exploitation of minors.</p>

          <h2>4. Promotion and Sale of Illegal or Regulated Goods or Services</h2>
          <p>Do not post content that promotes the sale, purchase, or facilitation of transactions related to illegal and/or regulated goods or services.</p>

          <h2>5. False and Misleading Identities</h2>
          <p>Do not create profiles and/or post content with the intent to falsify the identity of individuals, groups, or organizations to deceive, confuse, or mislead others.</p>

          <h2>6. Platform Manipulation and Spam</h2>
          <p>Do not use our platform to artificially amplify or suppress information, and/or engage in behavior that manipulates or harms the user experience.</p>

          <h2>7. Explicit Violence</h2>
          <p>Do not post content containing photos or videos of individuals subject to violence with exposed blood and/or committing acts of suicide.</p>

          <h2>8. Copyrights and Trademarks</h2>
          <p>Profiles and/or content that violate the copyrights and trademarks of others may be removed.</p>

          <h2>Modifications</h2>
          <p>Ilhanet may revise these community guidelines at any time without prior notice. By using this platform, you agree to be bound by the current version of these community guidelines.</p>        </div>
      </aside>
  );
}

export default CommunityGuidelinesEN;
