import "../../styles/main.sass";
import "../../styles/styles.sass";

import "../../styles/pages/Posts.sass";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import Menu from "@/components/Menu";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import NotFoundPage from "../NotFound";
import NoDatos from "../NoDatos";
import { Loading } from "@/components/loading";
import { Helmet } from "react-helmet";

const formSchema = z.object({
  post: z.string().min(1, {
    message: "Campo obrigatório.",
  }),
  account: z.string().optional()
});

const EditPost = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const path = useLocation().pathname.split("/")[3];

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [post, setPost] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [notDatos, setNotDatos] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDesabledButton, setIsDesabledButton] = useState(false);

  const charLimit = 500;
  const [charCount, setCharCount] = useState(0);

  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/me`);
        setUser(res.data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/posts/id/${path}`);
        const resPost = res?.data;
  
        if (resPost?.status === "on" && resPost?.type === 1 && resPost?.userId === user?._id) {
          setPost(resPost);
          setCharCount(resPost.text.length);

          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
        
        if (error.response?.status === 404) {
          setNotFound(true); // Post não encontrado
        } else {
          setNotDatos(true); // Erro geral
        }
      }
    };
  
    fetchPosts();
  }, [path, user?._id]);
  
  const generateLink = () => {
    const numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
    const uppercaseLetters = Array.from({ length: 3 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
    const lowercaseLetters = Array.from({ length: 3 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
  
    return `${uppercaseLetters}${lowercaseLetters}${numbers}`;
  };
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setIsDesabledButton(true);
  
    try {
      const shortLink = generateLink();
  
      const res = await axios.put(`/api/posts/editpost/${path}`, {
        text: data.post,
        photo: post.photo || [],
        video: post.video || null,
        videoThumb: post.videoThumb || null,
        videoRepost: post.videoRepost || null,
        liveRumble: post.liveRumble || null,
        liveRumbleImg: post.liveRumbleImg || null,
        hashtags: post.hashtags || [],
        repostId: post.repostId || null,
        petitionId: post.petitionId || null,
        repostPetition: post.repostPetition || null,
        groupId: post.groupId || "0",
        postFixed: post.postFixed || 0,
        shortLink: shortLink,
        userId: data.account || user._id,
      });

      toast(t("Publicado"), {action: {label: t("Ver"), onClick: () => navigate(`/${user.username}/post/${res.data._id}`)}})
      navigate(-1);
    } catch (error) {
      console.error('Error creating post:', error);
      setIsSubmitting(false);
      setIsDesabledButton(false);
    }
  };

  if (notFound) {
    return <NotFoundPage />;
  }

  if (notDatos) {
    return <NoDatos />;
  }

  return (
    <aside id="NewPost" className="Container noheaderMenu">
      <Loading/>
      <Menu/>

      <Helmet>
        <title>{t("Editar texto")} / Ilhanet</title>
      </Helmet>
      
      <div className="headerBack bg-1">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main">
        <form className="grid w-full gap-2" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="titleGroup"><b>{t("Editar texto")}</b></h1>

          {post.text && (<div>             
            <Textarea
              id="post"
              {...register("post")}
              defaultValue={post.text}
              onChange={(e) => setCharCount(e.target.value.length)}
              maxLength={charLimit}
            >
            </Textarea>
            <div className="detailsInput">
              <label className="error-text">
                {errors.post && <span>{t("Campo obrigatório.")}</span>}
              </label>
              <span className="countText colorWhite">{charCount}/{charLimit}</span>
            </div>
          </div>)}

          <Button type="submit" disabled={isDesabledButton}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("Salvar")}
          </Button>
        </form>

      </div>
    </aside>
  );
};

export default EditPost;
