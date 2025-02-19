import "../../styles/main.sass"
import "../../styles/styles.sass"

import "../../styles/components/Repost.sass"
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { Loading } from "@/components/loading";
import NotFoundPage from "../NotFound";
import { useTranslation } from 'react-i18next';
import NoDatos from "../NoDatos";
import Menu from "@/components/Menu";
import TextOverflow from "react-text-overflow";
import Expandable from "@/components/Expendable";
import DOMPurify from "dompurify";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  post: z.string().min(1, {
    message: "Campo obrigatório.",
  }),
});

const RepostPage = () => {
  const { search } = window.location;
  const searchTerm = new URLSearchParams(search).get('q');

  const { t } = useTranslation();  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [notDatos, setNotDatos] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [post, setPost] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
          const res = await axios.get(`/api/posts/id/${searchTerm}`);
          if (res.data) {
            setPost(res.data);
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
    fetchPosts();
  });

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

  const [user1, setUser1] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/me`);
        setUser1(res.data);

      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };
    fetchUser();
  }, []);

  const [isBlock, setIsBlock] = useState(false);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await axios.get(`/api/posts/userActivities/${post._id}`);
        if (res.data.blockedYou === true) {
          setIsBlock(true);
        } else {
          setIsBlock(false);
        }  
      } catch (error) {
        console.error('Erro ao buscar comentário:', error);
      }
    };
    fetchComment();
  }, [post._id]);

  const postText = DOMPurify.sanitize(post.text);

  const generateLink = () => {
    const numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
    const uppercaseLetters = Array.from({ length: 3 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
    const lowercaseLetters = Array.from({ length: 3 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
  
    return `${uppercaseLetters}${lowercaseLetters}${numbers}`;
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const shortLink = generateLink();

      const res = await axios.post(`/api/posts/repost/create/${post._id}`, { text: data.post, shortLink: shortLink, hashtags: tags, type: 1 });
      toast(t("Repost feito"), {action: {label: t("Ver"), onClick: () => navigate(`/${user1.username}/post/${res.data._id}`)}})
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (error) {
      console.error("Erro ao postar post:", error);
    }
  };

  const [charCount, setCharCount] = useState(0);
  const charLimit = 280;

  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Função para adicionar uma tag
  const handleKeyDown = (e) => {
    if (e.key === ' ' && inputValue.trim() !== '') {
      // Impedir duplicatas
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue(''); // Limpa o campo de input
    }
  };

  // Função para remover uma tag
  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  if (notDatos) {
    return <NoDatos />;
  }

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <aside id="NewPost" className="Container NoMenu noheaderMenu">
      <Loading/>
      <Menu/>

      <div className="headerBack bg-1">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main">
        {isBlock ? (
          <div className="w-full px-3 py-1">
            <div className="info-alert">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <div>{t("msgBlockUserRepost")}</div>
            </div>
          </div>
        ):(
          <form className="grid w-full" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="titleGroup">{t("Repostar")}</h1>

            <div>
              <Textarea id="post" {...register("post")} placeholder="Digite aqui." onChange={
                (e) => setCharCount(e.target.value.length)
              } maxLength={charLimit}/>
              <div className="detailsInput">
                <label className="error-text">{errors.post && <span>{errors.post.message}</span>}</label>
                <span className="countText colorWhite">{charCount}/{charLimit}</span>
              </div>
            </div>

            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>{t("Tags")}</AccordionTrigger>
                <AccordionContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    {t("msgAddTags")}
                  </p>

                  <div className="tag-container">
                    <Input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <ul className="tag-list">
                      {tags.map((tag, index) => (
                        <li key={index} className="tag">
                          {tag}
                          <span className="tag-close" onClick={() => removeTag(index)}>
                            &times;
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("Postar")}
            </Button>

            <hr/>

            <div className="w-full">
              <div id="Repost">
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
                </div>

                {(post.type === 1 || post.type === 2) && (
                  <Expandable>
                    {postText}
                  </Expandable>
                )}

                {post.type === 3 && (
                  <div className="Article">
                    <h1>{post.titleArticle}</h1>
                    {post.subtitleArticle && <h2 className="col-2">{post.subtitleArticle}</h2>}

                    <div className="textArticle" dangerouslySetInnerHTML={{ __html: postText}} />
                    <div className="button cursorDefault col-3">{t("Ver artigo")}</div>
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
              </div>
            </div>
          </form>          
        )}
      </div>
    </aside>
  );
}

export default RepostPage;
