import "../../styles/main.sass"
import "../../styles/styles.sass"
import "../../styles/pages/Search.sass"
import Menu from "../../components/Menu";
import {  useLocation, useNavigate } from "react-router-dom";
import { Loading2 } from "@/components/loading2";

import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import User from "@/components/User";

const SearchGroupsProfile = () => {
  const { t } = useTranslation();
  const path = useLocation().pathname.split("/")[3];
  const { search } = window.location;
  const navigate = useNavigate();
  const searchTerm = new URLSearchParams(search).get('q');
  const [Items, setItem] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/search/${path}/membersGroup?q=${searchTerm}`);
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
    if (searchTerm) {
      fetchPosts();
    }
  }, [searchTerm, path]);

  const [visibleUsersCount, setVisibleUsersCount] = useState(15);
  const [loading, setLoading] = useState(false);

  const loadMoreUsers = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleUsersCount((prevCount) => prevCount + 15);
      setLoading(false);
    }, 800); // Simulando um pequeno delay para carregar mais posts
  };

  return (
    <aside id="Search" className="Container SearchMenu">
      <Loading2/>

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

      <div className="Main">
        <div className="headerPage">
          {t("Resultados de busca por")}: <b>{searchTerm}</b>
        </div>

        {Items.length === 0 ? (
          <span className="NoItems">{t("Nenhum membro")}.</span>
        ) : (
          Items.slice(0, visibleUsersCount).map((userItem) => <User key={userItem._id} userItem={userItem} /> )
        )}

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
          <div className="px-3 w-full">
            <div className="info-alert">
              <SearchX />
              {t("Nenhum resultado encontrado")}.
            </div>
          </div>
        ):("")}
      </div>

      <Menu/>
    </aside>
  );
}

export default SearchGroupsProfile;
