import "../../styles/main.sass"
import "../../styles/styles.sass"

import "../../styles/pages/Posts.sass"
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Loading } from "@/components/loading";
import NotFoundPage from "../NotFound";
import { useTranslation } from 'react-i18next';
import NoDatos from "../NoDatos";
import Menu from "@/components/Menu";
import { toast } from "sonner";

const formSchema = z.object({
  post: z.string().min(1, {
    message: "Campo obrigatório.",
  }),
});

const NewPostGroup = () => {
  const path = useLocation().pathname.split("/")[3];
  const { t } = useTranslation();
  const {currentUser} = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [groupCheck, setGroupCheck] = useState(false);
  const [group, setGroups] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [notFound, setNotFound] = useState(false);
  const [notDatos, setNotDatos] = useState(false);

  const [errorUpload, setErrorUpload] = useState(false);
  const [errorUploadLimit, setErrorUploadLimit] = useState(false);
  const [buttonRemove, setButtonRemove] = useState(false);
  const [isSubmitting2, setIsSubmitting2] = useState(false);
  const [isDesabledButton, setIsDesabledButton] = useState(false);

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
  }, []);

  useEffect(() => {
    if (currentUser) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`/api/groups/userActivities/${path}`);
  
          if (res.data.blockedYou === true || res.data.follow === false) {
            setGroupCheck(true);
          } else {
            setGroupCheck(false);
          }
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      };
      fetchPosts();
    }
  }, [currentUser, path]);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`/api/groups/id/${path}`);
        if (res.data) {
          setGroups(res.data)
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Erro ao buscar grupos:", error);
        setNotDatos(true);
      }
    };
    fetchGroup();
  }, [path]);

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);

  // Função para gerar nomes de arquivos aleatórios
  const generateRandomFileName = () => `${new Date().getTime()}_${Math.random().toString(36).substring(2, 15)}`;

  // Função para criar miniatura de vídeo
  const createThumbnail = (videoFile) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(videoFile);
      video.load();
  
      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
  
        video.currentTime = video.duration / 2;
        video.onseeked = () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL('image/png');
          resolve(thumbnailUrl);
        };
      };
    });
  };

  // Função para validar arquivos
  const validateFile = (file) => {
    const allowedImageTypes = ['image/png', 'image/jpeg', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/m4v'];
    const maxSizeMB = 30;
  
    if (file.size > maxSizeMB * 1024 * 1024) {
      return 'File size exceeds the maximum limit of 30MB';
    }
  
    if (!allowedImageTypes.includes(file.type) && !allowedVideoTypes.includes(file.type)) {
      return 'Unsupported file type';
    }
  
    return null; // Validação bem-sucedida
  };
  
  // Função para fazer o upload dos arquivos
  const uploadFiles = async (files) => {
    setIsSubmitting2(true);
    setIsDesabledButton(true);
  
    const fileUploadPromises = files.map(async (file) => {
      const randomFileName = generateRandomFileName();
      const validationError = validateFile(file);
  
      if (validationError) {
        throw new Error(validationError);
      }
  
      // Função para verificar se o tipo de vídeo é aceito
      const isAcceptedVideoType = (file) => {
        const acceptedTypes = ['mp4', 'mov', 'm4v'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        return acceptedTypes.includes(fileExtension);
      };
  
      let fileUploadPromise;
  
      if (file.type.startsWith('video/') && isAcceptedVideoType(file)) {
        // Se for um vídeo, cria uma thumbnail e faz o upload dela
        const thumbnailUrl = await createThumbnail(file);
        const thumbnailData = thumbnailUrl.split(',')[1];
  
        // Enviar thumbnail
        await axios.post('/api/upload', {
          fileName: `${randomFileName}_thumbnail.png`,
          fileContent: thumbnailData,
          fileType: 'image/png'
        });
  
        // Agora faça o upload do vídeo
        fileUploadPromise = new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const fileContent = reader.result.split(',')[1];
            try {
              const response = await axios.post('/api/upload', {
                fileName: randomFileName + '.' + file.name.split('.').pop(),
                fileContent: fileContent,
                fileType: file.type
              });
              resolve(response.data.fileUrl);
            } catch (error) {
              reject(error);
            }
          };
          reader.readAsDataURL(file);
        });
      } else {
        // Se não for um vídeo, apenas faça o upload do arquivo
        fileUploadPromise = new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const fileContent = reader.result.split(',')[1];
            try {
              const response = await axios.post('/api/upload', {
                fileName: randomFileName + '.' + file.name.split('.').pop(),
                fileContent: fileContent,
                fileType: file.type
              });
              resolve(response.data.fileUrl);
            } catch (error) {
              reject(error);
            }
          };
          reader.readAsDataURL(file);
        });
      }
  
      return fileUploadPromise;
    });
  
    try {
      const urls = await Promise.all(fileUploadPromises);
      console.log(urls); // Adicione esta linha para depuração
      setFileUrls(urls);
    } catch (error) {
      handleRemoveAllFiles();
      setButtonRemove(false);
      console.error('Error uploading files:', error);
    } finally {
      setIsSubmitting2(false);
      setIsDesabledButton(false);
      setButtonRemove(true);
    }
  };
    
  // Função para lidar com a mudança de arquivos
  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
  
    // Verifica o limite de arquivos
    if (selectedFiles.length + files.length > 4) {
      setIsDesabledButton(true);
      setErrorUploadLimit(true);
      setButtonRemove(true);
      return; // Não prossegue se exceder o limite
    }
  
    // Filtra arquivos válidos e inválidos
    const validFiles = selectedFiles.filter(file => !validateFile(file));
    const errorFiles = selectedFiles.filter(file => validateFile(file));
  
    // Se houver arquivos inválidos, exibe a mensagem de erro
    if (errorFiles.length > 0) {
      setFiles([]);
      setPreviews([]);
      setErrorUpload(true);
      document.getElementById('fileInput').value = '';
      return; // Não processa arquivos inválidos
    } else {
      setErrorUpload(false);
    }
  
    // Gera previews para arquivos válidos
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
  
    setFiles(validFiles);
    setPreviews(newPreviews);
  
    // Faça o upload automático dos arquivos válidos
    try {
      await uploadFiles(validFiles);
    } catch (error) {
      console.error('Error uploading files:', error);
      setErrorUpload(true); // Mostra erro se o upload falhar
    }
  };

  const generateLink = () => {
    const numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
    const uppercaseLetters = Array.from({ length: 3 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
    const lowercaseLetters = Array.from({ length: 3 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
  
    return `${uppercaseLetters}${lowercaseLetters}${numbers}`;
  };  

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setIsDesabledButton(true);

    try {
      const shortLink = generateLink();

      const photos = fileUrls.filter(url => /\.(png|jpg|jpeg|webp)$/.test(url));
      const videos = fileUrls.filter(url => /\.(mp4|mov|MOV|m4v)$/.test(url));
      const videoThumbs = videos.map(url => url.replace(/\.(mp4|mov|MOV|m4v)$/, '') + '_thumbnail.png');

      const res = await axios.post(`/api/posts/group/create/${path}`, 
        { userId: user._id, 
          text: data.post, 
          photo: photos,
          video: videos,
          videoThumb: videoThumbs,  
          shortLink: shortLink });
          toast(t("Publicado"), {action: {label: t("Ver"), onClick: () => navigate(`/${user.username}/post/${res.data._id}`)}})
          navigate(-1);
    } catch (error) {
      console.error("Erro ao postar post:", error);
    }
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
    setPreviews([]);
    setFileUrls([]);
    setErrorUpload(false);
    setErrorUploadLimit(false);
    setButtonRemove(false);
    setIsDesabledButton(false);
    document.getElementById('fileInput').value = '';
  };

  const [charCount, setCharCount] = useState(0);
  const charLimit = 280;

  if (!currentUser) {
    navigate(`/auth/login?redirect=/newpost/group/${path}`)
  }

  if (notDatos) {
    return <NoDatos />;
  }

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <aside id="NewPost" className="Container NoMenu noheaderMenu">
      <Loading/>
      <Menu/>

      <div className="headerBack bg-1">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main">
        {groupCheck ? (
          <div className="w-full px-3">
            <div className="info-alert">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              {t("Você não está participando neste grupo")}.
            </div>
          </div>     
        ):(
          <form className="grid w-full" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="titleGroup">{t("Postar em grupo")}: <b>{group.title}</b></h1>

            <div>
              <Textarea id="post" {...register("post")} placeholder={t("Digite aqui.")} onChange={
                (e) => setCharCount(e.target.value.length)
              } maxLength={charLimit}/>
              <div className="detailsInput">
                <label className="error-text">{errors.post && <span>{t("Campo obrigatório.")}</span>}</label>
                <span className="countText colorWhite">{charCount}/{charLimit}</span>
              </div>
            </div>

            <div className="filesUploads">
            <Button type="button" className="buttonUpload" onClick={() => document.getElementById('fileInput').click()}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </Button>

            {isSubmitting2 && (<Loader2 className="h-7 w-7 ml-1 col-2 animate-spin" />)}

            {buttonRemove && (
              <div className="removeFiles" onClick={handleRemoveAllFiles}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-9 col-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
            )}

            <input type="file" id="fileInput" multiple accept="image/*,video/*" onChange={handleFileChange} />
          </div>
          
          {errorUpload && <div><label className="error-text"><span>{t("msgLimitFile")}</span></label></div>}
          {errorUploadLimit && <div><label className="error-text"><span>{t("msgLimitFile2")}</span></label></div>}

            {previews.length > 0 && (
              <div className="uploads">
                {previews.map((preview, index) => (
                  <div className="uploadItem" key={index}>
                    {files[index].type.startsWith('image/') ? (
                      <img src={preview} alt={`Preview ${index}`} />
                    ) : files[index].type.startsWith('video/') ? (
                      <div className="video"><video controls style={{ maxWidth: '400px' }}>
                        <source src={preview} type={files[index].type} />
                        Your browser does not support the video tag.
                      </video></div>
                    ) : (
                      <p>Preview não disponível para este tipo de arquivo.</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Button type="submit" disabled={isDesabledButton}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("Postar")}
            </Button>
          </form>
        )}
      </div>
    </aside>
  );
}

export default NewPostGroup;
