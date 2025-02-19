import "../styles/main.sass";
import "../styles/pages/PageHome.sass";

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import logo from '../img/logo.svg'
// import imgvpn from '../img/imgvpn.svg'
// import img2 from '../img/Group6.svg'
import computador from '../img/computador.png';
import imgX from "../img/x-social.svg"
import imgAgenciaBrasil from "../img/home/logo-agenciabrasil.svg"
import imgG1 from "../img/home/Logotipo_g1.svg.png"
import imgPoder from "../img/home/poder_5.svg"
import imgGP from "../img/home/Gazeta-do-Povo-2020.webp"

import Header2 from "@/components/Header2";
import { InstagramIcon, PencilLine } from "lucide-react";

const PageHome = () => {
  const { t } = useTranslation();

  return (
    <aside id="PageHome" className="Container1">
      <Helmet>
        <title>Ilhanet</title>
      </Helmet>

      <Header2/>

      <div className="Main">
        <div className="Section">
          <h1>{t("Sua rede resistível")}</h1>
          <p>{t("msgPageHome1")}</p>

          <div className="button mb-5">
            <Link to="/auth/login">
              <Button className="bg-1">
                {t("Entrar")}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </Button>
            </Link>
          </div>

          <img src={computador} alt="" />
        </div>

        <div className="button2 mb-10">
          <Link to="/ilhanet">
            <Button className="bg-2">
              <span>{t("Veja nosso perfil")} <b>@ilhanet</b></span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </Button>
          </Link>
        </div>

        <div className="Section3">
          <div className="SectionTitle"><h1>{t("NÃO A CENSURA!")}</h1></div>

          <div className="Items gap-3">
            <div className="Item">
              <img src={imgAgenciaBrasil} className="w-[135px]" alt="" />
              <h2>{t("msg6PH")}</h2>
              <span>{t("29 de agosto de 2024")}</span>
            </div>

            <div className="Item">
              <img src={imgG1} className="w-[25px]" alt="" />
              <h2>{t("msg7PH")}</h2>
              <span>{t("9 de agosto de 2024")}</span>
            </div>
          </div>

          <div className="Items Items2 gap-3">
            <div className="Item">
              <img src={imgPoder} className="w-[70px]" alt="" />
              <h2>{t("msg9PH")}</h2>
              <span>{t("23 de dezembro de 2023")}</span>
            </div>

            <div className="Item">
              <img src={imgGP} className="w-[90px]" alt="" />
              <h2>{t("msg10PH")}</h2>
              <span>{t("30 de janeiro de 2024")}</span>
            </div>
          </div>

          <p className="desc">{t("msg8PH")}</p>
        </div>

        <div className="Section gap-4">
          <div className="SectionTitle"><h1>{t("AQUI VOCÊ PODE")}</h1></div>
          <div className="SectionItem">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-9">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>

            <div className="SectionItem2">
              <h2>{t("Criar seus posts")}</h2>
              <p>{t("msg1PH")}</p>
            </div>
          </div>

          <div className="SectionItem">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-9">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>

            <div className="SectionItem2">
              <h2>{t("Criar seus artigos")}</h2>
              <p>{t("msg2PH")}</p>
            </div>
          </div>

          <div className="SectionItem">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" className="size-9">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>

            <div className="SectionItem2">
              <h2>{t("Criar seus grupos")}</h2>
              <p>{t("msg3PH")}</p>
            </div>
          </div>

          <div className="SectionItem">
            <PencilLine className="size-9" strokeWidth={1.8} /> 

            <div className="SectionItem2">
              <h2>{t("Criar suas petições")}</h2>
              <p>{t("msg4PH")}</p>
            </div>
          </div>

          <div className="SectionItem">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-9">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>

            <div className="SectionItem2">
              <h2>{t("Compartilhar suas lives do Rumble")}</h2>
              <p>{t("msg5PH")}</p>
            </div>
          </div>

        </div>

        {/* <div className="Section">
          <h1>{t("VPN GRATUITA")}</h1>
          <p>{t("msgPageHome2")}</p>
          <img src={imgvpn} alt="" />
        </div> */}

        {/* <div className="Main2">
          <div className="Section">
            <div>
              <h1>{t("ACESSE A PLATAFORMA.")}</h1>

              <div className="buttons">
                <Link to="/">
                  <Button className="bg-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    WEB
                  </Button>
                </Link>
                <Link to="#"><Button className="bg-1">Android (Play Store)</Button></Link>
                <Link to="#"><Button className="bg-1">iOS (App Store)</Button></Link>
                <Link to="#"><Button className="bg-1">Android (APK)</Button></Link>
              </div>
            </div>

            <div>
              <img src={img2} alt="" />
            </div>
          </div>
        </div> */}

        <div className="Footer">
          <div className="logo">
            <img src={logo} alt="" />
          </div>

          <div className="linksFooter">
            <div className="linkSocial">
              <Link to="/ilhanet"><img src={logo} alt="" /></Link>
              <Link to="https://x.com/ilhanet_social"><img src={imgX} alt="" /></Link>
              <Link to="https://instagram.com/ilhanet_social"><InstagramIcon /></Link>
            </div>

            <div className="flex gap-3">
              <Link title="info@ilhanet.com" to="mailto:info@ilhanet.com">{t("Contato")}</Link>
              <Link to="/i/policies">{t("Políticas e termos")}</Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default PageHome;
