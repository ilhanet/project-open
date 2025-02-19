import "../styles/components/Comment2.sass"; 
import {Link} from "react-router-dom";
import Photo from "../img/user.png";

import TextOverflow from 'react-text-overflow';
import { useTranslation } from "react-i18next";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import Linkify from 'react-linkify';

const CommentChat = () => {
    const {currentUser} = useSelector((state) => state.user);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { t } = useTranslation();

    const handleDelete = async () => {
        try {
          setIsSubmitting(true);
          await axios.put(`/api/posts/delete/${123}`);
          toast(t("Deletado"))
        } catch (error) {
            setIsSubmitting(false);
            console.error("Erro ao deletar o post:", error);
        }
    }

    const [isBlock, setIsBlock] = useState(false);

    const handleBlock = async () => {
        try {
        //   await axios.post(`/api/groups/blockUser/${123}`);
          setIsBlock(true);
          toast(t("Usuário bloqueado"))
        } catch (error) {
          console.error("Erro ao bloquear usuário:", error);
        }
    };
  
    const handleUnblock = async () => {
        try {
        //   await axios.put(`/api/groups/unblockUser/${123}`);
          setIsBlock(false);
          toast(t("Usuário desbloqueado"))
        } catch (error) {
          console.error("Erro ao desbloquear usuário:", error);
        }
    }
  
    const optionsLink = {
      formatHref: {
        hashtag: (href) => "/search/posts?q=%23" + href.substr(1),
        mention: (href) => "/" + href.substr(1)
      },
    };

    const postText = "Nisi sint proident anim reprehenderit laboris esse sunt laborum quis laboris. Consectetur consectetur cillum ut reprehenderit enim mollit dolor anim excepteur commodo. Est nisi irure irure elit. https://www.google.com"
  
    return (
        <div className="Container">
            <div className="Avatar">
                <Link target="_blank" rel="noopener"to="/user/JoeDoe">
                    <img src={Photo} alt="" /> 
                </Link>
            </div>

            <div className="Details">
                <div className="flex">
                    <div className="Name">
                        <Link target="_blank" rel="noopener"to="/user/JoeDoe">
                            <TextOverflow text="Joe Doe" />

                            <svg className="verified1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                            </svg>

                            <span className="User col-2">@JoeDoe</span>
                        </Link>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="col-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {/* {currentUser &&
                            post.userId === currentUser._id && ( */}
                            <DropdownMenuItem onClick={handleDelete} disabled={isSubmitting}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                {t("Deletar")}
                            </DropdownMenuItem>
                            {/* )} */}

                            {/* {currentUser && 
                                post.userId !== currentUser._id && */}
                                {isBlock ? (
                                    <DropdownMenuItem onClick={handleUnblock}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.9} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                    </svg>
                                    {t("Debloquear usuário")}
                                    </DropdownMenuItem>
                                ):(
                                    <DropdownMenuItem onClick={handleBlock}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.9} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                    </svg>
                                    {t("Bloquear usuário")}
                                    </DropdownMenuItem>
                                )}
                            {/* )} */}


                            {/* {currentUser && currentUser._id === post.userId ? (""):( */}
                                <Link to={`/report/user/${123}`}>
                                    <DropdownMenuItem>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
                                    </svg>
                                    {t("Denunciar")}
                                    </DropdownMenuItem>
                                </Link>
                            {/* )} */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                
                <Linkify options={optionsLink} componentDecorator={(decoratedHref, decoratedText, key) => (
                    <a href={decoratedHref} key={key} target="_blank">
                        {decoratedText}
                    </a>
                    )}>
                    <p className="Text">
                        {`${postText}`}
                    </p>
                </Linkify>

                <span className="msg-delete col-2">{t("Mensagem deletada.")}</span>
            </div>
        </div>
    )
}

export default CommentChat;