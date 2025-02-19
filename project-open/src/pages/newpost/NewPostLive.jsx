import "../../styles/main.sass"
import "../../styles/styles.sass"

import "../../styles/pages/Posts.sass"
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import Menu from "@/components/Menu";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const formSchema = z.object({
  text: z.string().min(1),
  liveRumble: z.string().min(1).max(8),
});

const NewPostLive = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorContent, setErrorContent] = useState(false);

  const [charCount, setCharCount] = useState(0);
  const charLimit = 80;

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
  
    return `${numbers}${uppercaseLetters}${lowercaseLetters}`;
  };  

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorContent(false);
    let shortLink = generateLink();

    try {
      const res = await axios.post(`/api/posts/create`, { userId: user._id, text: data.text, shortLink: shortLink, liveRumble: data.liveRumble, video: "1", hashtags: tags, type: 2});
      toast(t("Publicado"), {action: {label: t("Ver"), onClick: () => navigate(`/${user.username}/post/${res.data._id}`)}})
      navigate(-1);
    } catch (error) {
      setIsSubmitting(false);
      setErrorContent(true);
      console.error("Erro ao postar post:", error);
    }
  };

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

  return (
    <aside id="NewPost" className="Container noheaderMenu">
      <Menu/>
      
      <div className="headerBack bg-1">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main">
        <form className="grid w-full gap-2" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="titleGroup"><b>{t("Postar Live do Rumble")}</b></h1>
          
          <div>
            <Label>{t("Título de post")}</Label>
            <Input id="text" {...register("text")} onChange={
              (e1) => setCharCount(e1.target.value.length)
            } maxLength={charLimit}/>
            <div className="detailsInput">
              <label className="error-text">{errors.text && <span>{t("Campo obrigatório.")}</span>}</label>
              <span className="countText colorWhite">{charCount}/{charLimit}</span>
            </div>
          </div>

          <div>
            <Label>{t("ID da live")}</Label>
            <Input id="idlive-rumble" {...register("liveRumble")}/>
            <div className="detailsInput">
              <label className="error-text">{errors.liveRumble && <span>{t("ID inválido")}.</span>}</label>
            </div>
            <p className="col-2 mt-0">rumble.com/embed/<b>(ID)</b>/?pub=4</p>

            <div className="info-alert">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              
              <span className="col-2">{t('msgLiveRumble')} <Link target="_blank" className="col-3" to="https://media.ilhanet.com/rumble-video.png">{t("Ver exemplo")}</Link></span>
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
          </div>

          {errorContent && 
          <div className="detailsInput">
            <label className="error-text">
              <span>{t("errorContent")}</span>
            </label>
          </div>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("Postar")}
          </Button>
        </form>
      </div>
    </aside>
  );
}

export default NewPostLive;
