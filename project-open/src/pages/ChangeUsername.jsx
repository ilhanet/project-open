import "../styles/main.sass";
import "../styles/styles.sass";
import "../styles/pages/EditProfile.sass";
import Menu from "../components/Menu";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/loading";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet";

import { Loader2 } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

const formSchema = z.object({
  username: z.string().min(3).regex(/^[a-z0-9._]+$/),
});

const ChangeUsername = () => {
  const navigate = useNavigate();
  const {currentUser} = useSelector((state) => state.user);
  const { t } = useTranslation();

  const [user, setUser] = useState({});

  const {register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username,
    }
  });

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const [charCount2, setCharCount2] = useState(0);
  const charLimit2 = 15;

  useEffect(() => {
    setValue('username', user.username);
  }, [user, setValue]);

  useEffect(() => {
    if (user.username) {
      setCharCount2(user.username.length);
    }
  }, [user.username]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.put(`/api/users/editUsername`, { username: data.username });
      console.log(response.data.username);
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (err) {
      setIsSubmitting(false);
      if (err.response && err.response.status === 409) {
        setServerErrors({ ...serverErrors, [err.response.data.error.split(' ')[0].toLowerCase()]: err.response.data.error });
      } else {
        console.error("An unexpected error occurred:", err);
      }
    }
  };

  useEffect(() => {
    setValue('username', user.username);
  }, [user, setValue]);

  return (
    <aside id="EditProfile" className="Container noheaderMenu">
      <Loading/>

      <Helmet>
        <title>{t("Editar perfil")} / Ilhanet</title>
      </Helmet>
      
      <div className="headerBack bg-1">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main">
        <div className="EditHeader">
          <h1>Alterar nome de usuário</h1>
        </div>

        <form className="grid w-full gap-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label>{t("Nome de usuário")}</Label>
            <Input id="username" {...register("username")} defaultValue={user.username} onChange={
              (e1) => setCharCount2(e1.target.value.length)
            } maxLength={charLimit2} />
            <div className="detailsInput">
              <label className="error-text">{errors.username && <span>{t("messageUsername")}</span>}</label>
              <span className="countText colorWhite">{charCount2}/{charLimit2}</span>
            </div>
            {serverErrors.username && 
            <div className="detailsInput">
              <label className="error-text"><span>{t("Este nome de usuário já existe")}</span></label>
            </div>}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("Salvar")}
          </Button>
        </form>
      </div>

      <Menu/>
    </aside>
  );
}

export default ChangeUsername;
