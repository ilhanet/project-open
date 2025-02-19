import "../styles/pages/Notifications.sass";
import "../styles/main.sass";
import "../styles/styles.sass";
import Menu from "../components/Menu";

import { Loading } from "@/components/loading";
import { useNavigate } from "react-router-dom";
import Notification from "@/components/Notification";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet";

const Notifications = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState([]); // Corrigido o nome para minúsculo
  const [visiblePostsCount, setVisiblePostsCount] = useState(10);
  const [loading, setLoading] = useState(false);

  // UseEffect para buscar as notificações uma vez
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`/api/notifications/me`);
        setNotifications(res.data);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      }
    };
    fetchNotifications();
  }, []); // Adicionado array vazio para executar apenas uma vez após o render inicial

  // UseEffect para marcar as notificações como vistas
  useEffect(() => {
    const postView = async () => {
      try {
        await axios.put(`/api/notifications/viewed`);
      } catch (error) {
        console.error("Erro ao marcar notificações como vistas:", error);
      }
    };
    setTimeout(postView, 800); // Atraso de 800ms para marcar como visto
  }, []); // Executa apenas uma vez após o render inicial

  // Função para carregar mais notificações
  const loadMorePosts = () => {
    setLoading(true);
    setTimeout(() => {
      setVisiblePostsCount((prevCount) => prevCount + 10);
      setLoading(false);
    }, 800); // Simulando um pequeno delay para carregar mais notificações
  };
  
  return (
    <aside id="Notifications" className="Container">
      <Loading/>

      <Helmet>
        <title>{t("Notificações")} / Ilhanet</title>
      </Helmet>

      <div className="Main">
        <div className="headerBack bg-1">
          <div onClick={() => navigate(-1)} className="hbButton col-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </div>
        </div>

        <div className="w-full">
          <h1 className="title col-2">{t("Notificações")}</h1>

          {notifications === null ? (
            <span className="NoItems">{t("Nenhuma notificações")}.</span>
          ) : notifications.length > 0 ? (
            notifications.slice(0, visiblePostsCount).map((notifications) => (
              <Notification key={notifications._id} notifications={notifications}/>
            ))
          ) : (
            <div className="loadingPosts py-4 col-3">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}

          {notifications !== null && visiblePostsCount < notifications.length && (
            <Button variant="outline" className="MoreButton col-3" onClick={loadMorePosts} disabled={loading}>
              {loading ? 
              (<Loader2 className="mr-2 h-4 w-4 animate-spin" />):(<>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
                {t("Ver mais notificações")}
              </>)}
            </Button>
          )}
        </div>
      </div>

      <Menu/>
    </aside>
  );
}

export default Notifications;
