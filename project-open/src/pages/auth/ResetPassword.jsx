import "../../styles/main.sass";
import "../../styles/styles.sass";
import "../../styles/pages/Posts.sass";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import HCaptcha from "@hcaptcha/react-hcaptcha";
import emailjs from "@emailjs/browser";
import Menu from "@/components/Menu";

const formSchema = z.object({
  email: z.string().email("Digite um email válido.").min(1, { 
    message: "Campo obrigatório." 
  }),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [reset, setReset] = useState(true);
  const [emailNotFound, setEmailNotFound] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorCaptcha, setErrorCaptcha] = useState(false);
  const captchaRef = useRef(null);
  const [token, setToken] = useState(null);

  const onVerify = (token) => {
    setToken(token);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setEmailNotFound(false);

    if (!token) {
      setErrorCaptcha(true);
      setIsSubmitting(false);
      return;
    }

    const generateCode = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const codeNumber2 = Math.floor(100000 + Math.random() * 900000).toString();
          resolve(codeNumber2);
        }, 2000);
      });
    };
    const codeNumber = await generateCode();  

    try {
      setErrorCaptcha(false);
      const response = await axios.post(`/api/resetauth/password2`, {inputEmail: data.email, code: codeNumber, captchaToken: token});
      const idSenha = response.data._id;
      var templateParams = {
        name: "user",
        email: data.email,
        subject: 'Reset Password',
        text: 'We received a request to reset your password on Ilhanet.',
        buttonText: 'Change Password',
        typeLink: 'auth/new-password',
        buttonLink: idSenha,
        codeText: `Your code is ${codeNumber}`,
      };
      emailjs.send('service_9fby7fw', 'template_hhediap', templateParams, import.meta.env.VITE_EMAILJS);
      setTimeout(() => {
        setReset(false);
      }, 2000);  
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setEmailNotFound(true);
        }
        console.error("Erro ao resetar senha:", err);
        setIsSubmitting(false);
    }
  };

  return (
    <aside id="EditProfile" className="Container noheaderMenu">
      <Helmet>
        <title>{t("Redefinir senha")} / Ilhanet</title>
      </Helmet>

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
          <h1>{t("Esqueci minha senha")}</h1>

          <div className="grid gap-2">
            {reset ? (<>
              <div>
                <Label>{t("Digite seu email")}</Label>
                <Input id="email" {...register("email")} type="email" />
                <div className="detailsInput">
                  {errors.email && <label className="error-text"><span>{t("Campo obrigatório.")}</span></label>}
                  {emailNotFound && <label className="error-text"><span>{t("Email não encontrado.")}</span></label>}
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
            </>):(
              <div className="info-alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {t("Enviamos o link em seu email para resetar sua senha.")}
              </div>
          )}
          </div>

          {reset ? (
            <Button type="submit" onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("Confirmar")}
            </Button>
          ):("")}
        </form>
      </div>
    </aside>
  );
}

export default ResetPassword;
