import "../../styles/main.sass";
import "../../styles/styles.sass";

import "../../styles/pages/Posts.sass";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import Menu from "@/components/Menu";
// import UploadComponent from "@/components/Upload";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NotFoundPage from "../NotFound";
import { toast } from "sonner";
import { Oval } from "react-loader-spinner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const formSchema = z.object({
  titleArticle: z.string().min(1),
  subtitleArticle: z.string().optional(),
});

const EditArticle = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const path = useLocation().pathname.split("/")[3];
  const [isSubmitting2, setIsSubmitting2] = useState(false);
  const [errorContent, setErrorContent] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);
  const [isDesabledButton, setIsDesabledButton] = useState(false);
  const [errorUpload, setErrorUpload] = useState(false);
  const [errorUploadLimit, setErrorUploadLimit] = useState(false);
  const [buttonRemove, setButtonRemove] = useState(false);

  const {currentUser} = useSelector((state) => state.user);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const charLimit = 100;
  const charLimit2 = 100;
  const [charCount, setCharCount] = useState(0);
  const [charCount2, setCharCount2] = useState(0);

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

  const [loading, setLoading] = useState(true);

  const [post, setPost] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/posts/pub/${user.username}/${path}`);
        const post = res.data;

        if (post.status === "on" && post.type === 3 && post.userId === user._id) {
          setPost(post);

          if (post.hashtags && post.hashtags.length > 0) {
            setTags(post.hashtags)
          }

          setLoading(false)
          setNotFound(false);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
        setNotFound(true);
      }
    };

    fetchPosts();
  }, [path, currentUser._id, user]);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titleArticle: post.titleArticle,
    }
  });

  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    if (post.textArticle) {
      setEditorContent(post.textArticle);
    }
  }, [post]);

  useEffect(() => {
    setValue('titleArticle', post.titleArticle);
    setValue('subtitleArticle', post.subtitleArticle);
  }, [post, setValue]);

  useEffect(() => {
    if (post.titleArticle) {
      setCharCount(post.titleArticle.length);
    }
  }, [post.titleArticle]);

  useEffect(() => {
    if (post.subtitleArticle) {
      setCharCount2(post.subtitleArticle.length);
    }
  }, [post.subtitleArticle]);

  const generateRandomFileName = () => `${new Date().getTime()}_${Math.random().toString(36).substring(2, 15)}`;

  // Função para validar arquivos
  const validateFile = (file) => {
    const allowedImageTypes = ['image/png', 'image/jpeg', 'image/webp'];
    const maxSizeMB = 2;
  
    if (file.size > maxSizeMB * 1024 * 1024) {
      return 'File size exceeds the maximum limit of 30MB';
    }
  
    if (!allowedImageTypes.includes(file.type)) {
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
    
      let fileUploadPromise;
  
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
  
      return fileUploadPromise;
    });
  
    try {
      const urls = await Promise.all(fileUploadPromises);
      console.log(urls); // Adicione esta linha para depuração
      setFileUrls(urls);
    } catch (error) {
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

  const modules = {
    toolbar: [
      ['bold', 'underline', 'link'],
    ],
    clipboard: {
      // Configuração para combinar tags ao colar
      matchVisual: false,
    },
  };

  const formats = [
    'font',
    'bold', 'underline',
    'link', 'image'
  ];

  const onSubmit = async (data) => {
    const photos = fileUrls.filter(url => /\.(png|jpg|jpeg|webp)$/.test(url));

    try {
      setIsSubmitting(true);
      setErrorContent(false);
  
      if (fileUrls.length > 0) {
        const res = await axios.put(`/api/posts/edit/${path}`, 
          { titleArticle: data.titleArticle, 
            subtitleArticle: data.subtitleArticle, 
            textArticle: editorContent, 
            photo: photos,
            userId: currentUser._id, 
            hashtags: tags,
            type: 3 
          });

          toast(t("Editado"), {action: {label: t("Ver"), onClick: () => navigate(`/${user.username}/post/${res.data._id}`)}})
        } else {
        const res = await axios.put(`/api/posts/edit/${path}`, 
        { titleArticle: data.titleArticle, 
          subtitleArticle: data.subtitleArticle, 
          textArticle: editorContent, 
          userId: user._id, 
          hashtags: tags,
          type: 3 
        });
        toast(t("Editado"), {action: {label: t("Ver"), onClick: () => navigate(`/${user.username}/post/${res.data._id}`)}})
      }
      navigate(-1);
    } catch (error) {
      setIsSubmitting(false);
      setErrorContent(true);
      console.error("Erro ao postar post:", error);
    }
  };

  const handleChange = (content) => {
    setEditorContent(content);
  };

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
  
  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <aside id="NewPost" className="Container noheaderMenu">
        {loading && 
          <div className="loadingPage bg-1">
            <Oval
              height={50}
              width={50}
              color="#395FEA"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel='oval-loading'
              secondaryColor="#d4d4d4"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
      }
      
      <div className="headerBack bg-1">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main">
        <form className="grid w-full gap-2" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="titleGroup"><b>{t("Editar artigo")}</b></h1>

          <div className="grid gap-3">     
            <div>      
              <Label>{t("Título de artigo")}</Label>
              <Input
                id="titleArticle"
                {...register("titleArticle")}
                defaultValue={post.titleArticle}
                onChange={(e) => setCharCount(e.target.value.length)}
                maxLength={charLimit}
              >
              </Input>
              <div className="detailsInput">
                <label className="error-text">
                  {errors.titleArticle && <span>{t("Campo obrigatório.")}</span>}
                </label>
                <span className="countText colorWhite">{charCount}/{charLimit}</span>
              </div>
            </div>

            <div>      
              <Label>{t("Subtítulo")}</Label>
              <Input
                id="subtitleArticle"
                {...register("subtitleArticle")}
                defaultValue={post.subtitleArticle}
                onChange={(e) => setCharCount2(e.target.value.length)}
                maxLength={charLimit2}
              >
              </Input>
              <div className="detailsInput">
                <label className="error-text">
                  {errors.subtitleArticle && <span>{t("Campo obrigatório.")}</span>}
                </label>
                <span className="countText colorWhite">{charCount2}/{charLimit2}</span>
              </div>
            </div>

            <div>
              <ReactQuill 
                value={editorContent}
                onChange={handleChange} 
                modules={modules}
                formats={formats}
              />

              <div className="detailsInput">
                <label className="error-text">
                  {errorContent && <span>{t("Campo obrigatório.")}</span>}
                </label>
              </div>
            </div>
            
            <Label>{t("Alterar capa de artigo")}</Label>
            <div className="filesUploads">
              <Button type="button" className="buttonUpload" onClick={() => document.getElementById('fileInput').click()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
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
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>{t("Tags")}</AccordionTrigger>
              <AccordionContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  {t("msgAddTags")}
                </p>

                <div className="tag-container">
                  <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Pressione Espaço para adicionar tag"
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button type="submit" disabled={isDesabledButton}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("Salvar")}
          </Button>
        </form>
      </div>
      <Menu/>
    </aside>
  );
};

export default EditArticle;
