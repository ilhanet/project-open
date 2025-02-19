import "../../styles/main.sass"
import "../../styles/styles.sass"
import "../../styles/pages/Policies.sass"
import "../../styles/pages/PageHome.sass";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Header2 from "@/components/Header2";
import { Helmet } from "react-helmet";

const PrivacyAndCookiesPoliciesEN = () => {
  const { t } = useTranslation();

  return (
      <aside id="Policies" className="Container NoMenu">
        <Helmet>
          <title>Privacy and Cookies Policies - Ilhanet</title>
        </Helmet>

        <Header2/>

        <div className="Main">
            <div className="info-alert mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
              </svg>
              <Link to="/i/policies/pt/privacy-cookies">
                {t("AvailableLanguage")}.
              </Link>
            </div>

            <h1>Privacy and Cookies Policies</h1>

            <p>Your privacy is important to us. It is Ilhanet`s policy to respect your privacy regarding any information we may collect from you across the <a href="https://teste.com">Ilhanet</a> website, and other sites we own and operate.</p>
            <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we´re collecting it and how it will be used.</p>
            <p>We only retain collected information for as long as necessary to provide you with the requested service. What data we store, we´ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
            <p>We don’t share personally identifiable information publicly or with third-parties, except when required to by law.</p>
            <p>Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.</p>
            <p>You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.</p>
            <p>You can consult, modify and/or delete your data by accessing the Edit Profile page, <a href="/u/editprofile" target="_blank" rel="noopener">by clicking here</a>.</p>
            <p>The elimination of your data may be done by deleting your account. The Ilhanet may keep your data for use in legal and/or regulatory proceedings.</p>
            <p>Your continued use of our website will be considered acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, please contact us by email: <Link to="mailto:privacy@ilhanet.com">privacy@ilhanet.com</Link>.</p>

            <h2>Cookie Policy</h2>
            <h3>What are cookies?</h3>
            <p>As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or break certain elements of the sites functionality.</p>
            <h3>How do we use cookies?</h3>
            <p>We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.</p>
            
            <h3>Manage cookies</h3>
            <p>The user can consult, block and/or disable cookies in use at any time, on any website, including ours, by accessing the settings of their browser. See help guides for the main browsers below:</p>
            <ul>
            <li><Link target="_blank" rel="noopener" to="https://support.google.com/accounts/answer/61416?hl=en">Google Chrome</Link></li>
            <li><Link target="_blank" rel="noopener" to="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop?redirectlocale=en-US&amp;redirectslug=enable-and-disable-cookies-website-preferences">Firefox</Link></li>
            <li><Link target="_blank" rel="noopener" to="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies">Microsoft Edge</Link></li>
            <li><Link target="_blank" rel="noopener noreferrer" to="https://blogs.opera.com/news/2015/08/how-to-manage-cookies-in-opera/">Opera</Link></li>
            <li><Link target="_blank" rel="noopener" to="https://support.apple.com/en-us/guide/safari/sfri11471/mac">Safari</Link></li>
            </ul>
            <p className="col-2">Find out more at <Link target="_blank" rel="noopener" to="https://allaboutcookies.org">allaboutcookies.org</Link></p>

            <h3>Cookies we set</h3>
            <ul className="listCookies">
            <li>
            <span>Necessary cookies</span><br />
            These cookies are required for the website to function properly.<br/><br/>
            </li>
            <li>
            <span>Performance cookies</span><br/>
            These cookies are used to collect statistical information on the use of our website, also called analytics cookies. We use this data for site performance and optimization.<br/><br/>
            </li>
            <li>
            <span>Advertising cookies</span><br/>
            These cookies are set by third party advertising partners and are used for profiling and tracking data across multiple websites. If you accept these cookies, we may show you our advertisements on other websites based on your user profile and preferences.
            These cookies also save data on how many visitors have seen or clicked on our advertisements to optimize advertising campaigns.<br/>
            </li>
            </ul>

            <h3>Partner Cookies</h3>
            <ul className="listCookies gap-3">
            <li>
                <b className="col-2">Google</b><br />
                <p>Privacy Policy: <Link target="_blank" to="https://policies.google.com/technologies/partner-sites">https://policies.google.com/technologies/partner-sites/</Link></p>
            </li>
            <br />
            <li>
                <b className="col-2">Cloudinary</b><br />
                <p>Privacy Policy: <Link target="_blank" to="https://cloudinary.com/privacy">https://cloudinary.com/privacy/</Link></p>
            </li>
            </ul>

            <h3>User Commitment</h3>
            <p>The user undertakes to make appropriate use of the content and information that Ilhanet offers on the website and, by way of example but not limited to:</p>
            <ul>
            <li>A) Not to engage in activities that are illegal or contrary to good faith and public order;</li>
            <li>B) Not to cause damage to the physical (hardware) and logical (software) systems of Ilhanet, its suppliers or third parties, to introduce or disseminate computer viruses or any other hardware or software systems that are capable of causing damage previously mentioned.</li>
            </ul>
            <h3>More Information</h3>
            <p>Hopefully that has clarified things for you and as was previously mentioned if there is something that you aren´t sure whether you need or not it´s usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.</p>
            <p>This policy is effective from <strong>Set</strong>/<strong>2024</strong>.</p>
        </div>
      </aside>
  );
}

export default PrivacyAndCookiesPoliciesEN;
