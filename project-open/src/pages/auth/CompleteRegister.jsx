import "../../styles/main.sass";
import "../../styles/styles.sass";
import "../../styles/pages/EditProfile.sass";

import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useController, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/loading";
import { Label } from "@/components/ui/label";

import { Loader2 } from "lucide-react";
import TimezoneList from "@/components/TimezoneList";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import {Cloudinary} from "@cloudinary/url-gen";
import {Resize} from '@cloudinary/url-gen/actions/resize';
import Menu from "@/components/Menu";
import { useSelector } from "react-redux";
import CountryList from "@/components/CountryList";
import LanguageList from "@/components/LanguageList";

const formSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(3),
  bio: z.string().optional(),
  email: z.string().email().min(1),
  timezone: z.string().optional(),
  country: z.string(),
  language: z.string(),
});

const CompleteRegister = () => {
  const navigate = useNavigate();
  const {currentUser} = useSelector((state) => state.user);
  const { t } = useTranslation();
  const [isSubmitting2, setIsSubmitting2] = useState(false);
  const [errorUpload, setErrorUpload] = useState(false);
  const [user, setUser] = useState({});
  const [errorModeration, setErrorModeration] = useState(false);

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

  const imgProfile = user.img;

  const {register, handleSubmit, control, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: user.name,
      description: user.description,
      timezone: user.timezone
    }
  });

  useEffect(() => {
    setValue('name', user.name);
    setValue('description', user.description);
    setValue('username', user.username);
    setValue('img', user.img);
  }, [user, setValue]);

  useEffect(() => {
    if (user.description) {
      setCharCount3(user.description.length);
    }
  }, [user.description]);

  useEffect(() => {
    if (user.name) {
      setCharCount1(user.name.length);
    }
  }, [user.name]);

  const cloud_name = (import.meta.env.VITE_CLOUD_NAME);
  const [img, setImage] = useState([]);

  const handleFile = async (event) => {
    setIsSubmitting2(true);
    const file = event.target.files[0];
  
    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validImageTypes.includes(file.type)) {
      setErrorUpload(true);
      setIsSubmitting2(false);
      return;
    }
  
    const maxSizeInBytes = 1 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setErrorUpload(true);
      setIsSubmitting2(false);
      return;
    }
  
    setErrorUpload(false);
    const formData = new FormData();
    formData.append('file', file);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
    formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);
  
    const defaultFileName = `imgprofile_${new Date().getTime()}_${Math.random().toString(36).substring(2, 15)}`;
    formData.append('public_id', defaultFileName);
  
    try {
      const tempUploadResponse = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, formData, {
        withCredentials: false // Explicitamente definindo como false
      });
  
      const tempImageUrl = tempUploadResponse.data.secure_url;
  
      const webPurifyResponse = await axios.get('/api/webpurify', {
        params: {
          imgurl: tempImageUrl
        }
      });

      const pornValue = parseInt(webPurifyResponse.data.rsp.nudity);

      if (pornValue && pornValue > "85") {
        await axios.post(`/api/delete-image`, { public_id: tempUploadResponse.data.public_id, }, )
        setErrorModeration(true);
        setIsSubmitting2(false);
      } else {
        setImage(tempUploadResponse.data.public_id);
        setErrorModeration(false);
        setIsSubmitting2(false);
      }
    } catch (error) {
      console.error("Erro durante o upload ou verificação da imagem:", error);
      setIsSubmitting2(false);
    }
  };

  const cld = new Cloudinary({
    cloud: {
      cloudName: import.meta.env.VITE_CLOUD_NAME
    }
  });

  const myImage = cld.image(img);
  myImage.resize(Resize.auto().width(400).height(400))
  const myImage2 = myImage.toURL();


  const { field: timezoneField } = useController({
    name: "timezone",
    control,
    defaultValue: "America/Sao_Paulo",
  });
  
  const { field: countryField } = useController({
    name: "country",
    control,
  });

  const { field: languageField } = useController({
    name: "language",
    control,
  });

  const [charCount1, setCharCount1] = useState(0);
  const [charCount2, setCharCount2] = useState(0);
  const [charCount3, setCharCount3] = useState(0);

  const [serverErrorUser, setServerErrorUser] = useState(false);
  const [serverErrorEmail, setServerErrorEmail] = useState(false);

  const charLimit1 = 50;
  const charLimit2 = 15;
  const charLimit3 = 180;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/auth/signupX`, 
      { name: data.name, username: data.username, email: data.email, description: data.bio, country: data.country, timezone: data.timezone, language: data.language, img: myImage2 || imgProfile });
      console.log(response.data._id);
      setTimeout(() => {
        navigate("/");
      }, 2000)
    } catch (err) {
      setIsSubmitting(false);
      const errorResponse = err.response && err.response.data && err.response.data.error;

      if (errorResponse && errorResponse.includes("Username")) {
        setServerErrorUser(true);
      } else {
        setServerErrorUser(false);
      }
  
      if (errorResponse && errorResponse.includes("Email")) {
        setServerErrorEmail(true);
      } else {
        setServerErrorEmail(false);
      }    }
  };

  const logout = () => {
    localStorage.removeItem("persist:root");
    window.location.reload();
  };

  if (user.status === "on") {
    return <Navigate replace to="/" />;
  }

  return (
    <aside id="EditProfile" className="Container">
      <Loading/>
      <Menu/>
      
      <div className="headerBack bg-1">
        <div onClick={logout} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main">
        <div className="EditHeader">
        <h1>{t("Confirme suas informações")}...</h1>

        <div className="imgProfile">
            {isSubmitting2 ? (
              <div className="buttonUpload bUpload2" onClick={() => document.getElementById('fileInput').click()}>
                <Loader2 className="h-7 w-7 animate-spin" />
              </div>              
            ):(
              <div className="buttonUpload" onClick={() => document.getElementById('fileInput').click()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
              </div>
            )}
            <img src={myImage2 || imgProfile} alt="" />
          </div>
          <input type="file" id="fileInput" className="hidden-input" accept="image/png, image/jpg, image/jpeg" onChange={handleFile}/>
          {errorUpload && <label className="error-text"><span>{t("msgTypeFile")}</span></label>}
          {errorModeration && <label className="error-text"><span>{t("msgModerationFile")}</span></label>}
        </div>

        <form className="grid w-full gap-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label>{t("Nome")}</Label>
            <Input id="name" {...register("name")} onChange={
              (e1) => setCharCount1(e1.target.value.length)
            } maxLength={charLimit1}/>
            <div className="detailsInput">
              <label className="error-text">{errors.name && <span>{t("Campo obrigatório.")}</span>}</label>
              <span className="countText colorWhite">{charCount1}/{charLimit1}</span>
            </div>
          </div>

          <div>
            <Label>{t("Nome de usuário")}</Label>
            <Input id="username" {...register("username")} defaultValue={user.username} onChange={
              (e1) => setCharCount2(e1.target.value.length)
            } maxLength={charLimit2} />
            <div className="detailsInput">
              <label className="error-text">{errors.username && <span>{t("Campo obrigatório.")}</span>}</label>
              <span className="countText colorWhite">{charCount2}/{charLimit2}</span>
            </div>
            <div className="detailsInput">
              <label className="error-text">{serverErrorUser && <span>{t("Este nome de usuário já existe")}</span>}</label>
            </div>
          </div>

          <div>
            <Label>{t("Email")}</Label>
            <Input id="email" {...register("email")} type="email" />
            <label className="error-text">{errors.email && <span>{t("Campo obrigatório.")}</span>}</label>
            {serverErrorEmail &&
            <div className="detailsInput">
              <label className="error-text"><span>{t("Este email já está registrado")}</span></label>
            </div>}
          </div>

          <div>
            <Label>{t("Bio")}</Label>
            <Textarea id="description" {...register("description")} defaultValue={user.description} onChange={
              (e3) => setCharCount3(e3.target.value.length)
            } maxLength={charLimit3}/>
            <div className="detailsInput">
              <span className="fx1 countText colorWhite">{charCount3}/{charLimit3}</span>
            </div>
          </div>

          <div>
            <CountryList field={countryField} control={control}/>
            <div className="detailsInput">
              <label className="error-text">{errors.country && <span>{t("Campo obrigatório.")}</span>}</label>
            </div>
          </div>

          <div>
            <LanguageList field={languageField} control={control}/>
            <div className="detailsInput">
              <label className="error-text">{errors.language && <span>{t("Campo obrigatório.")}</span>}</label>
            </div>
          </div>

          <div>
            <TimezoneList field={timezoneField} control={control}/>
            <div className="detailsInput">
              <label className="error-text">{errors.timezone && <span>{t("Campo obrigatório.")}</span>}</label>
            </div>
          </div>

          <div>
            <p className="text-terms">
              {t("Ao continuar, você concorda com os")} <Link to="/i/policies/terms" className="col-3">{t("Termos de uso")}</Link> {t("e a")} <Link to="/i/policies/privacy-cookies" className="col-3">{t("Política de Privacidade e Cookies")}</Link>.
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("Continuar")}
          </Button>
        </form>
      </div>
    </aside>
  );
}

export default CompleteRegister;
