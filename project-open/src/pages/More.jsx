import "../styles/main.sass";
import "../styles/styles.sass";
import Header from "../components/Header";
import Menu from "../components/Menu";

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

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { useQuery } from 'react-query';

const fetchUser = async () => {
  const res = await axios.get(`/api/users/me`);
  return res.data;
};

const More =  () => {
  const navigate = useNavigate();
  const {currentUser} = useSelector((state) => state.user);
  const { t } = useTranslation();

  const [isSubmitting1, setIsSubmitting1] = useState(false);
  const [isSubmitting2, setIsSubmitting2] = useState(false);
  const [userEmail, setUserEmail] = useState({});

  // useQuery para buscar os dados do usuário
  const { data: user } = useQuery(
    'user', 
    fetchUser, 
    {
      enabled: !!currentUser, // Só executa se `currentUser` estiver definido
    }
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/auth/authId`);
        setUserEmail(res.data.email);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    fetchUser();
  }, [currentUser]);


  const handleSubmit1 = async () => {
    setIsSubmitting1(true);
    try {
      const generateCode = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const codeNumber1 = Math.floor(100000 + Math.random() * 900000).toString();
            resolve(codeNumber1);
          }, 2000);
        });
      };
      const codeNumber1 = await generateCode();  
      const response = await axios.post(`/api/resetauth/email`, {code: codeNumber1});
      const idEmail = response.data._id;
      var templateParams = {
        subject: 'Reset Email',
        name: user.name,
        email: userEmail,
        text: 'We received a request to reset your email on Ilhanet.',
        codeText: `Your code is ${codeNumber1}`, 
        buttonText: 'Change Email',
        typeLink: 'auth/new-email',
        buttonLink: idEmail,
      };
      emailjs.send('service_9fby7fw', 'template_hhediap', templateParams, import.meta.env.VITE_EMAILJS);
      navigate(`/auth/new-email/${idEmail}`);
    } catch (error) {
      console.error("Erro ao seguir usuário:", error);
    }
  };

  const handleSubmit2 = async () => {
    setIsSubmitting2(true);
    try {
      const generateCode = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const codeNumber2 = Math.floor(100000 + Math.random() * 900000).toString();
            resolve(codeNumber2);
          }, 2000);
        });
      };
      const codeNumber2 = await generateCode();  
      const response = await axios.post(`/api/resetauth/password`, {code: codeNumber2});
      const idSenha = response.data._id;
      var templateParams = {
        subject: 'Reset Password',
        name: user.name,
        email: userEmail,
        text: 'We received a request to reset your password on Ilhanet.',
        codeText: `Your code is ${codeNumber2}`,
        buttonText: 'Change Password',
        typeLink: 'auth/new-password',
        buttonLink: idSenha,
      };
      emailjs.send('service_9fby7fw', 'template_hhediap', templateParams, import.meta.env.VITE_EMAILJS);
      navigate(`/auth/new-password/${idSenha}`);
    } catch (error) {
      console.error("Erro ao seguir usuário:", error);
    }
  };

  return (
    <aside id="More" className="Container">
      <Header />
      <div className="Main">
        <div className="Accordion w-full" type="single">
          <Link to={user && user.username && `/${user.username}/groups`}>
            <button className="accordionItem gap-2 py-4 px-3 border-b flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
              <span>{t("Meus grupos")}</span>
            </button>
          </Link>

          <Link to="/u/followedgroups/">
            <button className="accordionItem gap-2 py-4 px-3 border-b flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
              <span>{t("Grupos seguidos")}</span>
            </button>
          </Link>

          <br />

          <Link to="/u/savedposts/">
            <button className="accordionItem gap-2 py-4 px-3 border-b border-t flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
              <span>{t("Posts salvos")}</span>
            </button>
          </Link>

          <br />

          <Link to="/u/editprofile">
            <button className="accordionItem gap-2 py-4 px-3 border-b border-t flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
              <span>{t("Editar perfil")}</span>
            </button>
          </Link>

          <div className="accordionItem border-b flex">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="button  gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <span>{t("Alterar email")}</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("Alterar email")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("msgAlterar")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("Cancelar")}</AlertDialogCancel>
                    <Button onClick={handleSubmit1} disabled={isSubmitting1}>
                      {isSubmitting1 && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t("Continuar")}
                    </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="accordionItem border-b flex">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="button gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  <span>{t("Alterar senha")}</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("Alterar senha")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("msgAlterar")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("Cancelar")}</AlertDialogCancel>
                  <Button onClick={handleSubmit2} disabled={isSubmitting2}>
                    {isSubmitting2 && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("Continuar")}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <br />

          <Link target="_blank" to="/i/policies">
            <button className="accordionItem py-4 px-3 border-b border-t flex">
              <span className="fx1">{t("Políticas e termos")}</span>

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-5 col-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
      <Menu />
    </aside>
  );
};

export default More;
