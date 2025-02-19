import "../../styles/main.sass"
import "../../styles/styles.sass"
import Menu from "../../components/Menu";

import "../../styles/pages/Posts.sass"
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { zodResolver } from "@hookform/resolvers/zod";
import { useController, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";
import { Loading } from "@/components/loading";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useSelector } from "react-redux";
import emailjs from "@emailjs/browser";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import CountryList from "@/components/CountryList";

const formSchema = z.object({
  name: z.string().min(1),
  local: z.string().min(1),
  links: z.string().min(1),
  description: z.string().min(1),
  idReport: z.string().min(1),
  country: z.string(),
  sign: z.string().min(1),
});

const ReplyCopyright = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {currentUser} = useSelector((state) => state.user);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [userEmail, setUserEmail] = useState({});
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/auth/authId`);
        setUserEmail(res.data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    fetchUser();
  }, [currentUser]);

  const { field } = useController({
    name: "country",
    control,
  });

  const captchaRef = useRef(null);
  const [token, setToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorCaptcha, setErrorCaptcha] = useState(false);

  const onVerify = (token) => {
    setToken(token);
  };

  const onSubmit = (data) => {
    setIsSubmitting(true);
    console.log(data)

    if (!token) {
      setErrorCaptcha(true);
      setIsSubmitting(false);
      return;
    }

    try {
      setErrorCaptcha(false);
      console.log(data)

      var templateParams = {
        type: 'Counter-notification',
        name: data.name,
        email: userEmail.email,
        local: data.local,
        country: data.country,

        idReport: data.idReport,
        links: data.links,
        description: data.description,
        sign: data.sign,
      };
      emailjs.send('service_ojnf2rm', 'template_pmarxen', templateParams, import.meta.env.VITE_EMAILJS_2);
      setTimeout(() => {
        navigate(-1);
      }, 2000);  
      } catch (err) {
        setIsSubmitting(false);
    }
  };

  const [charCount1, setCharCount1] = useState(0);
  const [charCount2, setCharCount2] = useState(0);
  const charLimit1 = 280;
  const charLimit2 = 500;

  if (!currentUser) {
    navigate(`/auth/login?redirect=/report/dmca`)
  }

  return (
    <aside id="Report" className="Container noheaderMenu">
      <Loading/>

      <Helmet>
        <title>{t("Apresentação de contranotificação")} / Ilhanet</title>
      </Helmet>

      <div className="headerBack bg-1">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main">
      {userEmail.confirmEmail === 1 ? (
        <form className="grid w-full gap-2" onSubmit={handleSubmit(onSubmit)}>
          <h1>{t("Apresentação de contranotificação")}</h1>

          <div>
            <Label>{t("Nome")}</Label>
            <Input id="name" {...register("name")}/>
            <div className="detailsInput">
              <label className="error-text">{errors.name && <span>{t("Campo obrigatório.")}</span>}</label>
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <Input id="email" type="email" value={userEmail.email} disabled/>
            <p className="text-sm text-muted-foreground mt-1">
              {t("EmailMsg")}
            </p>
          </div>

          <div>
            <Label>{t("Seu local")}</Label>
            <Input id="local" {...register("local")} placeholder={t("Cidade e estado")} />
            <div className="detailsInput">
              <label className="error-text">{errors.local && <span>{t("Campo obrigatório.")}</span>}</label>
            </div>
          </div>

          <div>
            <CountryList field={field} control={control}/>
            <div className="detailsInput">
              <label className="error-text">{errors.country && <span>{t("Campo obrigatório.")}</span>}</label>
            </div>
          </div>

          <hr />

          <div>
            <Label>{t("ID da denúncia")}</Label>
            <Input id="idReport" {...register("idReport")} />
            <div className="detailsInput">
              <label className="error-text">{errors.idReport && <span>{t("Campo obrigatório.")}</span>}</label>
            </div>
          </div>

          <div>
            <Label>{t("Link(s) do conteúdo(s) removido(s)")}</Label>
            <Textarea id="links" {...register("links")} onChange={
              (e) => setCharCount1(e.target.value.length)
            } maxLength={charLimit1}/>
            <div className="detailsInput">
              <label className="error-text">{errors.links && <span>{t("Campo obrigatório.")}</span>}</label>
              <span className="countText colorWhite">{charCount1}/{charLimit1}</span>
            </div>
          </div>

          <div>
            <Label>{t("Justifique esta contranotificação")}</Label>
            <Textarea id="description" {...register("description")} onChange={
              (e) => setCharCount2(e.target.value.length)
            } maxLength={charLimit2}/>
            <div className="detailsInput">
              <label className="error-text">{errors.description && <span>{t("Campo obrigatório.")}</span>}</label>
              <span className="countText colorWhite">{charCount2}/{charLimit2}</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="mb-3">{t("Marque a opção abaixo (obrigatório)")}:</Label>

            <div className="items-top flex space-x-2">
              <Checkbox id="terms1" required className="mt-1" />
              <div className="grid gap-1.5 leading-none">
                <p className="text-sm col-2">
                  {t("ReplyCopyright1")}
                </p>
              </div>
            </div>
          </div>

          <div>
            <Label>{t("Assine eletronicamente")}:</Label>
            <Input id="sign" {...register("sign")}/>
            <div className="detailsInput">
              <label className="error-text">{errors.sign && <span>{t("Campo obrigatório.")}</span>}</label>
            </div>
          </div>

          <p className="text-sm">
            {t("ReplyCopyright2")}
          </p>

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
            {t("Enviar")}
          </Button>
        </form>
      ):(
        <form>
          <h1>{t("Apresentação de contranotificação")}</h1>
          <div className="w-full py-2">
            <div className="info-alert">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <div>{t("Para continuar, você precisa")} <Link className="col-3" to="/u/editprofile">{t("confirmar seu email")}</Link>.</div>
            </div>
          </div>
        </form>
      )}
      </div>

      <Menu/>
    </aside>
  );
}

export default ReplyCopyright;
