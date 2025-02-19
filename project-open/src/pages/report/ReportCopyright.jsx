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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox";
import CountryList from "@/components/CountryList";

const formSchema = z.object({
  name: z.string().min(1),
  company: z.string().min(1),
  job: z.string().min(1),
  local: z.string().min(1),
  country: z.string(),
  linksOriginal: z.string().min(1),
  descriptionOriginal: z.string().min(1),
  linksViolator: z.string().min(1),
  descriptionViolator: z.string().min(1),
  type: z.string().min(1),
  sign: z.string().min(1),
});

const ReportCopyright = () => {
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

  const { field: typeField } = useController({
    name: "type",
    control,
  });
  
  const { field: countryField } = useController({
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
      const randomNumber = Math.floor(Math.random() * 1e7).toString().padStart(7, '0');
      const currentYear = new Date().getFullYear(); 

      var templateParams = {
        type: 'DMCA',
        name: data.name,
        company: data.company,
        job: data.job,
        email: userEmail.email,
        local: data.local,
        country: data.country,
        idReport: `${randomNumber}${currentYear}`,

        linksOriginal: data.linksOriginal,
        descriptionOriginal: data.descriptionOriginal,
        linksViolator: data.linksOriginal,
        descriptionViolator: data.descriptionViolator,
        typeReq: data.type,
        sign: data.sign,
      };
      emailjs.send('service_ojnf2rm', 'template_pmarxen', templateParams, import.meta.env.VITE_EMAILJS_2);
      setTimeout(() => {
        navigate(-2);
      }, 2000);  
      } catch (err) {
        setIsSubmitting(false);
    }
  };

  const [charCount1, setCharCount1] = useState(0);
  const [charCount2, setCharCount2] = useState(0);
  const [charCount3, setCharCount3] = useState(0);
  const [charCount4, setCharCount4] = useState(0);

  const charLimit1 = 280;
  const charLimit2 = 500;
  const charLimit3 = 280;
  const charLimit4 = 500;

  if (!currentUser) {
    navigate(`/auth/login?redirect=/report/dmca`)
  }

  return (
    <aside id="Report" className="Container noheaderMenu">
      <Loading/>

      <Helmet>
        <title>{t("Reivindicação de direitos autorais")} / Ilhanet</title>
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
          <h1>{t("Reivindicação de direitos autorais")}</h1>

          <div>
            <Label>{t("Nome completo")}</Label>
            <Input id="name" {...register("name")}/>
            <div className="detailsInput">
              <label className="error-text">{errors.name && <span>{t("Campo obrigatório.")}</span>}</label>
            </div>
          </div>

          <div>
            <Label>{t("Empresa")}</Label>
            <Input id="company" {...register("company")}/>
            <div className="detailsInput">
              <label className="error-text">{errors.company && <span>{t("Campo obrigatório.")}</span>}</label>
            </div>
          </div>

          <div>
            <Label>{t("Cargo")}</Label>
            <Input id="job" {...register("job")}/>
            <div className="detailsInput">
              <label className="error-text">{errors.job && <span>{t("Campo obrigatório.")}</span>}</label>
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
            <CountryList field={countryField} control={control}/>
            <div className="detailsInput">
              <label className="error-text">{errors.country && <span>{t("Campo obrigatório.")}</span>}</label>
            </div>
          </div>

          <hr />

          <div>
            <Label>{t("Tipo de conteúdo")}</Label>
            <Select value={typeField.value} onValueChange={typeField.onChange}>
              <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("Escolha...")} />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="Text">Texto</SelectItem>
                  <SelectItem value="Image/Photo">Imagem/Foto</SelectItem>
                  <SelectItem value="Others">Outros</SelectItem>
              </SelectContent>
            </Select>

            <div className="detailsInput">
              <label className="error-text">{errors.type && <span>{t("Campo obrigatório.")}</span>}</label>
            </div>
          </div>

          <div>
            <Label>{t("Links do trabalho original")}</Label>
            <Textarea id="linksOriginal" {...register("linksOriginal")} 
              onChange={
              (e) => setCharCount1(e.target.value.length)
            } maxLength={charLimit1}/>
            <div className="detailsInput">
              <label className="error-text">{errors.linksOriginal && <span>{t("Campo obrigatório.")}</span>}</label>
              <span className="countText colorWhite">{charCount1}/{charLimit1}</span>
            </div>
          </div>

          <div>
            <Label>{t("Descrição do trabalho original")}</Label>
            <Textarea id="descriptionOriginal" {...register("descriptionOriginal")} placeholder={t("Descreva o que seria o trabalho original")} onChange={
              (e) => setCharCount2(e.target.value.length)
            } maxLength={charLimit2}/>
            <div className="detailsInput">
              <label className="error-text">{errors.descriptionOriginal && <span>{t("Campo obrigatório.")}</span>}</label>
              <span className="countText colorWhite">{charCount2}/{charLimit2}</span>
            </div>
          </div>

          <div>
            <Label>{t("Links do conteúdo infrator")}</Label>
            <Textarea id="linksViolator" {...register("linksViolator")} 
              onChange={
              (e) => setCharCount3(e.target.value.length)
            } maxLength={charLimit3}/>
            <div className="detailsInput">
              <label className="error-text">{errors.linksViolator && <span>{t("Campo obrigatório.")}</span>}</label>
              <span className="countText colorWhite">{charCount3}/{charLimit3}</span>
            </div>
            <p className="msg text-muted-foreground">{t("LinkInfratorMsg")}</p>
          </div>

          <div>
            <Label>{t("Descrever infração")}</Label>
            <Textarea id="descriptionViolator" {...register("descriptionViolator")} onChange={
              (e) => setCharCount4(e.target.value.length)
            } maxLength={charLimit4}/>
            <div className="detailsInput">
              <label className="error-text">{errors.descriptionViolator && <span>{t("Campo obrigatório.")}</span>}</label>
              <span className="countText colorWhite">{charCount4}/{charLimit4}</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="mb-3">{t("Marque as opções abaixo (obrigatório)")}:</Label>

            <div className="items-top flex space-x-2">
              <Checkbox id="terms1" required className="mt-1" />
              <div className="grid gap-1.5 leading-none">
                <p className="text-sm col-2">
                  {t("Copyright1")}
                </p>
              </div>
            </div>

            <div className="items-top flex space-x-2">
              <Checkbox id="terms2" required className="mt-1" />
              <div className="grid gap-1.5 leading-none">
                <p className="text-sm col-2">
                  {t("Copyright2")}
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
            {t("Copyright3")}
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
            <h1>{t("Reivindicação de direitos autorais")}</h1>
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

export default ReportCopyright;
