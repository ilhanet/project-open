import "../../styles/main.sass";
import "../../styles/styles.sass";
import "../../styles/pages/Login.sass";

import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import Menu from "@/components/Menu";
// import emailjs from "@emailjs/browser";

const formSchema = z.object({
  email: z.string().email("Digite um email válido.").min(1, { 
    message: "Campo obrigatório." 
  }),

  password: z.string().min(1, { 
    message: "Campo obrigatório." 
  })
});

const LoginEmail = () => {
  const {currentUser} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";
  const queryParams = location.search.split("?")[1];

  const [type, setType] = useState("password");

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");  
  const dispatch = useDispatch()

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    dispatch(loginStart());

    try {
      setErrorLogin(false);
      setLoginAttempts(false)

      const codeNumber = Math.floor(100000 + Math.random() * 900000).toString();

      const res = await axios.post("/api/auth/signin", { email, password, code: codeNumber }, { withCredentials: true });
      
      if (res.data.twofa) {
        navigate(`/auth/2fa/?user=${res.data.twofa}`);
      } else {
        dispatch(loginSuccess(res.data));
        navigate(`/${redirectPath}`);
      }
    } catch (err) {
      dispatch(loginFailure());
      setIsSubmitting(false);
      if (err.response && err.response.status === 400) {
        setErrorLogin(true);
      }
      if (err.response && err.response.status === 429) {
        setLoginAttempts(true);
      }
    }
  };

  if (currentUser && redirectPath === "/") {
    return <Navigate replace to="/" />;
  }

  if (currentUser && redirectPath !== "/") {
    return <Navigate replace to={`/${redirectPath}`} />;
  }

  return (
    <aside id="EditProfile" className="Container noheaderMenu">   
      <Helmet>
        <title>{t("Entrar com o")} email / Ilhanet</title>
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
          <h1>{t("Entrar com o")} email</h1>

          {errorLogin &&
          <div className="w-full">
            <div className="info-alert">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {t("Email e/ou senha inválido")}.
            </div>
          </div>}

          {loginAttempts &&
          <div className="w-full">
            <div className="info-alert col-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              {t("msgLoginAttempts")}.
            </div>
          </div>}

          <div>
            <Label>{t("Email")}</Label>
            <Input id="email" {...register("email")} onChange={(e) => {setEmail(e.target.value)}} type="email" />
            <div className="detailsInput">
              <label className="error-text">{errors.email && <span>{t("Campo obrigatório.")}</span>}</label>
            </div>
          </div>

          <div>
            <Label>{t("Senha")}</Label>
            <div className="passwordInput">
              <Input id="password" {...register("password")} onChange={(e) => {setPassword(e.target.value)}} type={type} />
              {type==="password"?(
                <div className="buttonHidden" onClick={()=>setType("text")}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </div>
              ):(
                <div className="buttonHidden" onClick={()=>setType("password")}>
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

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("Entrar")}
          </Button>

          <div className="flex justify-center">
            <Link to="/auth/reset-password" className="w-full">
              <Button variant="outline">
                {t("Esqueci minha senha")}
              </Button>
            </Link>
          </div>

          <hr />
          <div className="flex justify-center">
            <Link to={`/auth/signup${queryParams ? `?${queryParams}` : ''}`} className="w-full">
              <Button variant="outline">
              {t("Crie sua conta")}
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </aside>
  );
}

export default LoginEmail;
