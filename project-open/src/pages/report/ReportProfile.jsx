import "../../styles/main.sass"
import "../../styles/styles.sass"
import Menu from "../../components/Menu";

import "../../styles/pages/Posts.sass"
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";
import axios from "axios";
import NotFoundPage from "../NotFound";
import { Loading } from "@/components/loading";
import { useTranslation } from 'react-i18next';
import HCaptcha from "@hcaptcha/react-hcaptcha";
import emailjs from "@emailjs/browser";
import { useSelector } from "react-redux";

const formSchema = z.object({
  report: z.string().min(1, {
    message: "Campo obrigatório.",
  }),
});

const ReportProfile = () => {
  const {currentUser} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const path = useLocation().pathname.split("/")[3];
  const [notFound, setNotFound] = useState(false);
  const [user, setUser] = useState([]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [user1, setUser1] = useState({});
  useEffect(() => {
    const fetchUser = async () => {
      if (currentUser) {
        try {
          const res = await axios.get(`/api/users/me`);
          setUser1(res.data);
        } catch (error) {
          console.error("Erro ao buscar usuário:", error);
        }
      }
    };

    fetchUser();
  }, [currentUser]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/username/${path}`);
        if (res.data) {
          setUser(res.data)
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        setNotFound(true);
      }
    };

    fetchUser();
  }, [path]);

  const captchaRef = useRef(null);
  const [token, setToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorCaptcha, setErrorCaptcha] = useState(false);

  const onVerify = (token) => {
    setToken(token);
  };

  const onSubmit = (data) => {
    setIsSubmitting(true);

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
        type: 'User',
        typeLink: 'p',
        idReport: `${randomNumber}${currentYear}`,
        nameReq: user1.name,
        usernameReq: user.username,
        nameDen: user1.name,
        idDen: user1.username,
        message: data.report,
      };
      emailjs.send('service_ojnf2rm', 'template_dcbrmwk', templateParams, import.meta.env.VITE_EMAILJS_2);
      setTimeout(() => {
        navigate(-1);
      }, 2000);  
      } catch (err) {
        setIsSubmitting(false);
    }
  };

  const [charCount, setCharCount] = useState(0);
  const charLimit = 280;

  if (!currentUser) {
    navigate(`/auth/login?redirect=/report/profile/${path}`)
  }

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <aside id="Report" className="Container noheaderMenu">
      <Loading/>

      <Helmet>
        <title>{t("Denunciar perfil")} / Ilhanet</title>
      </Helmet>

      <div className="headerBack bg-1">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main">
        <form className="grid w-full gap-2" onSubmit={handleSubmit(onSubmit)}>
          <h1>{t("Denunciar perfil")}</h1>

          <div className="w-full">
            <div className="info-alert">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <div>{t("Para reivindicação de direitos autorais")}, <Link className="col-3" to="/report/dmca">{t("clique aqui")}</Link>.</div>
            </div>
          </div>

          <div>
            <Textarea id="post" {...register("report")} placeholder={t("Descreva os detalhes de sua denúncia.")} onChange={
              (e) => setCharCount(e.target.value.length)
            } maxLength={charLimit}/>
            <div className="detailsInput">
              <label className="error-text">{errors.report && <span>{errors.report.message}</span>}</label>
              <span className="countText colorWhite">{charCount}/{charLimit}</span>
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
            {t("Enviar")}
          </Button>
        </form>
      </div>

      <Menu/>
    </aside>
  );
}

export default ReportProfile;
