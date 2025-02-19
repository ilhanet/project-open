import "../styles/main.sass";
import "../styles/styles.sass";
import "../styles/pages/EditProfile.sass";
import Menu from "../components/Menu";

import { useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useController, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/loading";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet";
import {Cloudinary} from "@cloudinary/url-gen";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Loader2 } from "lucide-react";
import TimezoneList from "@/components/TimezoneList";
import axios from "axios";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import emailjs from "@emailjs/browser";
import {Resize} from '@cloudinary/url-gen/actions/resize';
import CountryList from "@/components/CountryList";
import LanguageList from "@/components/LanguageList";
import { toast } from "sonner";
import { subYears, isBefore } from 'date-fns';

const formSchema = z.object({
  name: z.string().min(1, { message: "Campo obrigatório." }),
  description: z.string().optional(),
  timezone: z.string().optional(),
  country: z.string().optional(),
  language: z.string().optional(),
  dob: z
    .string()
    .nonempty({ message: "Campo obrigatório." })
    .refine(
      (dateStr) => {
        const date = new Date(dateStr);
        const eighteenYearsAgo = subYears(new Date(), 18);
        return isBefore(date, eighteenYearsAgo);
      },
      { message: "Você deve ter pelo menos 18 anos de idade." }
  ),
});

const EditProfile = () => {
  const navigate = useNavigate();
  const {currentUser} = useSelector((state) => state.user);
  const { t } = useTranslation();
  const dispatch = useDispatch()

  const [user, setUser] = useState({});
  const [userEmail, setUserEmail] = useState({});
  const [isSubmitting1, setIsSubmitting1] = useState(false);
  const [isSubmitting2, setIsSubmitting2] = useState(false);
  const [errorUpload, setErrorUpload] = useState(false);
  const [errorModeration, setErrorModeration] = useState(false);
  const [isDeleted, setDeleted] = useState(false);
  const [profileSecret, setProfileSecret] = useState(false);

  const {register, handleSubmit, control, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: user.name,
      description: user.description,
      country: user.country,
      timezone: user.timezone,
      language: user.language
    }
  });

  const { field: timezoneField } = useController({
    name: "timezone",
    control,
  });
  
  const { field: countryField } = useController({
    name: "country",
    control,
  });

  const { field: languageField } = useController({
    name: "language",
    control,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/me`);
        setUser(res.data);

        if (res.data.tagsFeatured && res.data.tagsFeatured.length > 0) {
          setTags(res.data.tagsFeatured)
        }
        
        const profileSecret = res.data.profileSecret
        if (profileSecret && profileSecret === 1) {
          setProfileSecret(true)
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    fetchUser();
  }, [currentUser, dispatch]);

  useEffect(() => {
    if (currentUser) {
      const fetchUser = async () => {
        try {
            await axios.get(`/api/auth/session`);
        } catch (error) {
          if (error.response && error.response.status === 404 || error.response.status === 403 || error.response.status === 401) {
            localStorage.removeItem("persist:root");
            window.location.reload();
          } else {
            console.error("Erro em requisição", error);
          }
        }
      };
      fetchUser();
    }
  }, [currentUser]);

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

  const cloud_name = (import.meta.env.VITE_CLOUD_NAME);
  const [img, setImage] = useState(user.img);

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

  const handleSubmit1 = async () => {
    setIsSubmitting1(true);
    try {
      const response = await axios.post(`/api/resetauth/deleteUser`);
      const idReq = response.data._id;
      var templateParams = {
        subject: 'Delete your account',
        name: user.name,
        email: userEmail.email,
        text: 'We received a request to delete your account on Ilhanet. This decision may be irreversible.',
        buttonText: 'Delete account',
        typeLink: 'deleted-user',
        buttonLink: idReq,
      };
      emailjs.send('service_9fby7fw', 'template_hhediap', templateParams, import.meta.env.VITE_EMAILJS);
      setDeleted(true);
    } catch (error) {
      console.error("Erro ao seguir usuário:", error);
    }
  };

  const handleSubmit2 = async () => {
    setIsSubmitting1(true);
    try {
      const generateCode = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const codeNumber = Math.floor(100000 + Math.random() * 900000).toString();
            resolve(codeNumber);
          }, 2000);
        });
      };
      const codeNumber = await generateCode();  

      const response = await axios.post(`/api/resetauth/confirmEmail`, {code: codeNumber});
      const idReq = response.data._id;
      var templateParams = {
        subject: 'Confirm email',
        name: user.name,
        email: userEmail.email,
        text: 'We received a request to confirm the email for your Ilhanet account. This decision may be irreversible.',
        codeText: `Your code is ${codeNumber}`, 
        buttonText: 'Confirm',
        typeLink: 'confirm-email',
        buttonLink: idReq,
      };
      emailjs.send('service_9fby7fw', 'template_hhediap', templateParams, import.meta.env.VITE_EMAILJS);
      setDeleted(true);
      navigate(`/confirm-email/${idReq}`);
    } catch (error) {
      console.error("Erro ao seguir usuário:", error);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.put(`/api/users/edit`, 
      { name: data.name, description: data.description, timezone: data.timezone, country: data.country, language: data.language, dob: data.dob, img: myImage2 || img, 
        tagsFeatured: tags
      });
      document.cookie = `in_timezone=${response.data.timezone}; expires=365; path=/`;
      console.log(response.data._id);

      toast(t("Edição salva."))
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      if (err.response && err.response.status === 409) {
        setServerErrors({ ...serverErrors, [err.response.data.error.split(' ')[0].toLowerCase()]: err.response.data.error });
      } else {
        console.error("An unexpected error occurred:", err);
      }
    }
  };

  const [charCount1, setCharCount1] = useState(0);
  const [charCount3, setCharCount3] = useState(0);

  useEffect(() => {
    setValue('name', user.name);
    setValue('description', user.description);
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

  const charLimit1 = 50;
  const charLimit3 = 180;

  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Função para adicionar uma tag
  const handleKeyDown = (e) => {
    if (e.key === ' ' && inputValue.trim() !== '') {
      // Impedir duplicatas
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue(''); // Limpa o campo de input
    }
  };

  // Função para remover uma tag
  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

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

      {user ? (
        <div className="Main">
          <div className="EditHeader">
            <h1>{t("Editar perfil")}</h1>

            {profileSecret ? (
              <div className="imgProfile">
                <img src={user.img} alt="" />
              </div>
            ):(
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
                <img src={myImage2 || user.img} alt="" />

                <input type="file" id="fileInput" className="hidden-input" accept="image/*" onChange={handleFile}/>
              </div>
            )}

            {errorUpload && <label className="error-text"><span>{t("msgTypeFile")}</span></label>}
            {errorModeration && <label className="error-text"><span>{t("msgModerationFile")}</span></label>}
          </div>

          <form className="grid w-full gap-2" onSubmit={handleSubmit(onSubmit)}>
            {profileSecret && (
              <div className="w-full">
                <div className="info-alert">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                  <p>{t("msgProfileSecret")}</p>
                </div>
              </div>
            )}

            {profileSecret ? (
              <div>
                <Label>{t("Nome")}</Label>
                <Input id="name" defaultValue={user.name} disabled/>
              </div>
            ):(
              <div>
                <Label>{t("Nome")}</Label>
                <Input id="name" {...register("name")} defaultValue={user.name} onChange={
                  (e1) => setCharCount1(e1.target.value.length)
                } maxLength={charLimit1}/>
                <div className="detailsInput">
                  <label className="error-text">{errors.name && <span>{t("Campo obrigatório.")}</span>}</label>
                  <span className="countText colorWhite">{charCount1}/{charLimit1}</span>
                </div>
              </div>
            )}

            {profileSecret ? (
              <div>
                <Label>{t("Nome de usuário")}</Label>
                <Input id="username" value={user.username} disabled />
              </div>
            ):(
              <div>
                <Label>{t("Nome de usuário")}</Label>
                <Input id="username" value={user.username} disabled />
                <Link to="username">
                  <span className="msg2 col-3"><b>{t("Alterar nome de usuário")}</b></span>
                </Link>
              </div>
            )}

            <div>
              <Label>{t("Email")}</Label>
              <Input id="email" {...register("email")} value={userEmail.email} disabled type="email" />
              {userEmail.confirmEmail === 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <span className="msg2 col-3"><b>{t("Confirmar email")}</b></span>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("Confirmar email")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("msgAlterar")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("Cancelar")}</AlertDialogCancel>
                        <Button onClick={handleSubmit2} disabled={isSubmitting1}>
                          {isSubmitting1 && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {t("Continuar")}
                        </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {userEmail.confirmEmail === 1 && (
                <span className="msg col-2"><b>{t("Confirmado")}</b></span>
              )}
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

            <div className='flex flex-col gap-1'>
              <Label>{t("Data de nascimento")}</Label>
              <Input id="dob" className="w-full" defaultValue={user.dob} {...register("dob")} type="date" />

              <div className="detailsInput">
                <label className="error-text">{errors.dob && <span>{t("msgErrorDOB")}</span>}</label>
              </div>
            </div>

            <div>
              <Label>{t("Tags destacadas")}</Label>
              <p className="mb-2 text-sm text-muted-foreground">
                {t("msgAddTags")}
              </p>

              <div className="tag-container">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <ul className="tag-list">
                  {tags.map((tag, index) => (
                    <li key={index} className="tag">
                      {tag}
                      <span className="tag-close" onClick={() => removeTag(index)}>
                        &times;
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <LanguageList field={languageField} control={control} user={user}/>
            </div>

            <div>
              <CountryList field={countryField} control={control} user={user}/>
            </div>

            <div>
              <TimezoneList field={timezoneField} control={control}/>
              <span className="timezone col-2">{t("Fuso horário")}: {user.timezone}</span>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("Salvar")}
            </Button>

            <br />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isSubmitting}>
                  {t("Excluir conta permanente")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("Excluir conta permanente")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("msgDeletarConta")}
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {isDeleted ? (
                  <div className="info-alert">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {t("Enviamos o link para seu email")}.
                  </div>
                ):("")}

                <AlertDialogFooter>
                  <AlertDialogCancel>{t("Cancelar")}</AlertDialogCancel>
                  {isDeleted ? (""):(
                    <Button onClick={handleSubmit1} disabled={isSubmitting1}>
                      {isSubmitting1 && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t("Continuar")}
                    </Button>
                  )}
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </div>
      ):(
        <div className="loadingPosts py-4 col-3">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      <Menu/>
    </aside>
  );
}

export default EditProfile;
