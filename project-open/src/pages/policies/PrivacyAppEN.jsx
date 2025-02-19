import "../../styles/main.sass"
import "../../styles/styles.sass"
import "../../styles/pages/Policies.sass"
import Header2 from "../../components/Header2";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from 'react-i18next';

const PrivacyAppEN = () => {
    const { t } = useTranslation();

  return (
      <aside id="Policies" className="Container NoMenu">
        <Helmet>
            <title>Ilhanet App Privacy Policy - Ilhanet</title>
        </Helmet>

        <Header2/>

        <div className="Main">
            <div className="info-alert mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
              </svg>
              <Link to="/i/policies/pt/privacy-app">
                {t("AvailableLanguage")}.
              </Link>
            </div>

            <h1>Ilhanet App Privacy Policy</h1>

            <p>Welcome to the Ilhanet app. Our priority is to protect our users' privacy. This Privacy Policy describes how we collect, use, and protect your information when using our VPN app.</p>

            <h2>1. Collected Information</h2>
            <p>Our app respects your privacy and avoids unnecessary data collection. However, we may collect certain information to provide and improve our services.</p>

            <h3>1.1. Automatically Collected Information</h3>
            <ul>
                <li><strong>Usage Data:</strong> Includes information about the user's interaction with the app, such as connection time, servers used (without activity logs or visited sites).</li>
                <li><strong>IP Address:</strong> Temporarily collected for connection and security purposes, but we do not store browsing logs.</li>
                <li><strong>Device and Operating System:</strong> We collect information about the device type and operating system version to enhance app compatibility.</li>
            </ul>

            <h3>1.2. Information Collected When Accessing the Platform</h3>
            <p>Our app includes a component to access our platform. This means that:</p>
            <ul>
            <li>All traffic on the platform is governed by Ilhanet's <Link className="col-3" to="/i/policies/privacy-cookies">Privacy Policies</Link> and <Link className="col-3" to="/i/policies/terms">Terms of Use</Link>. In the case of using external sites, the user should refer to the respective sites' policies.</li>
            <li>We do not capture or store credentials entered on the platform.</li>
            </ul>

            <h2>2. Use of Information</h2>
            <p>We use the collected information to:</p>
            <ul>
                <li>- Provide and improve our VPN service.</li>
                <li>- Monitor and fix technical issues.</li>
                <li>- Ensure the security and integrity of the service.</li>
                <li>- Comply with legal and regulatory obligations.</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>We do not sell, rent, or share your personal information with third parties, but we may disclose information if required by law or to protect our rights and users' security.</p>

            <h2>4. Log Policy</h2>
            <p>The Ilhanet app is a no-log service (<strong>No-Log Policy</strong>). This means that we do not store browsing records, IP addresses, connection histories, or any data that could identify your online activity.</p>

            <h2>5. Cookies and Tracking Technologies</h2>
            <p>When accessing the platform, the application may load pages that use cookies to provide a better user experience. However, this is controlled by the websites accessed, and we recommend that users review their respective privacy policies.</p>

            <h2>6. Data Security</h2>
            <p>We implement security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.</p>

            <h2>7. User Rights</h2>
            <p>Your continued use of our website and/or app will be considered acceptance of our privacy and personal information practices. If you have any questions about how we handle user data and personal information, please contact us at: <a href="mailto:privacy@ilhanet.com">privacy@ilhanet.com</a>.</p>

            <h2>8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy. We will notify users of significant changes through the app or email.</p>
        </div>
      </aside>
  );
}

export default PrivacyAppEN;
