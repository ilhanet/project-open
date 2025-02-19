import Post from "../components/Post";
import "../styles/main.sass"
import "../styles/styles.sass"
import Header from "../components/Header";
import logo from '../img/logo.svg'
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { useTranslation } from 'react-i18next';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CookieConsent from "@/components/Cookie";
import ADSComponent from "@/components/ADS";
import NoDatos from "./NoDatos";
import { useQuery } from 'react-query';

const fetchUser = async () => {
  const res = await axios.get(`/api/users/me`);
  document.cookie = `in_timezone=${res.data.timezone}; expires=365; path=/`;

  return res.data;
};

const HomeVideos = () => {
  const {currentUser} = useSelector((state) => state.user);
  const [Posts, setPosts] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [LoadingPost, setLoadingPost] = useState(false);
  const [notDatos, setNotDatos] = useState(false);

  const buttonHome = async () => {
    scrollTo({top: 0});
    setLoadingPost(true);
    const res = await axios.get(`/api/posts/feed/videos/${currentUser._id}`);
    setPosts(res.data);
    setLoadingPost(false);
  };

  // useQuery para buscar os dados do usuário
  const { data: user } = useQuery(
    'user', 
    fetchUser, 
    {
      enabled: !!currentUser, // Só executa se `currentUser` estiver definido
    }
  );

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/posts/feed/videos/${currentUser._id}`);
        setPosts(res.data);
      } catch (error) {
        setNotDatos(true)
        console.error("Erro ao buscar posts:", error);
      }
    };
    fetchPosts();
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (currentUser) {
          await axios.get(`/api/auth/session`);
        }
      } catch (error) {
        if (error.response && error.response.status === 404 || error.response.status === 403 || error.response.status === 401) {
          localStorage.removeItem("persist:root");
          window.location.reload();
        } else {
          console.error("Erro em requisição", error);
        }
      }
    };
    fetchUser();

  }, [currentUser]);

  const [visiblePostsCount, setVisiblePostsCount] = useState(15);
  const [loading, setLoading] = useState(false);

  const loadMorePosts = () => {
    setLoading(true);
    setTimeout(() => {
      setVisiblePostsCount((prevCount) => prevCount + 15);
      setLoading(false);
    }, 500); // Simulando um pequeno delay para carregar mais posts
  };

  if (!currentUser) {
    navigate(`/auth/login?redirect=/videos`)
  }

  if (user && user.status === "process") {
    return <Navigate replace to="/auth/complete-register" />;
  }

  if (notDatos) {
    return <NoDatos />;
  }

  return (
    <aside id="Home" className="Container">
      <Header/>
      <CookieConsent/>

      <div className="Header headerMenu bg-1 col-1">
        <Link to="/"><div className="Item">Posts</div></Link>
        <Link to="/videos"><div className="Item itemActive">Vídeos</div></Link>
      </div>

      <div className="Main hm-mtop">
        {LoadingPost &&
          <div className="loadingPosts py-4 col-3">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        }

        {Posts === null ? (
          <span className="NoItems">{t("Nenhum post")}</span>
        ) : Posts.length > 0 ? (
          Posts.slice(0, visiblePostsCount).map((post) => (
            <Post key={post._id} post={post} />
          ))
        ) : (
          <div className="loadingPosts py-4 col-3">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}

        {Posts !== null && visiblePostsCount < Posts.length && (
          <Button variant="outline" className="MoreButton col-3" onClick={loadMorePosts} disabled={loading}>
            {loading ? 
            (<Loader2 className="mr-2 h-4 w-4 animate-spin" />):(<>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
              {t("Ver mais posts")}
            </>)}
          </Button>
        )}

        <ADSComponent/>
      </div>

      <div className="Menu bg-1 col-1">
        <div className="logo">
          <img src={logo} onClick={() => navigate(`/`)} alt="" />
        </div>

        <div className="menuItem Home" onClick={buttonHome}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </div>

        {currentUser && (<>
        <Link to="/search">
          <div className="menuItem Search">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="menuItem">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="center">
            <DropdownMenuGroup>
              <Link to="/newpost">
                <DropdownMenuItem>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                  <span>{t("Criar post")}</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/newpost/live-rumble">
                <DropdownMenuItem>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  <span>{t("Postar Live do Rumble")}</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/newgroup">
                <DropdownMenuItem>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                  <span>{t("Criar grupo")}</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        </>)}

        {currentUser &&
        <Link to="/more">
          <div className="menuItem More">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </div>
        </Link>
        }
      </div>
    </aside>
  );
}

export default HomeVideos;
