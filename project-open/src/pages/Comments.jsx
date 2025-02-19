import "../styles/main.sass"
import "../styles/styles.sass"
import Menu from "../components/Menu";
import Comment from "../components/Comment";
import "../styles/pages/Posts.sass"

import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"

import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import NotFoundPage from "./NotFound";
import { useTranslation } from 'react-i18next';
import { Loading2 } from "@/components/loading2";
import Comment2 from "@/components/Comment2";
import ADSComponent from "@/components/ADS";
import { useQuery } from 'react-query';

const fetchUser = async () => {
  const res = await axios.get(`/api/users/me`);
  return res.data;
};

const formSchema = z.object({
  comment: z.string().min(1, {
  }),
});

const Comments = () => {
  const path = useLocation().pathname.split("/")[2];
  const { t } = useTranslation();

  const [CommentPrimary, setCommentPrimary] = useState({});
  const [Comments, setComments] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [isBlock, setIsBlock] = useState(true);

  const {currentUser} = useSelector((state) => state.user);

  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [isSubmitting2, setIsSubmitting2] = useState(false);

  useEffect(() => {
    const fetchPostP = async () => {
      try {
        const res = await axios.get(`/api/comments/${path}`);
        if (res.data && res.data.status === 'on') {
          setCommentPrimary(res.data);
          setNotFound(false);
        }
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
        if (error.response && error.response.status === 404) {
          setNotFound(true);
        }
      }
    };

    fetchPostP();
  });  

  // useQuery para buscar os dados do usuário
  const { data: user } = useQuery(
    'user', 
    fetchUser, 
    {
      enabled: !!currentUser, // Só executa se `currentUser` estiver definido
    }
  );

  const [shortLink, setShortLink] = useState([]);
  useEffect(() => {
    if (CommentPrimary.postId) {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`/api/posts/id/${CommentPrimary.postId}`);
          setShortLink(res.data.shortLink);
        } catch (error) {
          console.error("Erro ao buscar usuário:", error);
        }
      };
      fetchUser();
    }
  }, [currentUser, CommentPrimary]);
  
  useEffect(() => {
      const fetchComment = async () => {
        try {
          const res = await axios.get(`/api/comments/replys/${path}`);
          setComments(res.data);
        } catch (error) {
          console.error('Erro ao buscar comentário:', error);
        }
      };
      fetchComment();
  }, [path, CommentPrimary]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting2(true);
      await axios.post(`/api/comments/createReply/${CommentPrimary._id}`, { text: data.comment });
      if (currentUser._id !== CommentPrimary.userId) {
        await axios.post(`/api/notifications/createComment/${CommentPrimary.userId}/${CommentPrimary._id}/reply`);
      }
      
      const res = await axios.get(`/api/comments/replys/${path}`);
      setComments(res.data);
      reset();
      
      setIsSubmitting2(false);
    } catch (error) {
      console.error("Erro ao postar comentário:", error);
    }
  };  

  useEffect(() => {
    if (currentUser) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`/api/comments/userActivities/${CommentPrimary._id}`);
  
          if (res.data.blockedYou === true) {
            setIsBlock(false);
          } else {
            setIsBlock(true);
          }
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      };
      fetchPosts();
    }
  }, [currentUser, CommentPrimary]);

  const [charCount, setCharCount] = useState(0);
  const charLimit = 205;

  const [visibleCommentsCount, setVisibleCommentsCount] = useState(10);
  const [loading, setLoading] = useState(false);

  const loadMoreComments = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleCommentsCount((prevCount) => prevCount + 10);
      setLoading(false);
    }, 800); // Simulando um pequeno delay para carregar mais posts
  };

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <aside id="Posts" className="Container noheaderMenu">
      <Loading2/>

      <div className="headerBack bg-1">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main">
        <div id="Comments">
          {CommentPrimary.postId && (
            <div className="info-alert mb-2" onClick={() => navigate(`/go/${shortLink}`)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              {t("Ver post")}
            </div>
          )}

          {CommentPrimary.commentId && (
            <div className="info-alert mb-2" onClick={() => navigate(`/comment/${CommentPrimary.commentId}`)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              {t("Ver comentário")}
            </div>
          )}

          <Comment2 key={CommentPrimary._id} comment={CommentPrimary} />
        </div>
        <hr />

        <div id="Comments">
          <h1 className="title">{t("Comentários")} ({CommentPrimary.commentCount || 0})</h1>

          {currentUser && isBlock && (
            <form className="NewComment gap-2" onSubmit={handleSubmit(onSubmit)}>
              {user && user.img && (
                <img src={user.img} alt="" />
              )}

              <div className="inputComment">
                <Textarea id="comment" {...register("comment")} placeholder={t("Digite aqui.")} onChange={
                  (e) => setCharCount(e.target.value.length)
                } maxLength={charLimit} />

                <div className="flex gap-2">
                  <div className="detailsInput">
                    <span className="countText colorWhite">{charCount}/{charLimit}</span>
                  </div>

                  {isSubmitting2 ? 
                  (<div className="flex items-center col-3">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  </div>):(
                    <Button type="submit">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                      </svg>
                    </Button>
                  )}
                </div>
              </div>
            </form>
          )}

          {isBlock ? (""):(
            <div className="info-alert my-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              {t("msgBlockUserReply")}
            </div>
          )}

          {Comments === null ? (
            <span className="NoItems">{t("Nenhum comentário")}</span>
          ) : Comments.length > 0 ? (
            Comments.slice(0, visibleCommentsCount).map((comment) =>  <Comment key={comment._id} comment={comment}/> )
          ) : (
            <div className="loadingPosts py-4 col-3">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}
        </div>

        {Comments !== null && visibleCommentsCount < Comments.length && (
          <Button variant="outline" className="MoreButton col-3" onClick={loadMoreComments} disabled={loading}>
            {loading ? 
            (<Loader2 className="mr-2 h-4 w-4 animate-spin" />):(<>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
              {t("Ver mais comentários")}
            </>)}
          </Button>
        )}

        <ADSComponent/>
      </div>

      <Menu/>
    </aside>
  );
}

export default Comments;
