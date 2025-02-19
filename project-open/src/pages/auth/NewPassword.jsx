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
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { Loading } from "@/components/loading";
import { useTranslation } from 'react-i18next';
import Menu from "@/components/Menu";
import NotFoundPage from "../NotFound";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const messagePwd = 'A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número';

const formSchema = z.object({
  code: z.string().min(1),
  password: z.string()
    .min(8, { message: messagePwd })
    .refine((value) => /[A-Z]/.test(value), messagePwd)
    .refine((value) => /[a-z]/.test(value), messagePwd)
    .refine((value) => /[0-9]/.test(value), messagePwd)
    .refine((value) => /[\W_]/.test(value), messagePwd),
  confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
});

const NewPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const path = useLocation().pathname.split("/")[3];

  const [notFound, setNotFound] = useState(false);
  const [reset, setReset] = useState(true);
  const [update, setUpdate] = useState({});
  const [type1, setType1] = useState("password");
  const [type2, setType2] = useState("password");

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
        if(res.data.type !== "password") {
          setNotFound(true)
        }
        setUpdate(res.data);
      } catch (error) {
        setNotFound(true)
        console.error("Erro ao buscar:", error);
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
      await axios.post(`/api/resetauth/update-password/${path}`, 
      { password: data.password, code: data.code, captchaToken: token });
      setTimeout(() => {
        setReset(false);
        navigate(`/auth/login-email`);
      }, 1000);
    } catch (error) {
      setErrorCode(true);
      setIsSubmitting(false);
      console.error("Erro ao resetar senha:", error);
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
            <h1>{t("Defina sua senha")}</h1>

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
                <Label>{t("Nova senha")}</Label>
                <div className="passwordInput">
                <Input id="password" {...register("password")} type={type1} />
                  {type1==="password"?(
                    <div className="buttonHidden" onClick={()=>setType1("text")}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    </div>
                  ):(
                    <div className="buttonHidden" onClick={()=>setType1("password")}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="detailsInput">
                  <label className="error-text">{errors.password && <span>{t("Campo obrigatório.")}</span>}</label>
                </div>
              </div>

              <div>
                <Label>Confirme sua senha</Label>
                <div className="passwordInput">
                  <Input id="confirmPassword" {...register("confirmPassword")} type={type2} />
                  {type2==="password"?(
                    <div className="buttonHidden" onClick={()=>setType2("text")}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    </div>
                  ):(
                    <div className="buttonHidden" onClick={()=>setType2("password")}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="detailsInput">
                  <label className="error-text">{errors.confirmPassword && <span>{t("Campo obrigatório.")}</span>}</label>
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

            {reset ? (""):(
              <div className="info-alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {t("Senha alterada")}.
              </div>
            )}
        </form>
      </div>
    </aside>
  );
}

export default NewPassword;
