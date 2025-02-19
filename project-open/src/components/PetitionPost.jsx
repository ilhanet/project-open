import "../styles/components/Repost.sass"
import { Link, useNavigate } from "react-router-dom";

import { Numeral } from "react-numeral";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { Progress } from "./ui/progress";
import TextOverflow from "react-text-overflow";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu"

import { Loader2 } from "lucide-react";

const PetitionPost = ({ post }) => {
  const {currentUser} = useSelector((state) => state.user);
  const { t } = useTranslation();

  const navigate = useNavigate();

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

  useEffect(() => {
    if (currentUser) {
      const fetchComment = async () => {
        try {
          const res = await axios.get(`/api/petitions/userActivities/${post._id}`);
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
  }, [currentUser, post]);

  const handleLike = async () => {
    try {
      await axios.post(`/api/petitions/like/${post._id}`);
      setIsLike(true);
      setLikesCount(likesCount + 1);
    } catch (error) {
      console.error("Erro ao curtir o post:", error);
    }
  };

  const handleUnlike = async () => {
    try {
      await axios.put(`/api/petitions/unlike/${post._id}
        `);
      setIsLike(false);
      setLikesCount(likesCount - 1);
    } catch (error) {
      console.error("Erro ao descurtir o post:", error);
    }
  }

  const handleRepost = async () => {
    try {
      await axios.post(`/api/petitions/repost/create/${post._id}`, { type: 4 });
      toast(t("Repost feito"))
    } catch (error) {
      console.error("Erro ao repostar o post:", error);
    }
  };

  function calcularPorcentagem(valueSign, goalSign) {
    return (valueSign / goalSign) * 100;
  }

  const valueSign = post.signaturesCount;
  const goalSign = post.goal;
  const porcentagem = calcularPorcentagem(valueSign, goalSign);

  return (
    <div id="Repost" className="bg-1">
      {post === null ? (
        <div className="postUn col-2">
          <p>{t("Post não disponível")}</p>
        </div>
      ) : post.status === "on" ? (
        <>
          <Link to={`/petition/${post._id}`}>
            <div className="headerPost">  
              <div className="fx-1">      
                <Link to={`/${user.username}`}>
                  <img src={user.img} alt="" />

                  <div className="hpDetails col-1">
                    <div className="Username">
                      <span>{user.name}</span>

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
            </div>

            <div className="Petition">
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

              <div className="Details">
                <h1>{post.title}</h1>
              </div>

              {valueSign > goalSign ? (
                <Progress className="progress mt-2" value={100} />
              ):(
                <Progress className="progress mt-2" value={porcentagem} />
              )}

              <div className="CounterPetition">
                <div className="Item col-3">
                  <div className="h1Style"><Numeral value={post.signaturesCount || "0"} format={"0,0"} /></div>
                  <span>{t("Assinatura(s)")}</span>
                </div>

                <div className="Item items-right">
                  <div className="h1Style"><Numeral value={post.goal || "0"} format={"0,0"} /></div>
                  <span className="col-2">{t("Meta")}</span>
                </div>
              </div>
            </div>
          </Link>

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

            {currentUser ? (
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
                    <DropdownMenuItem onClick={() => navigate(`/repost/petition?q=${post._id}`)}>
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
            )}
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

export default PetitionPost;
