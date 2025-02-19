import "../../styles/main.sass"
import "../../styles/styles.sass"
import "../../styles/pages/Search.sass"
import Menu from "../../components/Menu";
import { Link, useNavigate } from "react-router-dom";
import { Loading } from "@/components/loading";

import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import NotFoundPage from "../NotFound";
import { useSelector } from "react-redux";
import TextOverflow from "react-text-overflow";
import { Numeral } from "react-numeral";

const AdminUsersBlocked = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { search } = window.location;
  const searchTerm = new URLSearchParams(search).get('q');
  const [Items, setItem] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const {currentUser} = useSelector((state) => state.user);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/admin/usersBlocked`);
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
    fetchPosts();
  }, [searchTerm]);

  const [visibleUsersCount, setVisibleUsersCount] = useState(15);
  const [loading, setLoading] = useState(false);

  const loadMoreUsers = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleUsersCount((prevCount) => prevCount + 15);
      setLoading(false);
    }, 800); // Simulando um pequeno delay para carregar mais posts
  };

  const [userAuth, setAuth] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/auth/authId`);
        setAuth(res.data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    fetchUser();
  }, [currentUser]);

  if (userAuth.admin !== 1) {
    return <NotFoundPage />;
  }

  return (
    <aside id="Search" className="Container SearchMenu">
      <Loading/>

      <Helmet>
        <title>Users blocked - Admin / Ilhanet</title>
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
          <b>Usuários bloqueados</b>
        </div>

        {Items.slice(0, visibleUsersCount).map((user) => ( 
          <Link to={`/admin/profile/${user.username}`} key={user.id}> 
            <div className="userItem col-1" key={user.id}> 
              <img src={user.img} alt="" /> 

              <div className="Details">
                <div className="Username">
                  <h1><TextOverflow text={user.name} /></h1>

                  {(user.verified === 1 || user.verified === 2) && (
                    <svg className="verified1 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                    </svg>
                  )}

                  <span className="flex items-center">@<TextOverflow text={user.username} /></span> {/* Suponho que 'username' seja uma propriedade do objeto do usuário */}
                </div>

                {(user.followersCount === 0) ? (
                  <span className="col-2 followers">0 {t("seguidores")}</span> 
                ):(
                  <span className="col-2 followers"><Numeral value={user.followersCount} format={"0,0"}/> {t("seguidores")}</span>
                )}

                <div className="buttonStatus">
                  {user.status === "on" && "Ativo"}
                  {user.status === "blocked" && "Bloqueado"}
                  {user.status === "deleted" && "Deletado"}
                </div>
              </div>
            </div>
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
          <div className="px-3 w-full">
            <div className="info-alert">
              <SearchX />
              Nenhum usuário encontrado.
            </div>
          </div>
        ):("")}
      </div>

      <Menu/>
    </aside>
  );
}

export default AdminUsersBlocked;
