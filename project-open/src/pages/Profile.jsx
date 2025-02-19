import Post from "../components/Post";
import PostFixed from "@/components/PostFixed";
import "../styles/pages/Profile.sass";
import "../styles/main.sass";
import "../styles/styles.sass";
import Header from "../components/Header";
import Menu from "../components/Menu";

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

import { Loading } from "@/components/loading";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Numeral from 'react-numeral';
import TextOverflow from "react-text-overflow";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import NotFoundPage from "./NotFound";
import { Loader2 } from "lucide-react";
import { useTranslation } from 'react-i18next';
import NoDatos from "./NoDatos";
import DOMPurify from "dompurify";
import { Helmet } from "react-helmet";
import ADSComponent from "@/components/ADS";
import Linkify from 'linkify-react';
import "linkify-plugin-hashtag";
import "linkify-plugin-mention";

const Profile = () => {
  const {currentUser} = useSelector((state) => state.user);
  const path = useLocation().pathname.split("/")[1];
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [Posts, setPosts] = useState([]);
  const [PostsFixed, setPostsFixed] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingYou, setIsFollowingYou] = useState(false);

  const [isBlock, setIsBlock] = useState(false);
  const [isBlockButton, setIsBlockButton] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [notDatos, setNotDatos] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/username/${path}`);
        if (res.data && res.data.status === "on") {
          setUser(res.data);
        } else {
          setNotFound(true)
        }

        if (res.data.followersCount === 0) {
          setUser(prevCounts => ({ ...prevCounts, followersCount: "0" }));
        }

        if (res.data.followsCount === 0) {
          setUser(prevCounts => ({ ...prevCounts, followsCount: "0" }));
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        if (error.response && error.response.status === 400) {
          setNotDatos(true);
        }
      }
    };
  
    fetchUser();
  }, [path]);

  useEffect(() => {
    if (user._id) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`/api/posts/user/${user._id}`);
          setPosts(res.data);
        } catch (error) {
          console.error("Erro ao buscar posts:", error);
          setNotDatos(true);
        }
      };
      fetchPosts();
    }
  }, [user._id]);

  const descriptionHTML = DOMPurify.sanitize(user.description);
  
  useEffect(() => {
    if (user.postFixed) {
      const fetchPostF = async () => {
        try {
          const res = await axios.get(`/api/posts/pub/${user.username}/${user.postFixed}`);
          setPostsFixed(res.data);
        } catch (error) {
          console.error("Erro ao buscar posts:", error);
        }
      };

      fetchPostF();
    }
  });


  useEffect(() => {
    if (currentUser) {
      const fetchPostF = async () => {
        try {
          const res = await axios.get(`/api/users/userActivities/${path}`);
          if (res.data.follow === true) {
            setIsFollowing(true);
          } else {
            setIsFollowing(false);
          }

          if (res.data.followYou === true) {
            setIsFollowingYou(true);
          } else {
            setIsFollowingYou(false);
          }

          if (res.data.blockedYou === true) {
            setIsBlock(true);
          } else {
            setIsBlock(false);
          }
        } catch (error) {
          console.error("Erro:", error);
        }
      };

      fetchPostF();
    }
  }, [path, currentUser]);

  const handleFollow = async () => {
      try {
        setIsBlockButton(true);
        await axios.post(`/api/users/follow/${user._id}`);
        await axios.post(`/api/notifications/create/${user._id}/follow`);
        setIsFollowing(true);
        setIsBlockButton(false);
      } catch (error) {
        console.error("Erro ao seguir usuário:", error);
      }
  };

  const handleUnfollow = async () => {
      try {
        setIsBlockButton(true);
        await axios.put(`/api/users/unfollow/${user._id}`);
        setIsFollowing(false);
        setIsBlockButton(false);
      } catch (error) {
        console.error("Erro ao deixar de seguir usuário:", error);
      }
  }

  const handleBlock = async () => {
    try {
      await axios.put(`/api/users/block/${user._id}`);
      setIsBlock(true);
    } catch (error) {
      console.error("Erro ao bloquear usuário:", error);
    }
};

const handleUnblock = async () => {
    try {
      await axios.put(`/api/users/unblock/${user._id}`);
      setIsBlock(false);
    } catch (error) {
      console.error("Erro ao desbloquear usuário:", error);
    }
}

  const [userLogin, setUserLogin] = useState(true);

  useEffect(() => {
    if (currentUser) {
      if (user._id === currentUser._id) {
        setUserLogin(false);
      } else {
        setUserLogin(true);
      }
    } else {
      setUserLogin(false);
    }
  }, [currentUser, user]);

  const [visiblePostsCount, setVisiblePostsCount] = useState(15);
  const [loading, setLoading] = useState(false);

  const loadMorePosts = () => {
    setLoading(true);
    setTimeout(() => {
      setVisiblePostsCount((prevCount) => prevCount + 15);
      setLoading(false);
    }, 800); // Simulando um pequeno delay para carregar mais posts
  };

  const optionsLink = {
    formatHref: {
        hashtag: (href) => "/search/posts?q=%23" + href.substr(1),
        mention: (href) => "/" + href.substr(1)
    },
  };

  if (notDatos) {
    return <NoDatos />;
  }

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <aside id="Profile" className="Container">
      <Header/>
      <Loading/>

      {user && user.name && (
        <Helmet>
          <title>{user.name} / Ilhanet</title>
        </Helmet>
      )}

      <div className="Main">
        <div className="headerUser">
          <div className="hu-details1">
            <img src={user.img} alt="" />

            {/* <div className="photo-story" onClick={() => navigate(`/stories`)}>
              <img src={user.img} alt="" />
            </div> */}

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

              {user.typeUser !== 3 && (
                <div className="hu-buttons">
                  {userLogin && (
                    isFollowing ? (
                      <button className="bor-1 col-3" onClick={handleUnfollow} disabled={isBlockButton}>{t('Seguindo')}</button>
                      ):(
                      <button className="buttonFollow" onClick={handleFollow} disabled={isBlockButton}>{t('Seguir')}</button>
                  ))}

                  {currentUser ? (""):(
                    <button className="buttonFollow" onClick={() => navigate(`/auth/login?redirect=${user.username}`)}>{t('Seguir')}</button>
                  )}

                  {userLogin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="col-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {userLogin && (isBlock ? (
                          <DropdownMenuItem onClick={handleUnblock}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                            {t("Desbloquear usuário")}
                          </DropdownMenuItem>
                        ):(
                          <DropdownMenuItem onClick={handleBlock}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                            {t("Bloquear usuário")}
                          </DropdownMenuItem>
                        ))}

                        <Link to={`/report/profile/${path}`}>
                          <DropdownMenuItem>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                            </svg>
                            {t("Denunciar")}
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="hu-details3">
            <div className="hu-numbers">
              <Link to={`followers`}><span><b><Numeral value={user.followersCount} format={"0a"}/></b> {t("seguidores")}</span></Link>
              <Link to={`following`}><span><b><Numeral value={user.followsCount} format={"0a"}/></b> {t("seguindo")}</span></Link>
              {user.groupCount > 0 && (
                <Link to="groups">
                  <span><b><Numeral value={user.groupCount} format={"0a"}/></b> {t("grupos")}</span>
                </Link>
              )}
              {Posts && Posts.length > 0 && <span><b><Numeral value={Posts.length} format={"0a"}/></b> {t("posts")}</span>}
            </div>

            {user.description ? (
              <Linkify options={optionsLink} componentDecorator={(decoratedHref, decoratedText, key) => (
                <a href={decoratedHref} key={key} target="_blank">
                    {decoratedText}
                </a>
                )}>
                  <p className="Expendable">
                    {`${descriptionHTML}`}
                  </p>
              </Linkify>
            ):("")}

            {currentUser && isFollowingYou === true && (
              <div>
                <button className="following-you">{t("Segue você")}</button>
              </div>
            )}
          </div>
        </div>

        {user.tagsFeatured && user.tagsFeatured.length > 0 && (
          <div className="tagsFeatured">
            {user.tagsFeatured.map((tag, index) => (
              <Link key={index} to={`posts-tag/?q=${encodeURIComponent(tag)}`}>
                <Button variant="secondary">{tag}</Button>
              </Link>
            ))}
          </div>
        )}

        {user.postFixed && <PostFixed key={PostsFixed} post={PostsFixed} />}

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

export default Profile;
