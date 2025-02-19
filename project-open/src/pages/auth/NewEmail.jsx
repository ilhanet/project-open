import "../../styles/main.sass";
import "../../styles/styles.sass";
import "../../styles/pages/Posts.sass";

import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Loading } from "@/components/loading";
import { useTranslation } from 'react-i18next';
import HCaptcha from "@hcaptcha/react-hcaptcha";

import Menu from "@/components/Menu";
import NotFoundPage from "../NotFound";

const formSchema = z.object({
  code: z.string().min(1),
  email: z.string().email().min(1),
});

const NewEmail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const path = useLocation().pathname.split("/")[3];

  const [reset, setReset] = useState(true);
  const [update, setUpdate] = useState({});
  const [notFound, setNotFound] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const pageLogin = () => {
    navigate(`/auth/login-email`);
  };

  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        const res = await axios.get(`/api/resetauth/${path}`);
        if(res.data.type !== "email") {
          setNotFound(true)
        }
        setUpdate(res.data);
      } catch (error) {
        setNotFound(true)
        console.error("Erro ao buscar usuário:", error);
      }
    };
    fetchUpdate();
  }, [path]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorCode, setErrorCode] = useState(false);
  const [errorCaptcha, setErrorCaptcha] = useState(false);

  const captchaRef = useRef(null);
  const [token, setToken] = useState(null);
  
  const onVerify = (token) => {
    setToken(token);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    if (!token) {
      setErrorCaptcha(true);
      setIsSubmitting(false);
      return;
    }

    try {
      setErrorCaptcha(false);

      await axios.post(`/api/resetauth/update-email/${path}`, { email: data.email, code: data.code, captchaToken: token });
      setTimeout(() => {
        setReset(false);
        navigate(`/auth/login-email`);
      }, 1000);
    } catch (error) {
      console.error("Erro ao resetar senha:", error);
      setErrorCode(true)
      setIsSubmitting(false);
    }
  };

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <aside id="EditProfile" className="Container noheaderMenu">  
      <Loading/>
      <Menu/>
          
      <div className="headerBack bg-1" onClick={pageLogin}>
        <div className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main">
        <form className="grid w-full gap-2" onSubmit={handleSubmit(onSubmit)}>
          <h1>{t("Defina seu email")}</h1>

          {reset ? (""):(
            <div className="info-alert">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {t("Senha alterada")}.
            </div>
          )}

          {update.status === 'progress' ? (<>
            <div>
              <Label>{t("Seu código")}</Label>
              <Input id="code" {...register("code")} />
              <span className="msg col-2">{t("Enviamos o código em seu email")}.</span>

              <div className="detailsInput">
                <label className="error-text">{errors.code && <span>{t("Campo obrigatório.")}</span>}</label>
              </div>
              {errorCode && 
              <div className="detailsInput">
                <label className="error-text"><span>{t("Código inválido")}</span></label>
              </div>}
            </div>

            <div>
              <Label>{t("Novo email")}</Label>
              <Input id="email" {...register("email")} type="email" required />
              <div className="detailsInput">
                <label className="error-text">{errors.email && <span>{t("Campo obrigatório.")}</span>}</label>
              </div>
            </div>

            <div>
              <HCaptcha
                sitekey="xxxx"
                onVerify={onVerify}
                ref={captchaRef}
              />

              {errorCaptcha && 
                <div className="detailsInput">
                  <label className="error-text">{t("Complete o CAPTCHA acima")}.</label>
                </div>          
              }
            </div>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("Confirmar")}
            </Button>
          </>):(<>
            <div className="info-alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                {t("Este link não está funcionando")}.
              </div>
            </>
          )}
        </form>
      </div>
    </aside>
  );
}

export default NewEmail;
