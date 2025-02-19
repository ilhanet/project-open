import "../../styles/main.sass"
import "../../styles/styles.sass"

import "../../styles/components/Repost.sass"
import { useNavigate } from "react-router-dom";

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
import { toast } from "sonner";
import PetitionPost from "@/components/PetitionPost";

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

const RepostPetition = () => {
  const { search } = window.location;
  const searchTerm = new URLSearchParams(search).get('q');

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [notDatos, setNotDatos] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [petition, setPetition] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
          const res = await axios.get(`/api/petitions/pub/${searchTerm}`);
          if (res.data) {
            setPetition(res.data);
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

      const res = await axios.post(`/api/petitions/repost/create/${petition._id}`, { text: data.post, shortLink: shortLink, hashtags: tags, type: 1 });
      toast(t("Repost feito"), {action: {label: t("Ver"), onClick: () => navigate(`/${user.username}/post/${res.data._id}`)}})
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
                    placeholder="Pressione Espaço para adicionar tag"
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
              <PetitionPost key={petition._id} post={petition} />
          </div>
        </form>
      </div>
    </aside>
  );
}

export default RepostPetition;
