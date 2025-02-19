import Post from "../components/Post";
import "../styles/pages/Group.sass";
import "../styles/main.sass";
import "../styles/styles.sass";
import Menu from "../components/Menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Loading } from "@/components/loading";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Expandable2 from "@/components/Expendable2";
import { Numeral } from "react-numeral";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import TextOverflow from "react-text-overflow";
import axios from "axios";
import NotFoundPage from "./NotFound";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import NoDatos from "./NoDatos";
import DOMPurify from "dompurify";
import { Helmet } from "react-helmet";
import ADSComponent from "@/components/ADS";

const Group = () => {
  const navigate = useNavigate();
  const {currentUser} = useSelector((state) => state.user);
  const path = useLocation().pathname.split("/")[2];
  const { t } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupCheck, setGroupCheck] = useState([]);
  const [notDatos, setNotDatos] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`/api/groups/id/${path}`);
        if (res.data) {
          setGroups(res.data);
        } else {
          setNotFound(true);
        }  
      } catch (error) {
        console.error("Erro ao buscar grupos:", error);
        setNotDatos(true);
      }
    };
    fetchGroup();
  }, [path]);

  const [Posts, setPosts] = useState([]);

  useEffect(() => {
    if (groups._id) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`/api/posts/group/${path}`);
          setPosts(res.data);
        } catch (error) {
          console.error("Erro ao buscar posts:", error);
        }
      };
      fetchPosts();
    }
  }, [groups, path]);

  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/id/${groups.userId}`);
        setUser(res.data);
      } catch (error) {
        console.error("Erro ao buscar vídeos:", error);
      }
    };
    fetchUser();
  }, [groups.userId]);

  const descriptionHTML = DOMPurify.sanitize(groups.description);

  const handleFollow = async () => {
    try {
      setGroupCheck(false);
      await axios.post(`/api/groups/join/${path}`);
    } catch (error) {
      console.error("Erro ao seguir usuário:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      setGroupCheck(true);
      await axios.post(`/api/groups/leave/${path}`);
    } catch (error) {
      console.error("Erro ao deixar de seguir usuário:", error);
    }
  }

  const handleDelete = async () => {
      try {
        setIsSubmitting(true);
        await axios.put(`/api/groups/delete/${groups._id}`);
        setTimeout(() => {
          navigate(`/${user.username}`);
        }, 900);
      } catch (error) {
        console.error("Erro ao deletar o post:", error);
    }
  }

  const [userLogin, setUserLogin] = useState(true);

  useEffect(() => {
    if (currentUser) {
      if (groups.userId === currentUser._id) {
        setUserLogin(false);
      } else {
        setUserLogin(true);
      }
    } else {
      setUserLogin(false);
    }
  }, [currentUser, groups]);

  const [isBlock, setIsBlock] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`/api/groups/userActivities/${path}`);
  
          if (res.data.blockedYou === true) {
            setIsBlock(true);
          } else {
            setIsBlock(false);
          }

          if (res.data.follow === true) {
            setGroupCheck(false);
          } else {
            setGroupCheck(true);
          }
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      };
      fetchPosts();
    }
  }, [currentUser, path]);

  const [visiblePostsCount, setVisiblePostsCount] = useState(15);
  const [loading, setLoading] = useState(false);

  const loadMorePosts = () => {
    setLoading(true);
    setTimeout(() => {
      setVisiblePostsCount((prevCount) => prevCount + 15);
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
    <aside id="Group" className="Container">
      <Loading/>

      {groups && groups.title && (<Helmet>
        <title>{groups.title} / Ilhanet</title>
      </Helmet>)}

      <div className="headerBack bg-1">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main"> 
        {groups.img && <img src={groups.img} className="thumbGroup" alt="" />}       

        <div className="headerGroup">
          <div className="hu-details1">
            <div className="hu-details2">
              <h1>{groups.title}</h1>

              <div className="flex">
                <Link to={`/${user.username}`}>
                  <div className="Username">
                    <img src={user.img} alt="" />
                      <h1><TextOverflow text={user.name} /></h1>

                      {user.verified === 1 ? (
                        <svg className="verified1 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                        </svg>
                      ):("")}
                      
                      <span className="flex items-center">@<TextOverflow text={user.username} /></span>
                  </div>
                </Link>
              </div>
            </div>

            {currentUser &&
              <div className="hu-buttons">
                <DropdownMenu>
                  <DropdownMenuTrigger className="col-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {userLogin ? (""):(
                      <Link to={`/u/editgroup/${groups._id}`}>
                        <DropdownMenuItem>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                          </svg>
                          {t("Editar")}
                        </DropdownMenuItem>
                      </Link>
                    )}

                    {userLogin ? (""):(
                      <DropdownMenuItem asChild>
                        <Dialog>
                          <DialogTrigger className="buttonDialogDrop rounded-sm focus:bg-accent" asChild>
                            <button className="buttonDrop flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                              {t("Deletar")}
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[505px]">
                              <DialogHeader>
                                <DialogTitle>{t("Deseja mesmo remover este grupo?")}</DialogTitle>
                                <DialogDescription>
                                  {t("Esta ação não poderá ser desfeita")}.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button onClick={handleDelete} type="submit" variant="destructive" disabled={isSubmitting}>
                                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  {t("Deletar")}
                                </Button>
                              </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuItem>
                    )}

                    <Link to={`/report/group/${groups._id}`}>
                      <DropdownMenuItem>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                        </svg>
                        {t("Denunciar")}
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            }
          </div>

          <div className="hu-details3">
            <div className="hu-numbers">
              <span onClick={() => navigate(`/group/members/${path}`)}>
                <b title={100}><Numeral value={groups.followsCount} format={"0a"}/></b> {t("membros")}
              </span>
            </div>

            {groups.description ? (
              <Expandable2 className="col-2">
                {descriptionHTML}
              </Expandable2>
            ):("")}

            <div className="buttons flex">
              {userLogin && (
              groupCheck ? (
                  <Button onClick={handleFollow}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                    </svg>
                    {t("Entrar")}
                  </Button>
                ):(
                  <button className="invited bor-1 col-3" onClick={handleUnfollow}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    {t("Participando")}
                  </button>
              ))}
              
              {currentUser ? (""):(<>
                <Button onClick={() => navigate(`/auth/login`)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                  </svg>
                  {t("Entrar")}
                </Button>
              </>)}

              {currentUser && !isBlock && (groupCheck ? (""):(
                <Button className="post" onClick={() => navigate(`/newpost/group/${path}`)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                  {t("Publicar")}
                </Button>
              ))}
            </div>
          </div>

          {currentUser && isBlock && (
            <div className="info-alert">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              {t("msgBlockUserGroup")}
            </div>
          )}
        </div>

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

      <Menu/>
    </aside>
  );
}

export default Group;
