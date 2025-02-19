import "../styles/components/Repost.sass"
import { Link, useNavigate } from "react-router-dom";

import TimeAgo from 'react-timeago'
import ptBR from 'react-timeago/lib/language-strings/pt-br'
import en from 'react-timeago/lib/language-strings/en'
import es from 'react-timeago/lib/language-strings/es'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import moment from 'moment-timezone';
import TextOverflow from 'react-text-overflow';

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
import { Button } from "@/components/ui/button"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

import Expandable from "@/components/Expendable";
import { Numeral } from "react-numeral";
import { useEffect, useState } from "react";
import { Loader2, Pin, PinOff } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import DOMPurify from "dompurify";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "sonner";
import PetitionPost from "./PetitionPost";

const languageStrings = {
  en: en,
  ptBR: ptBR,
  es: es
};
 
const Repost = ({ post }) => {
  const {currentUser} = useSelector((state) => state.user);
  const { t } = useTranslation();
  const currentLanguage = (t("Iso2"));

  const formatter = buildFormatter(languageStrings[currentLanguage] || languageStrings.en);
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/id/${post.userId}`);
        setUser(res.data);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    };
    fetchUser();
  }, [post.userId]);

  const [isLike, setIsLike] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        if (post.groupId && post.groupId !== '0') {
          const res = await axios.get(`/api/groups/id/${post.groupId}`);
          setGroups(res.data);
        }
      } catch (error) {
        console.error("Erro ao buscar grupo:", error);
      }
    };

    fetchGroup();
  }, [post.groupId]);

  useEffect(() => {
    if (currentUser) {
      const fetchComment = async () => {
        try {
          const res = await axios.get(`/api/posts/userActivities/${post._id}`);
          if (res.data.like === true) {
            setIsLike(true);
          } else {
            setIsLike(false);
          }
  
        } catch (error) {
          console.error('Erro ao buscar comentário:', error);
        }
      };
      fetchComment();
    }
  }, [currentUser, post._id]);

  const handleLike = async () => {
    try {
      await axios.post(`/api/posts/like/${post._id}`);
      setIsLike(true);
      if (currentUser._id !== post.userId) {
        await axios.post(`/api/notifications/createPost/${post.userId}/${post._id}/like`);
      }
      setLikesCount(likesCount + 1);
    } catch (error) {
      console.error("Erro ao curtir o post:", error);
    }
  };

  const handleUnlike = async () => {
    try {
      await axios.put(`/api/posts/unlike/${post._id}
        `);
      setIsLike(false);
      setLikesCount(likesCount - 1);
    } catch (error) {
      console.error("Erro ao descurtir o post:", error);
    }
  }

  const handleRepost = async () => {
    try {
      await axios.post(`/api/posts/repost/create/${post._id}`, { type: 4 });
      toast(t("Repost feito"))
    } catch (error) {
      console.error("Erro ao repostar o post:", error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      await axios.put(`/api/posts/delete/${post._id}`);
      toast(t("Deletado"))
    } catch (error) {
      console.error("Erro ao deletar o post:", error);
    }
  }

  const handleDelete2 = async () => {
    try {
      setIsSubmitting(true);
      await axios.put(`/api/posts/deleteGroup/${post._id}`);
      toast(t("Deletado"))
    } catch (error) {
      console.error("Erro ao deletar o post:", error);
    }
  }

  const handleFixed = async () => {
    try {
      await axios.post(`/api/posts/postFixed/${post._id}`);
      toast(t("Post fixado"))
    } catch (error) {
      console.error("Erro ao fixar o post:", error);
    }
  }

  const handleUnfixed = async () => {
    try {
      await axios.post(`/api/posts/postUnfixed/${post._id}`);
      toast(t("Post fixado removido"))
    } catch (error) {
      console.error("Erro ao desfixar o post:", error);
    }
  }

  const [isBlock, setIsBlock] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const fetchPosts = async () => {
        try {
          if (post.groupId !== "0") {
            const res = await axios.get(`/api/groups/userActivities/${post.groupId}`);
  
            if (res.data.blockedYou === true) {
              setIsBlock(false);
            } else {
              setIsBlock(true);
            }
          }
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      };
      fetchPosts();
    }
  }, [currentUser, post]);

  const postText = DOMPurify.sanitize(post.text);

  const [repost, setRepost] = useState([]);

  useEffect(() => {
    if (post.repostId) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`/api/posts/pub/${post.repostId}`);
          setRepost(res.data);
        } catch (error) {
          console.error("Erro ao buscar posts:", error);
        }
      };
      fetchPosts();
    }
  }, [post.repostId]);

  const [petition, setPetition] = useState([]);

  useEffect(() => {
    if (post.petitionId) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`/api/petitions/pub/${post.petitionId}`);
          setPetition(res.data);
        } catch (error) {
          console.error("Erro ao buscar posts:", error);
        }
      };
      fetchPosts();
    }
  }, [post.petitionId]);

  const handleBlock = async () => {
      try {
        await axios.post(`/api/groups/blockUser/${groups._id}/${post.userId}`);
        setIsBlock(true);
        toast(t("Usuário bloqueado"))
      } catch (error) {
        console.error("Erro ao bloquear usuário:", error);
      }
  };

  const handleUnblock = async () => {
      try {
        await axios.put(`/api/groups/unblockUser/${groups._id}/${post.userId}`);
        setIsBlock(false);
        toast(t("Usuário desbloqueado"))
      } catch (error) {
        console.error("Erro ao desbloquear usuário:", error);
      }
  }

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

  const timezoneDefault = 'America/Sao_Paulo';

  const [dateFormat, setDate1] = useState('');

  useEffect(() => {
      const formattedDate = moment(post.createdAt).tz(timezone || timezoneDefault).format('DD, MMMM, YYYY HH:mm');
      setDate1(formattedDate);
  }, [timezone, post.createdAt]);

  const [date, setDate2] = useState('');

  useEffect(() => {
      const formattedDate = moment(post.createdAt).tz(timezone || timezoneDefault);
      setDate2(formattedDate);
  }, [timezone, post.createdAt]);

  return (
    <div id="Repost">
      {post === null ? (
        <div className="postUn col-2">
          <p>{t("Post não disponível")}</p>
        </div>
      ) : post.status === "on" ? (
        <>
          <Link to={user && user.username && `/${user.username}/post/${post._id}`}>
            <div className="headerPost">  
              <div className="fx-1">      
                <HoverCard>
                  <HoverCardTrigger>
                    <Link to={`/${user.username}`}>
                      <img src={user.img} alt="" />

                      <div className="hpDetails col-1">
                        <div className="Username">
                          <span><TextOverflow text={user.name} /></span>

                          {user.verified === 1 ? (
                            <svg className="verified1 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                            </svg>
                          ):("")}
                        </div>
          
                        <span className="flex items-center">@<TextOverflow text={user.username} /></span>
                      </div>
                    </Link>
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
              </div>

              <Link to="#">
                <DropdownMenu>
                  <DropdownMenuTrigger className="col-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {currentUser &&
                      post.userId === currentUser._id && (
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

                    {currentUser &&
                      groups.userId === currentUser._id && 
                      post.userId !== currentUser._id &&
                      (
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
                                  {t("Esta ação não poderá ser desfeita")}.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button onClick={handleDelete2} type="submit" variant="destructive" disabled={isSubmitting}>
                                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  {t("Deletar")}
                                </Button>
                              </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuItem>
                    )}

                    {currentUser && post.groupId < 1 &&
                      post.userId === currentUser._id && 
                      post.type === 3 && (
                      <Link to={`/u/editarticle/${post._id}`}>
                        <DropdownMenuItem>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                          </svg>
                          {t("Editar artigo")}
                        </DropdownMenuItem>
                      </Link>
                    )}

                    {currentUser && 
                      groups.userId === currentUser._id && 
                      post.userId !== currentUser._id &&
                      (isBlock ? (
                        <DropdownMenuItem onClick={handleUnblock}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                          </svg>
                          {t("Debloquear usuário de grupo")}
                        </DropdownMenuItem>
                      ):(
                        <DropdownMenuItem onClick={handleBlock}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                          </svg>
                          {t("Bloquear usuário de grupo")}
                        </DropdownMenuItem>
                    ))}

                    {currentUser && post.groupId < 1 &&
                      post.userId === currentUser._id && (
                      post.postFixed === 1  ? (
                        <DropdownMenuItem onClick={handleUnfixed}>
                          <PinOff className="w-6 h-6" strokeWidth={1.5} />
                          {t("Desfixar post")}
                        </DropdownMenuItem>
                      ):(
                        <DropdownMenuItem onClick={handleFixed}>
                          <Pin className="w-6 h-6" strokeWidth={1.5} />
                          {t("Fixar post")}
                        </DropdownMenuItem>
                      )
                    )}

                    <CopyToClipboard text={`https://ilhanet.com/go/${post.shortLink}`}>
                      <DropdownMenuItem>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                        </svg>
                        {t("Copiar link")}
                      </DropdownMenuItem>
                    </CopyToClipboard>

                    {currentUser && currentUser._id === post.userId ? (""):(
                      <Link to={`/report/post/${post._id}`}>
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
              </Link>
            </div>

            {post.text && (post.type === 1) && (
              <Expandable>
                {postText}
              </Expandable>
            )}

            {post.type === 2 && (
              <div className="liveRumble">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="col-2" width="40" height="40" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M14.453 13.546a1.88 1.88 0 0 0 .275-2.645a2 2 0 0 0-.275-.275A21.2 21.2 0 0 0 10.14 7.85c-1.066-.51-2.256.2-2.426 1.414a23.5 23.5 0 0 0-.14 5.502c.116 1.23 1.292 1.964 2.372 1.492a19.6 19.6 0 0 0 4.506-2.704zm6.932-5.4a5.85 5.85 0 0 1 .014 7.872a26.15 26.15 0 0 1-13.104 7.828a5.116 5.116 0 0 1-6.167-3.578c-1.524-5.2-1.3-11.08.17-16.305C3.07 1.22 5.651-.503 8.308.131c4.925 1.174 9.545 4.196 13.077 8.013z"/>
                  </svg>
                </div>

                <div className="flex flex-col">
                  <div className="buttonLive bor-2">{t("LIVE")}</div>
                  <h1>{postText}</h1>
                </div>
              </div>
            )}

            {post.type === 3 && (
              <div className="Article">
                <h1>{post.titleArticle}</h1>
                {post.subtitleArticle && <h2 className="col-2">{post.subtitleArticle}</h2>}

                <div className="textArticle" dangerouslySetInnerHTML={{ __html: postText}} />
                <div className="button col-3">{t("Ver artigo")}</div>
              </div>
            )}

            {post.videoThumb && post.videoThumb.length > 0 && (
              <div className="video-gallery">
                {post.videoThumb.map((thumbnailUrl, index) => (
                  <div key={index} className="pVideo">
                    <div className="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="thumbnail">
                      <img src={thumbnailUrl} alt={`Thumbnail ${index}`} className="thumbImage" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {post.photo && post.photo[0] && (
              <div className="photo-gallery">
                {post.photo[1] && (
                  <div className="photoCounter">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    <span>{post.photo.length} fotos</span>
                  </div>
                )}
                <div alt={`Photo 1`} className="imgPost2" style={{ backgroundImage: `url(${post.photo[0]})` }}></div>
              </div>
            )}
          </Link>

          {post.petitionId && (
            <PetitionPost key={petition._id} post={petition} />
          )}

          {post.repostId && (
            <Repost key={repost._id} post={repost} />
          )}

          <div className="postFooter col-2">
            {currentUser ? (
              isLike ? (
                <div onClick={handleUnlike} className="pfItem pfItem2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                  <Numeral value={post.likesCount} format={"0,0"} />
                </div>
              ) : (
                <div onClick={handleLike} className="pfItem pfItem2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                  <Numeral value={post.likesCount} format={"0,0"} />
                </div>
              )
            ):(
              <div onClick={() => navigate(`/auth/login`)} className="pfItem pfItem2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                <Numeral value={post.likesCount} format={"0,0"} />
              </div>
            )}

            {!post.repostId && (currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="pfItem pfItem2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                    </svg>

                    <Numeral value={post.repostCount} format={"0,0"} />
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
                    <DropdownMenuItem onClick={() => navigate(`/repost?q=${post._id}`)}>
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

            <Link to={`/${user.username}/post/${post._id}`}>
              <div className="flex gap-1">
                <div className="pfItem pfItem2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                  </svg>

                  <Numeral value={post.commentCount || 0} format={"0,0"}/>
                </div>

                <div className="pfItem">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>

                  {date && <TimeAgo date={date} title={dateFormat} formatter={formatter} />}
                </div>
              </div>
            </Link>
          </div>
        </>
      ) : (
        <div className="loadingPosts2 py-1 col-3">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

    </div>
  );
}

export default Repost;
