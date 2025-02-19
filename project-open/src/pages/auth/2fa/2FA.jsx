import "../../../styles/main.sass"
import "../../../styles/styles.sass"
import "../../../styles/pages/Login.sass"

import { Loading } from "@/components/loading";

import Menu from "@/components/Menu";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";

import { useTranslation } from "react-i18next";
import NotFoundPage from "@/pages/NotFound";
import { Loader2 } from "lucide-react";

const TwoFA = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { search } = window.location;
  const path = new URLSearchParams(search).get('user');

  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/id/${path}`);
        setUser(res.data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    fetchUser();
  }, [path]);

  const [loading, setLoading] = useState(false);

  const buttonEmail = async () => {
    setLoading(true)

    const codeNumber = Math.floor(100000 + Math.random() * 900000).toString();

    const res = await axios.post("/api/auth/signin2FA", { userId: path, type: 'email', code: codeNumber });
    const email = res.data.email

    var templateParams = {
      subject: '2FA',
      name: "user",
      email: email,
      text: 'We received a request to reset your password on Ilhanet.',
      codeText: `Your code is ${codeNumber}`,
      buttonText: 'Continue',
      typeLink: 'auth/2fa-email',
      buttonLink: res.data.twofa,
    };
    emailjs.send('service_9fby7fw', 'template_hhediap', templateParams, import.meta.env.VITE_EMAILJS);

    navigate(`/auth/2fa-email/${res.data.twofa}`);
  };

  const buttonDevice = async () => {
    setLoading(true)

    const codeNumber = Math.floor(100000 + Math.random() * 900000).toString();

    const res = await axios.post("/api/auth/signin2FA", { userId: user._id, type: 'device', code: codeNumber });

    navigate(`/auth/2fa-device/${res.data.twofa}`);
  };

  if (!user) {
    return <NotFoundPage />;
  }

  return (
      <aside id="Login2FA" className="Container">
        <Loading/>

        <div className="headerBack bg-1">
          <div className="hbButton col-3" onClick={() => navigate(-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </div>
        </div>

        <div className="Main">
          <h1 className="titlePage">{t("Verificação de duas etapas")}</h1>
          <span className="msg col-2">{t("Escolha a forma de receber seu código de acesso:")}</span>

          {loading ? (
            <Loader2 className="col-3 h-5 w-5 animate-spin" />
          ):(
            <div className="px-3 flex flex-col gap-3 w-full">
              <div className="buttonCode" onClick={buttonDevice}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-15a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 4.5v15a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                {t("Receber por outro dispositivo logado")}
              </div>

              <div className="buttonCode" onClick={buttonEmail}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                {t("Receber por email")}
              </div>
            </div>
          )}
        </div>

        <Menu/>
      </aside>
  );
}

export default TwoFA;
