import "../../../styles/main.sass"
import "../../../styles/styles.sass"
import "../../../styles/pages/Login.sass"

import { Loading } from "@/components/loading";
import { useEffect, useState } from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginFailure, loginStart, loginSuccess } from "../../../redux/userSlice";

import Menu from "@/components/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import NotFoundPage from "@/pages/NotFound";
import { useDispatch } from "react-redux";

const formSchema = z.object({
  code: z.string().min(1),
});

const TwoFADevice = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const path = useLocation().pathname.split("/")[3];

  const [update, setUpdate] = useState({});
  const [notFound, setNotFound] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        const res = await axios.get(`/api/resetauth/${path}`);
        if(res.data.type !== "2fa") {
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
  const [loginAttempts, setLoginAttempts] = useState(false);
  const [errorCode, setErrorCode] = useState(false);
  const dispatch = useDispatch()

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorCode(false)
    setLoginAttempts(false)

    dispatch(loginStart());

    try {
      const res = await axios.post(`/api/auth/update2fa/${path}`, { code: data.code });
      dispatch(loginSuccess(res.data));
      setTimeout(() => {
        navigate(`/`);
      }, 1000);
    } catch (err) {
      console.error("Erro ao resetar senha:", err);
      dispatch(loginFailure());
      setIsSubmitting(false);
      if (err.response && err.response.status === 400) {
        setErrorCode(true)
      }
      if (err.response && err.response.status === 429) {
        setLoginAttempts(true);
      }
    }
  };

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
      <aside id="EditProfile" className="Container">
        <Loading/>

        <div className="headerBack bg-1">
          <div className="hbButton col-3" onClick={() => navigate(-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </div>
        </div>

        <div className="Main">
        <form className="grid w-full gap-2" onSubmit={handleSubmit(onSubmit)}>
          <h1>{t("Verificação de duas etapas")}</h1>

          {loginAttempts &&
          <div className="w-full">
            <div className="info-alert col-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              {t("msgLoginAttempts")}.
            </div>
          </div>}

          {update.status === 'progress' ? (<>
            <div>
              <Label>{t("Digite seu código de acesso")}</Label>
              <Input id="code" {...register("code")} />
              <span className="msg col-2">{t("Enviamos o código em seu outro dispositivo conectado com sua conta")}.</span>

              <div className="detailsInput">
                <label className="error-text">{errors.code && <span>{t("Campo obrigatório.")}</span>}</label>
              </div>
              {errorCode && 
              <div className="detailsInput">
                <label className="error-text"><span>{t("Código inválido")}</span></label>
              </div>}
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

        <Menu/>
      </aside>
  );
}

export default TwoFADevice;
