import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

const CookieConsent = () => {
  const { t } = useTranslation();
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    const consentGiven = getCookie('cookieConsent');
    if (!consentGiven) {
      setShowCookieBanner(true);
    }
  }, []);

  const handleConsent = () => {
    setCookie('cookieConsent', 'true', 365);
    setShowCookieBanner(false);
  };

  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  };

  const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  if (!showCookieBanner) return null;

  return (
    <div id="Cookie" className="bg-1">
      <p>{t("msgCookies")}</p>
      <div className="buttons">
        <Button onClick={handleConsent}>{t("Ok, entendi.")}</Button>
        <Link target="_blank" to="/i/policies/privacy-cookies"><button className="button2">{t("Saiba mais")}</button></Link>
      </div>
    </div>
  );
};

export default CookieConsent;
