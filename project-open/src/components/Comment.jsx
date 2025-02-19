import "../styles/main.sass"
import "../styles/styles.sass"
import "../styles/components/Comment.sass"

import { Link, useNavigate } from "react-router-dom";

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
import { Button } from "@/components/ui/button"  

import ReactTimeago from "react-timeago";
import ptBR from 'react-timeago/lib/language-strings/pt-br'
import en from 'react-timeago/lib/language-strings/en'
import es from 'react-timeago/lib/language-strings/es'
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { Numeral } from "react-numeral";
import TextOverflow from "react-text-overflow";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { useTranslation } from 'react-i18next';
import Expandable from "./Expendable";
import DOMPurify from "dompurify";
import { toast } from "sonner";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

const languageStrings = {
  en: en,
  ptBR: ptBR,
};

const Comment = ({ comment }) => {
    const {currentUser} = useSelector((state) => state.user);
    const { t } = useTranslation();
    const currentLanguage = (t("Iso2"));
  
    const formatter = buildFormatter(languageStrings[currentLanguage] || languageStrings.en);
  
    const navigate = useNavigate();

    const [user, setUser] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const res = await axios.get(`/api/users/id/${comment.userId}`);
            setUser(res.data);
          } catch (error) {
            console.error('Erro ao buscar usuário:', error);
          }
        };
        fetchUser();
      }, [comment.userId]);
  
      const [isLike2, setIsLike2] = useState(false);
      const [likesCount2, setLikesCount2] = useState(comment.likesCount);
    
    useEffect(() => {
      if (currentUser) {
        const fetchComment = async () => {
          try {
            const res = await axios.get(`/api/comments/userActivities/${comment._id}`);
            if (res.data.like === true) {
              setIsLike2(true);
            } else {
              setIsLike2(false);
            }
    
          } catch (error) {
            console.error('Erro ao buscar comentário:', error);
          }
        };
        fetchComment();
      }
    }, [currentUser, comment._id]);
    
    const commentText = DOMPurify.sanitize(comment.text);

    const [commentsCount, setCommentsCount] = useState([]);

    useEffect(() => {
      const fetchComment = async () => {
        try {
          const res = await axios.get(`/api/comments/replys/${comment._id}`);
          setCommentsCount(res.data);
        } catch (error) {
          console.error('Erro ao buscar comentário:', error);
        }
      };
      fetchComment();
    }, [comment]);    
    
    const handleLike2 = async () => {
      try {
        await axios.post(`/api/comments/like/${comment._id}`);
        setIsLike2(true);
        if (currentUser._id !== comment.userId) {
          await axios.post(`/api/notifications/createComment/${comment.userId}/${comment._id}/commentlike`);
        }
        setLikesCount2(likesCount2 + 1);
      } catch (error) {
        console.error("Erro ao curtir o post:", error);
      }
    };
  
    const handleUnlike2 = async () => {
      try {
        await axios.put(`/api/comments/unlike/${comment._id}`);
        setIsLike2(false);
        setLikesCount2(likesCount2 - 1);
      } catch (error) {
        console.error("Erro ao descurtir o post:", error);
      }
    }  

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isAvailable, setIsAvailable] = useState(true);

    const handleDelete = async () => {
        try {
          setIsSubmitting(true);
          await axios.put(`/api/comments/delete/${comment._id}`);
          setTimeout(() => {
            setIsAvailable(false)
          }, 800);
          toast(t("Deletado"))    
        } catch (error) {
          console.error("Erro ao deletar o post:", error);
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
    
    const [dateFormat, setDate1] = useState('');

    useEffect(() => {
        const formattedDate = moment(comment.createdAt).tz(timezone).format('DD, MMMM, YYYY HH:mm');
        setDate1(formattedDate);
    }, [timezone, comment.createdAt]);

    const [date, setDate2] = useState('');

    useEffect(() => {
        const formattedDate = moment(comment.createdAt).tz(timezone);
        setDate2(formattedDate);
    }, [timezone, comment.createdAt]);

    const [isSubmitting2, setIsSubmitting2] = useState(true);

    useEffect(() => {
      setTimeout(() => {
        setIsSubmitting2(false);
      }, 2800);
    });
  
  return (isAvailable && (
      <div className="Comment col-1">
          <Link to={`/${user.username}`}>
              <img src={user.img} alt="" />
          </Link>

          <div className="Details">
              <div className="flex items-center">
                  <div className="Username fx1">
                    <Link to={`/${user.username}`}>
                      <HoverCard>
                        <HoverCardTrigger>
                          <div className="Username">
                            <h1><TextOverflow text={user.name} /></h1>

                            {user.verified === 1 ? (
                                <svg className="verified1 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                </svg>
                            ):("")}

                            <span className="flex items-center">@<TextOverflow text={user.username} /></span>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          {user && user.name ? (
                            <Link to={`/${user.username}`}>
                              <div className="flex">
                                <img src={user.img} alt="" />

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
                  </div>

                  {currentUser &&
                  comment.userId === currentUser._id && (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="col-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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
                                      <DialogTitle>{t("Deseja mesmo remover este comentário?")}</DialogTitle>
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
                        </DropdownMenuContent>
                    </DropdownMenu>
                  )}
              </div>

              <div className="col-2 text">
              {isSubmitting2 ? (<Loader2 className="mr-2 h-4 w-4 col-3 animate-spin" />) : ( 
                <Expandable>
                  {commentText}
                </Expandable>
              )}
              </div>


              <div className="commentFooter col-2">
                  {currentUser ? (
                      isLike2 ? (
                          <div onClick={handleUnlike2} className="Item">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                            </svg>
                            <Numeral value={comment.likesCount} format={"0,0"} />
                          </div>
                      ) : (
                          <div onClick={handleLike2} className="Item">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                            <Numeral value={comment.likesCount} format={"0,0"} />
                          </div>
                      )
                      ):(
                      <div className="Item" onClick={() => navigate(`/auth/login`)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        <Numeral value={comment.likesCount} format={"0,0"} />
                      </div>
                  )}
                  
                  <div className="Item" onClick={() => navigate(`/comment/${comment._id}`)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                    </svg>
                    <Numeral value={commentsCount === null ? (0):(commentsCount.length)} format={"0,0"}/>
                  </div>

                  <div className="gap-1 flex">
                    <div className="Item cursorDefault">
                      {date && <ReactTimeago date={date} title={dateFormat} formatter={formatter} />}
                    </div>
                  </div>
              </div>
          </div>
      </div>
    )
  );
}

export default Comment;
