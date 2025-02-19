import "../styles/main.sass";
import "../styles/styles.sass";
import "../styles/pages/Search.sass";
import Menu from "../components/Menu";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2, SearchX } from "lucide-react";
import User from "@/components/User";
import { Loading2 } from "@/components/loading2";

const GroupMembers = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const path = useLocation().pathname.split("/")[3];

  const [items, setItems] = useState([]);
  const [inputText, setInputText] = useState('');
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`search/?q=${inputText}`);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/groups/members/${path}`);
        if (res.data && res.data.length > 0) {
          setItems(res.data);
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Erro ao buscar usuarios:", error);
      }
    };
    fetchPosts();
  });

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
    <aside id="Search" className="Container">
      <Loading2/>

      <Helmet>
        <title>{t("Membros do grupo")} / Ilhanet</title>
      </Helmet>

      <div className="headerBack bg-1">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main">
        <form className="inputSearch" onSubmit={handleSubmit}>
          <Input
            type="search"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t("Buscar")}
            minLength="1"
            required
          />
          <button type="submit" className="buttonSearch col-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </form>

        {items.length === 0 ? (
          <span className="NoItems">{t("Nenhum membro")}.</span>
        ) : (
          items.slice(0, visibleUsersCount).map((userItem) => <User key={userItem._id} userItem={userItem} /> )
        )}

        {visibleUsersCount < items.length && (
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

      <Menu />
    </aside>
  );
};

export default GroupMembers;
