import "../../styles/main.sass";
import "../../styles/styles.sass";
import Header2 from "../../components/Header2";

import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const Policies =  () => {
  const { t } = useTranslation();

  return (
    <aside id="More" className="Container NoMenu">
      <Helmet>
        <title>Políticas e termos - Ilhanet</title>
      </Helmet>

      <Header2 />
      <div className="Main">
        <div className="Accordion w-full" type="single">
          <h1 className="titlePage">{t("Políticas e termos")}</h1>

          <Link to="privacy-cookies">
            <button className="accordionItem py-4 px-3 border-b border-t flex">
              <span>{t("Políticas de Privacidade e Cookies")}</span>
            </button>
          </Link>

          <Link to="privacy-app">
            <button className="accordionItem py-4 px-3 border-b flex">
              <span className="fx1">{t("Política de Privacidade do Aplicativo")}</span>
            </button>
          </Link>

          <Link to="terms">
            <button className="accordionItem py-4 px-3 border-b flex">
              <span>{t("Termos de uso")}</span>
            </button>
          </Link>

          <Link to="community">
            <button className="accordionItem py-4 px-3 border-b flex">
              <span className="fx1">{t("Diretrizes de Comunidade")}</span>
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Policies;
