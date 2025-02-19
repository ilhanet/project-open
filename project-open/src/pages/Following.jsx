import "../styles/main.sass"
import "../styles/styles.sass"
import "../styles/pages/Search.sass"
import Menu from "../components/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";

import TextOverflow from "react-text-overflow";
import { Numeral } from "react-numeral";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import ADSComponent from "@/components/ADS";
import NoDatos from "./NoDatos";
import NotFoundPage from "./NotFound";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

const Following = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const path = useLocation().pathname.split("/")[1];

  const [user, setUser] = useState({});
  const [notDatos, setNotDatos] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [Items, setItem] = useState([]);

  const encodedInput = encodeURIComponent(path);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/username/${path}`);
        if (res.data && res.data.status === "on") {
          setUser(res.data);
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        setNotDatos(true);
      }
    };
    fetchUser();
  }, [path]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/users/follows/${encodedInput}`);
        setItem(res.data);
      } catch (error) {
        console.error("Erro ao buscar usuarios:", error);
      }
    };
    if (encodedInput) {
      fetchPosts();
    }
  }, [encodedInput]);

  const [visibleUsersCount, setVisibleUsersCount] = useState(15);
  const [loading, setLoading] = useState(false);

  const loadMoreUsers = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleUsersCount((prevCount) => prevCount + 15);
      setLoading(false);
    }, 800); // Simulando um pequeno delay para carregar mais posts
  };

  if (notDatos) {
    return <NoDatos />;
  }

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <aside id="Search" className="Container SearchMenu">
      {user && user.name && (
        <Helmet>
          <title>{t("Seguindo")} - {user.name} / Ilhanet</title>
        </Helmet>
      )}
      
      <div className="headerBack bg-1">
        <div onClick={() => navigate(`/${encodedInput}`)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Header headerMenu bg-1 col-1">
        <Link to={`/${encodedInput}/followers`}><div className="Item">{t("Seguidores")}</div></Link>
        <Link to={`/${encodedInput}/following`}><div className="Item itemActive">{t("Seguindo")}</div></Link>
      </div>

      <div className="Main hm-mtop">
        {Items === null ? (
          <span className="NoItems">{t("Nenhum usuário")}.</span>
        ) : Items.length > 0 ? (
            Items.slice(0, visibleUsersCount).map((user) => (
              <Link to={`/${user.username}`} key={user.id}>
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="userItem col-1" key={user.id}>
                      <img src={user.img} alt="" />

                      <div className="Details">
                        <div className="Username">
                          <h1>
                            <TextOverflow text={user.name} />
                          </h1>

                          {(user.verified === 1 || user.verified === 2) && (
                            <svg
                              className="verified1 w-6 h-6"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}

                          <span className="flex items-center">
                            @<TextOverflow text={user.username} />
                          </span>
                        </div>

                        {user.followersCount === 0 ? (
                          <span className="col-2 followers">0 {t("seguidores")}</span>
                        ) : (
                          <span className="col-2 followers">
                            <Numeral value={user.followersCount} format={"0,0"} /> {t("seguidores")}
                          </span>
                        )}
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    {user && user.name ? (
                      <Link to={`/${user.username}`}>
                        <div className="flex">
                          <img src={user.img} className="headerHoverImg" alt="" />

                          <div className="headerHover">
                            <div className="Username">
                              <TextOverflow text={user.name} />

                              {user.verified === 1 ? (
                                <svg className="verified1 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                </svg>
                              ):("")}
                            </div>

                            <span className="flex items-center">@<TextOverflow text={user.username} /></span>

                            <span className="py-2 text-xs">{user.description}</span>

                            <div className="flex gap-2">
                              <span><b><Numeral value={user.followersCount || "0"} format={"0a"}/></b> {t("seguidores")}</span>
                              <span><b><Numeral value={user.followsCount || "0"} format={"0a"}/></b> {t("seguindo")}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ):(
                      <div className="flex justify-center">
                        <Loader2 className="h-5 w-5 col-3 animate-spin" />
                      </div>
                    )}
                  </HoverCardContent>
                </HoverCard>
              </Link>
            ))
          ) : (
            <div className="loadingPosts py-4 col-3">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
        )}

        {Items && visibleUsersCount < Items.length && (
          <Button variant="outline" className="MoreButton col-3" onClick={loadMoreUsers} disabled={loading}>
            {loading ? 
            (<Loader2 className="mr-2 h-4 w-4 animate-spin" />):(<>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
              {t("Ver mais")}
            </>)}
          </Button>
        )}

        <ADSComponent/>
      </div>

      <Menu/>
    </aside>
  );
}

export default Following;
