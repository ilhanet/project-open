import "../../styles/main.sass"
import "../../styles/styles.sass"
import "../../styles/pages/Search.sass"
import Menu from "../../components/Menu";
import { Link, useNavigate } from "react-router-dom";
import { Loading } from "@/components/loading";

import TextOverflow from "react-text-overflow";
import { Numeral } from "react-numeral";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import ADSComponent from "@/components/ADS";
import DOMPurify from "dompurify";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

const SearchProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { search } = window.location;
  const searchTerm = new URLSearchParams(search).get('q');
  const [Items, setItem] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const encodedInput = encodeURIComponent(searchTerm);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/search/users?q=${encodedInput}`);
        if (res.data && res.data.length > 0) {
          setItem(res.data);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
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

  const searchText = DOMPurify.sanitize(searchTerm);

  const loadMoreUsers = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleUsersCount((prevCount) => prevCount + 15);
      setLoading(false);
    }, 800); // Simulando um pequeno delay para carregar mais posts
  };

  return (
    <aside id="Search" className="Container SearchMenu">
      <Loading/>

      <Helmet>
        <title>{searchTerm} - {t("Busca por perfis")} / Ilhanet</title>
      </Helmet>
      
      <div className="headerBack bg-1">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Header headerMenu bg-1 col-1">
        <Link to={`/search/users?q=${encodedInput}`}><div className="Item itemActive">{t("Perfis")}</div></Link>
        <Link to={`/search/posts?q=${encodedInput}`}><div className="Item">Posts</div></Link>
      </div>

      <div className="Main hm-mtop">
        <div className="headerPage">
          {t("Resultados de busca por")}: <b>{searchText}</b>
        </div>

        {Items.slice(0, visibleUsersCount).map((user) => ( 
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
        ))}

        {visibleUsersCount < Items.length && (
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

        {notFound ? (
          <div className="mb-3 px-3 w-full">
            <div className="info-alert">
              <SearchX />
              {t("Nenhum resultado encontrado")}.
            </div>
          </div>
        ):("")}

        <ADSComponent/>
      </div>

      <Menu/>
    </aside>
  );
}

export default SearchProfile;
