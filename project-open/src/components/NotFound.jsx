import "../styles/components/NotFound.sass"
import { SearchX } from "lucide-react";
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div id="NotFound">
      <div className="col-3">
        <SearchX />
      </div>

      <div className="grid">
        <h1>{t("Não encontrado")}.</h1>
        <span>{t("msgNotFound")}</span>
      </div>
    </div>
  );
}

export default NotFound;
