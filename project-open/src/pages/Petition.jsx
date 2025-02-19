import "../styles/main.sass"
import "../styles/styles.sass"
import Menu from "../components/Menu";
import "../styles/components/Comment.sass"
import "../styles/pages/Posts.sass";
import "../styles/pages/Petition.sass";

import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from 'moment-timezone';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup
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

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button"

import { Loading } from "@/components/loading";

import imgX from "../img/x-social.svg"
import { useEffect, useState } from "react";
import TextOverflow from "react-text-overflow";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { Numeral } from "react-numeral";
import { useSelector } from "react-redux";
import NotFoundPage from "./NotFound";
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import {Quill} from 'react-quill';

import NoDatos from "./NoDatos";
import { Helmet } from "react-helmet";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import ADSComponent from "@/components/ADS";

const Petition = () => {
  const path = useLocation().pathname.split("/")[2];
  const { t } = useTranslation();

  const [petition, setPetition] = useState({});
  const [user, setUser] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [notDatos, setNotDatos] = useState(false);

  const {currentUser} = useSelector((state) => state.user);

  const navigate = useNavigate();

  const Link1 = Quill.import('formats/link');
  Link1.sanitize = (url) => {
    let anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    return anchor.href;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/petitions/id/${path}`);
        if (res.data && res.data.status === 'on') {
          setPetition(res.data);
          setNotFound(false);
        }
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
        if (error.response && error.response.status === 404) {
          setNotFound(true);
        }

        if (error.response && error.response.status === 500) {
          setNotDatos(true);
        }
      }
    };

    if (path) {
      fetchPosts();
    }
  }, [path]);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/id/${petition.userId}`);
        setUser(res.data);  
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };
    fetchUser();
  }, [petition.userId]);

  const [isLike, setIsLike] = useState(false);
  const [likesCount, setLikesCount] = useState(petition.likesCount);

  useEffect(() => {
    if (currentUser) {
      const fetchComment = async () => {
        try {
          const res = await axios.get(`/api/petitions/userActivities/${path}`);
          if (res.data.like === true) {
            setIsLike(true);
          } else {
            setIsLike(false);
          }

          if (res.data.signed === true) {
            setIsSign(true);
          } else {
            setIsSign(false);
          }  
        } catch (error) {
          console.error('Erro ao buscar comentário:', error);
        }
      };
      fetchComment();
    }
  }, [currentUser, path]);

  const handleLike = async () => {
    try {
      await axios.post(`/api/petitions/like/${petition._id}`);
      if (currentUser._id !== petition.userId) {
        await axios.post(`/api/notifications/createPost/${petition.userId}/${petition._id}/like`);
      }
      setIsLike(true);
      setLikesCount(likesCount + 1);
    } catch (error) {
      console.error("Erro ao curtir o post:", error);
    }
  };

  const handleUnlike = async () => {
    try {
      await axios.put(`/api/petitions/unlike/${petition._id}`);
      setIsLike(false);
      setLikesCount(likesCount - 1);
    } catch (error) {
      console.error("Erro ao descurtir o post:", error);
    }
  }

  /*** */
  const [isSign, setIsSign] = useState(false);
  const [signCount, setSignCount] = useState(petition.signaturesCount);

  const handleSign = async () => {
    try {
      setIsSubmitting2(true);
      const res = await axios.post(`/api/petitions/sign/${petition._id}`);
      setIsSign(true);
      setSignCount(signCount + 1);
      setPetition(res.data);

      setIsSubmitting2(false);
    } catch (error) {
      console.error("Erro ao curtir o post:", error);
    }
  };

  const handleUnsign = async () => {
    try {
      setIsSubmitting(true);
      const res = await axios.put(`/api/petitions/unsign/${petition._id}`);
      setPetition(res.data);
      setIsSign(false);
      setSignCount(signCount - 1);
      setIsSubmitting(false);
      handleEscPress()
    } catch (error) {
      console.error("Erro ao descurtir o post:", error);
    }
  }

  /** */
  const handleDelete = async () => {
      try {
        setIsSubmitting(true);
        await axios.put(`/api/petitions/delete/${petition._id}`);
        setTimeout(() => {
          navigate(-1);
        }, 800);
      } catch (error) {
        console.error("Erro ao deletar o post:", error);
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitting2, setIsSubmitting2] = useState(false);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift(); // Retorna o valor do cookie
    }
    return null; // Cookie não encontrado
  }
  
  const timezone = getCookie('in_timezone');
  if (!timezone) {
    const defaultTimezone = 'America/Sao_Paulo';
    document.cookie = `in_timezone=${defaultTimezone}; expires=365; path=/`;
  }

  const [date, setDate] = useState('');

  useEffect(() => {
      const formattedDate = moment(petition.createdAt).tz(timezone).format('DD, MMMM, YYYY HH:mm');
      setDate(formattedDate);
  }, [petition.createdAt, timezone]);

  const [dateUpdate, setDateUpdate] = useState('');

  useEffect(() => {
    const formattedDate = moment(petition.updatedAt).tz(timezone).format('DD, MMMM, YYYY HH:mm');
    setDateUpdate(formattedDate);
  }, [timezone, petition.updatedAt]);

  const [userLogin, setUserLogin] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (petition.userId === currentUser._id) {
        setUserLogin(true);
      } else {
        setUserLogin(false);
      }
    }
  }, [currentUser, petition]);

  const handleRepost = async () => {
    try {
      await axios.post(`/api/petitions/repost/create/${petition._id}`, { type: 4 });
      toast(t("Repost feito"))
    } catch (error) {
      console.error("Erro ao repostar o post:", error);
    }
  };

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank');
    }
  });

  const sanitizedHTML = DOMPurify.sanitize(petition.text);

  function calcularPorcentagem(valueSign, goalSign) {
    return (valueSign / goalSign) * 100;
  }

  const valueSign = petition.signaturesCount;
  const goalSign = petition.goal;
  const porcentagem = calcularPorcentagem(valueSign, goalSign);

  const handleEscPress = () => {
    const escEvent = new KeyboardEvent('keydown', {
      key: 'Escape', // A tecla "Esc" equivale a 'Escape'
      code: 'Escape',
      keyCode: 27, // Código da tecla "Esc"
      which: 27
    });
    document.dispatchEvent(escEvent); // Dispara o evento no documento
  };
    
  if (notFound) {
    return <NotFoundPage />;
  }

  if (notDatos) {
    return <NoDatos />;
  }

  return (
    <aside id="Posts" className="Container ArticlePost noheaderMenu">
      <Loading/>

      {petition && petition.title && <Helmet>
        <title>{petition.title} - Petição / Ilhanet</title>
      </Helmet>}

      <div className="headerBack bg-1">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main">
        <div id="Post">
          <div className="headerPost">  
            <div className="fx-1">      
              <Link to={`/${user.username}`}>
                <img src={user.img} alt="" />

                <div className="hpDetails col-1">
                  <div className="Username">
                    <TextOverflow text={user.name} />

                    {user.verified === 1 ? (
                      <svg className="verified1 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                      </svg>
                    ):("")}
                  </div>
    
                  <span className="flex items-center">@<TextOverflow text={user.username} /></span>
                </div>
              </Link>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="col-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {userLogin && (
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
                            <DialogTitle>{t("Deseja mesmo remover este post?")}</DialogTitle>
                            <DialogDescription>
                              {t("Esta ação não poderá ser desfeita.")}
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

                {userLogin && (
                  <Link to={`/u/editpetition/${petition._id}`}>
                    <DropdownMenuItem>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                      {t("Editar petição")}
                    </DropdownMenuItem>
                  </Link>
                )}

                {currentUser && (isSign ? (
                  <DropdownMenuItem asChild>
                    <AlertDialog>
                      <AlertDialogTrigger className="buttonDialogDrop" asChild>
                        <button className="buttonDrop flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                          </svg>
                          {t("Remover assinatura")}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t("Remover assinatura")}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("Deseja mesmo remover sua assinatura?")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("Cancelar")}</AlertDialogCancel>
                          <Button disabled={isSubmitting} onClick={handleUnsign}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t("Continuar")}
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuItem>
                ):(""))}

                {currentUser && currentUser._id === petition.userId ? (""):(
                  <Link to={`/report/petition/${petition._id}`}>
                    <DropdownMenuItem>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                      </svg>
                      {t("Denunciar")}
                    </DropdownMenuItem>
                  </Link>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="Petition">
            <h1>{petition.title}</h1>

            <div className="pfDateTime col-2">{t("Publicado em")} {date}</div>

            <div className="buttonSign">
              {currentUser && (isSign ? (
                <Button className="signed bor-1 col-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  {t("Assinado")}
                </Button>
              ):(
                <Button onClick={handleSign} disabled={isSubmitting2}>
                  {isSubmitting2 && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("Assinar")}
                </Button>
              ))}

              {!currentUser && (
                <Button onClick={() => navigate(`/auth/login`)}>{t("Assinar")}</Button>
              )}
            </div>

            {valueSign > goalSign ? (
              <Progress className="progress mt-5" value={100} />
            ):(
              <Progress className="progress mt-5" value={porcentagem} />
            )}

            <div className="CounterPetition">
              <div className="Item col-3">
                <div className="h1Style"><Numeral value={petition.signaturesCount || "0"} format={"0,0"} /></div>
                <span>{t("Assinatura(s)")}</span>
              </div>

              <div className="Item items-right">
                <div className="h1Style"><Numeral value={petition.goal || "0"} format={"0,0"} /></div>
                <span className="col-2">{t("Meta")}</span>
              </div>
            </div>
            
            {petition.photo && petition.photo.length > 0 && (
              <div className="photo-gallery">
                {petition.photo.map((photo, index) => (
                  <div key={index}>
                    <img src={photo} alt={`Photo ${index}`} className="imgPost" />
                  </div>
                ))}
              </div>
            )}

            <div className="buttonShareX flex gap-3 mb-2">
              <Link target="_blank" to={`https://x.com/intent/post?url=https://ilhanet.com/go/${petition.shortLink}&text=${petition.title}%0A%0A`}>
                <img src={imgX} alt="" />
                {t("Compartilhar")}
              </Link>
            </div>

            <div className="postFooter">
              {currentUser ? (
                isLike ? (
                  <div onClick={handleUnlike} className="pfItem pfItem2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                    <Numeral value={petition.likesCount} format={"0,0"} />
                  </div>
                ) : (
                  <div onClick={handleLike} className="pfItem pfItem2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                    <Numeral value={petition.likesCount} format={"0,0"} />
                  </div>
                )
              ):(
                <div onClick={() => navigate(`/auth/login`)} className="pfItem pfItem2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                  <Numeral value={petition.likesCount} format={"0,0"} />
                </div>
              )}

              {!petition.repostId && (currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="pfItem pfItem2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                      </svg>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-50" align="start">
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={handleRepost}>
                        <span className="flex gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                          </svg>
                          {t("Repostar")}
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/repost/petition?q=${petition._id}`)}>
                        <span className="flex gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                          {t("Repostar e comentar")}
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              ):(
                <div onClick={() => navigate(`/auth/login`)} className="pfItem pfItem2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                  </svg>
                </div>
              ))}

            </div>

            {petition.text &&
              <div className="textArticle" dangerouslySetInnerHTML={{ __html: sanitizedHTML}} />
            }
          </div>

          <div className="postFooter2 col-2">
            {petition.updatedAt && <div className="pfDateTime col-2">{t("Editado em")} {dateUpdate}</div>}
          </div>
        </div>
        
        <ADSComponent/>
      </div>

      <Menu/>
    </aside>
  );
}

export default Petition;
