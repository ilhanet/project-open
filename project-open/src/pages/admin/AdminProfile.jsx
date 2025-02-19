import Post from "../../components/Post";
import "../../styles/pages/Profile.sass";
import "../../styles/main.sass";
import "../../styles/styles.sass";
import Menu from "../../components/Menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Loading2 } from "@/components/loading2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Expandable2 from "@/components/Expendable2";
import Numeral from 'react-numeral';
import TextOverflow from "react-text-overflow";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import NotFoundPage from "../NotFound";
import { Loader2 } from "lucide-react";
import { useTranslation } from 'react-i18next';
import NoDatos from "../NoDatos";
import DOMPurify from "dompurify";
import moment from 'moment-timezone';

const AdminProfile = () => {
  const {currentUser} = useSelector((state) => state.user);
  const navigate = useNavigate();

  const path = useLocation().pathname.split("/")[3];
  const { t } = useTranslation();

  const [user, setUser] = useState({});
  const [auth, setAuth] = useState({});
  const [Posts, setPosts] = useState([]);
  const [isBlock, setIsBlock] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [notDatos, setNotDatos] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/admin/user/${path}`);
        if (res.data) {
          setUser(res.data);
        } else {
          setNotFound(true);
        }

        if (res.data.status === "blocked") {
          setIsBlock(true);
        } else {
          setIsBlock(false);
        }

        if (res.data.verified === 1) {
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }

        if (res.data.followersCount === 0) {
          setUser(prevCounts => ({ ...prevCounts, followersCount: "0" }));
        }

        if (res.data.followsCount === 0) {
          setUser(prevCounts => ({ ...prevCounts, followsCount: "0" }));
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        setNotDatos(true);
      }
    };
  
    fetchUser();
  }, [path]);

  useEffect(() => {
    if (user._id) {
      const fetchAuth = async () => {
        try {
          const res = await axios.get(`/api/admin/auth/${user._id}`);
          setAuth(res.data);
        } catch (error) {
          console.error("Erro ao buscar posts:", error);
        }
      };
      fetchAuth();
    }
  }, [user._id]);

  useEffect(() => {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`/api/admin/posts/user/${user._id}`);
          setPosts(res.data);
        } catch (error) {
          console.error("Erro ao buscar posts:", error);
        }
      };
      fetchPosts();
  }, [user._id]);

  const descriptionHTML = DOMPurify.sanitize(user.description);
  
  const handleBlock = async () => {
      try {
        await axios.post(`/api/users/blockAdmin/${user._id}`);
        setIsBlock(true);
      } catch (error) {
        console.error("Erro ao bloquear usuário:", error);
      }
  };

  const handleUnblock = async () => {
      try {
        await axios.put(`/api/users/unblockAdmin/${user._id}`);
        setIsBlock(false);
      } catch (error) {
        console.error("Erro ao desbloquear usuário:", error);
      }
  }

  const handleVerified = async () => {
    try {
      await axios.post(`/api/admin/user/verified/${user._id}`);
      setIsVerified(true);
    } catch (error) {
      console.error("Erro ao bloquear usuário:", error);
    }
  };

  const handleRemoveVerified = async () => {
      try {
        await axios.put(`/api/admin/user/remove-verified/${user._id}`);
        setIsVerified(false);
      } catch (error) {
        console.error("Erro ao desbloquear usuário:", error);
      }
  }

  const [visiblePostsCount, setVisiblePostsCount] = useState(15);
  const [loading, setLoading] = useState(false);

  const loadMorePosts = () => {
    setLoading(true);
    setTimeout(() => {
      setVisiblePostsCount((prevCount) => prevCount + 15);
      setLoading(false);
    }, 800); // Simulando um pequeno delay para carregar mais posts
  };

  const [userAuth, setUserAuth] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/auth/authId`);
        setUserAuth(res.data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    fetchUser();
  }, [currentUser]);
  
  const [date, setDate] = useState('');

  useEffect(() => {
      const formatted = moment(user.createdAt).tz("America/Sao_Paulo").format('DD, MMMM, YYYY');
      setDate(formatted);
  }, [user.createdAt]);

  const [dateDOB, setDateDOB] = useState('');

  useEffect(() => {
      const formattedDOB = moment(user.dob).tz("America/Sao_Paulo").format('DD, MMMM, YYYY');
      setDateDOB(formattedDOB);
  }, [user.dob]);

  if (userAuth.admin !== 1) {
    return <NotFoundPage />;
  }

  if (notDatos) {
    return <NoDatos />;
  }

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <aside id="Profile" className="Container">
      <Loading2/>

      <div className="Main">
      <div className="headerBack bg-1">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

        <div className="headerUser">
          <div className="hu-details1">
            <img src={user.img} alt="" />

            <div className="hu-details2 col-1">
              <div className="Username">
                <h1 className="Name"><TextOverflow text={user.name} /></h1>

                {(user.verified === 1 || user.verified === 2) && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <svg className="verified1 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                        </svg>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("Verificado")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              <span className="flex items-center">@<TextOverflow text={user.username} /></span>

              <div className="hu-buttons">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="col-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                      </svg>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {isBlock ? (
                        <DropdownMenuItem onClick={handleUnblock}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                          </svg>
                          Debloquear usuário
                        </DropdownMenuItem>
                      ):(
                        <DropdownMenuItem onClick={handleBlock}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                          </svg>
                          Bloquear usuário
                        </DropdownMenuItem>
                      )}

                      {isVerified ? (
                        <DropdownMenuItem onClick={handleRemoveVerified}>
                          Remover verificado
                        </DropdownMenuItem>
                      ):(
                        <DropdownMenuItem onClick={handleVerified}>
                          Verificar usuário
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="hu-details3">
            <div className="hu-numbers">
              <span><b><Numeral value={user.followersCount} format={"0a"}/></b> {t("seguidores")}</span>
              <span><b><Numeral value={user.followsCount} format={"0a"}/></b> {t("seguindo")}</span>
              {user.groupCount > 0 && (
                <Link to={`/p/${path}/groups`}>
                  <span><b><Numeral value={user.groupCount} format={"0a"}/></b> {t("grupos")}</span>
                </Link>
              )}
              {Posts && Posts.length > 0 && <span><b><Numeral value={Posts.length} format={"0a"}/></b> {t("posts")}</span>}
            </div>

            {user.description ? (
              <Expandable2 className="col-2">
                {descriptionHTML}
              </Expandable2>
            ):("")}

            <br/>
            <p>Status: {user.status}</p>
            <p>País: {user.country}</p>
            <p>Idioma: {user.language}</p>
            <p>Fuso horário: {user.timezone}</p>
            <p>Data de nascimento: {dateDOB}</p>
            <p>Email: {auth.email}</p>
            <p>Email confirmado: {auth.confirmEmail === 1 ? ("Sim"):("Não")}</p>
            <p>Autenticado com X: {auth.authX ? ("Sim"):("Não")}</p>
            <p>Criado em: {date}</p>
          </div>
        </div>

        {Posts.length === 0 ? (
          <span className="NoItems">{t("Nenhum post")}.</span>
        ) : (
          Posts.slice(0, visiblePostsCount).map((post) => <Post key={post._id} post={post} /> )
        )}

        {visiblePostsCount < Posts.length && (
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
      </div>

      <Menu/>
    </aside>
  );
}

export default AdminProfile;
