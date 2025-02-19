import "../styles/main.sass";
import "../styles/styles.sass";
import Menu from "../components/Menu";

import { useNavigate } from "react-router-dom";
import NotFound from "@/components/NotFound";
import { Loading } from "@/components/loading";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <aside id="Notifications" className="Container">
      <Loading/>
      <div className="Main">
        <div className="headerBack bg-1">
          <div onClick={() => navigate(-1)} className="hbButton col-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </div>
        </div>

        <NotFound/>
      </div>

      <Menu/>
    </aside>
  );
}

export default NotFoundPage;
