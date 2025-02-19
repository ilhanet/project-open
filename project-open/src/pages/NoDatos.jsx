import "../styles/main.sass";
import "../styles/styles.sass";
import Menu from "../components/Menu";

import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";

const NoDatos = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <aside id="Notifications" className="Container">
      <div className="Main py-4 px-4">
        <div className="headerBack bg-1">
          <div onClick={() => navigate(-1)} className="hbButton col-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </div>
        </div>

        <div className="info-alert">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
          {t("Erro ao carregar os dados")}.
        </div>
        <br />

        <Button onClick={() => window.location.reload()} className="w-full">
          {t("Tentar novamente")}
        </Button>
      </div>

      <Menu/>
    </aside>
  );
}

export default NoDatos;
