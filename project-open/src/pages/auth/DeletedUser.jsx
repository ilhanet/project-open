import "../../styles/main.sass";
import "../../styles/styles.sass";
import "../../styles/pages/Posts.sass";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loading } from "@/components/loading";
import NotFoundPage from "../NotFound";
import { useTranslation } from 'react-i18next';
import Menu from "@/components/Menu";

const DeletedUser = () => {
  const navigate = useNavigate();
  const [notFound, setNotFound] = useState(false);
  const { t } = useTranslation();

  const path = useLocation().pathname.split("/")[2];

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`/api/resetauth/${path}`);
        if (res.data) {
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Erro em requisição:", error);
        setNotFound(true);
      }
    };
    fetchStatus();
  }, [path]);


  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        await axios.post(`/api/resetauth/update-delete/${path}`);
      } catch (error) {
        console.error("Erro em requisição:", error);
      }
    };
    fetchUpdate();
  }, [path]);

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <aside id="EditProfile" className="Container NoMenu noheaderMenu">  
      <Loading/>
      <Menu/>
          
      <div className="headerBack bg-1" onClick={() => navigate('/')}>
        <div className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main">
        <form className="grid w-full gap-2">
          <div className="info-alert">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {t("Sua conta foi deletada")}.
          </div>
        </form>
      </div>
    </aside>
  );
}

export default DeletedUser;
