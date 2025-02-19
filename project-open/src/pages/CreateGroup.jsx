import "../styles/main.sass";
import "../styles/styles.sass";
import "../styles/pages/EditProfile.sass";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import {Cloudinary} from "@cloudinary/url-gen";
import {Resize} from '@cloudinary/url-gen/actions/resize';
import Menu from "@/components/Menu";
import { Helmet } from "react-helmet";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Campo obrigatório.",
  }),
  description: z.string(),
});

const CreateGroup = () => {
  const navigate = useNavigate();
  const {currentUser} = useSelector((state) => state.user);
  const { t } = useTranslation();
  const [isSubmitting2, setIsSubmitting2] = useState(false);
  const [errorUpload, setErrorUpload] = useState(false);
  const [errorModeration, setErrorModeration] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const cloud_name = (import.meta.env.VITE_CLOUD_NAME);
  const [img, setImage] = useState('');

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
  
    const defaultFileName = `imgthumbgroup_${new Date().getTime()}_${Math.random().toString(36).substring(2, 15)}`;
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
  myImage.resize(Resize.auto(826).height(220))
  const myImage2 = myImage.toURL();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    await axios.post(`/api/groups/create`, { title: data.title, description: data.description, img: myImage2 });
    setTimeout(() => {
      navigate(`/${user.username}/groups`);
    }, 1000);
  };

  const [charCount1, setCharCount1] = useState(0);
  const [charCount3, setCharCount3] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const charLimit1 = 50;
  const charLimit3 = 180;

  return (
    <aside id="EditProfile" className="Container NoMenu noheaderMenu">   
      <Menu/>

      <Helmet>
        <title>{t("Criar grupo")} / Ilhanet</title>
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
          <h1>{t("Criar grupo")}</h1>
        </div>

        <div className="py-2 px-4 w-full"><Label>{t("Capa do grupo")}</Label></div>

        <div className="thumbGroup">
          <div className="buttonUploadThumb" onClick={() => document.getElementById('fileInput').click()}>
            {isSubmitting2 ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ):(
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
            )}
          </div>
          <img src={myImage2 || "none"} alt="" />
          <input type="file" id="fileInput" className="hidden-input" accept="image/png, image/jpg, image/jpeg" onChange={handleFile}/>
        </div>

        <div className="mt-2">
          {errorUpload && <label className="error-text"><span>{t("msgTypeFile")}</span></label>}
          {errorModeration && <label className="error-text"><span>{t("msgModerationFile2")}</span></label>}
        </div>

        <form className="grid w-full gap-2" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label>{t("Nome de grupo")}</Label>
            <Input id="title" {...register("title")} onChange={
              (e1) => setCharCount1(e1.target.value.length)
            } maxLength={charLimit1}/>
            <div className="detailsInput">
              <label className="error-text">{errors.name && <span>{errors.name.message}</span>}</label>
              <span className="countText colorWhite">{charCount1}/{charLimit1}</span>
            </div>
          </div>

          <div>
            <Label>{t("Descrição de grupo")}</Label>
            <Textarea id="description" {...register("description")} onChange={
              (e3) => setCharCount3(e3.target.value.length)
            } maxLength={charLimit3}/>
            <div className="detailsInput">
              <span className="fx1 countText colorWhite">{charCount3}/{charLimit3}</span>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("Criar")}
          </Button>
        </form>
      </div>
    </aside>
  );
}

export default CreateGroup;
