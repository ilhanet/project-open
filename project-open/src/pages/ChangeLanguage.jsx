import "../styles/main.sass";
import "../styles/styles.sass";
import Menu from "../components/Menu";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ChangeLanguage =  () => {
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  function handleClick(lang) {
    i18n.changeLanguage(lang);
  }

  return (
    <aside id="Lang" className="Container">
      <div className="headerBack bg-1">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main">
        <div className="EditHeader">
          <h1>{t("Idioma")}: {t("Iso")}</h1>
        </div>

        <div className="Accordion w-full" type="single">
            <button className="accordionItem py-4 px-3 border-b border-t flex" onClick={()=>handleClick('pt-BR')}>
              <span>Português (Brasil)</span>
            </button>

            <button className="accordionItem py-4 px-3 border-b flex" onClick={()=>handleClick('en')}>
              <span>English</span>
            </button>

            <button className="accordionItem py-4 px-3 border-b flex" onClick={()=>handleClick('es')}>
              <span>Español (América)</span>
            </button>
        </div>
      </div>
      <Menu />
    </aside>
  );
};

export default ChangeLanguage;
