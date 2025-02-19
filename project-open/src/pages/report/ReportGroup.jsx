import "../../styles/main.sass"
import "../../styles/styles.sass"
import Menu from "../../components/Menu";

import "../../styles/pages/Posts.sass"
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";
import { Loading } from "@/components/loading";
import axios from "axios";
import NotFoundPage from "../NotFound";
import { useTranslation } from 'react-i18next';
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useSelector } from "react-redux";
import emailjs from "@emailjs/browser";

const formSchema = z.object({
  report: z.string().min(1, {
    message: "Campo obrigatório.",
  }),
});

const ReportGroup = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [notFound, setNotFound] = useState(false);
  const {currentUser} = useSelector((state) => state.user);
  const path = useLocation().pathname.split("/")[3];
  const [groups, setGroups] = useState([]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
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
  }, [currentUser]);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`/api/groups/id/${path}`);
        if (res.data) {
          setGroups(res.data)
          setNotFound(false);
        } else {
          setNotFound(true);
        }  
      } catch (error) {
        console.error("Erro ao buscar grupos:", error);
      }
    };
    fetchGroup();
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
        type: 'Group',
        typeLink: 'group',
        idReport: `${randomNumber}${currentYear}`,
        nameReq: user.name,
        usernameReq: user.username,
        nameDen: groups.title,
        idDen: groups._id,
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
    navigate(`/auth/login?redirect=/report/group/${path}`)
  }

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <aside id="Report" className="Container noheaderMenu">
      <Loading/>

      <Helmet>
        <title>{t("Denunciar grupo")} / Ilhanet</title>
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
          <h1>{t("Denunciar grupo")}</h1>
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

export default ReportGroup;
