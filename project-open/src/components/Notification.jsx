import "../styles/pages/Notifications.sass";
import "../styles/main.sass";
import "../styles/styles.sass";

import TimeAgo from 'react-timeago'
import ptBR from 'react-timeago/lib/language-strings/pt-br'
import en from 'react-timeago/lib/language-strings/en'
import es from 'react-timeago/lib/language-strings/es'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const languageStrings = {
  en: en,
  ptBR: ptBR,
  es: es
};

const Notification = ({notifications}) => {
  const { t } = useTranslation();
  const currentLanguage = (t("Iso2"));

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift(); // Retorna o valor do cookie
    }
    return null; // Cookie não encontrado
  }
  
  const timezone = getCookie('in_timezone');
  if (!timezone) {
    const defaultTimezone = 'America/Sao_Paulo';
    document.cookie = `in_timezone=${defaultTimezone}; expires=365; path=/`;
  }

  const formatter = buildFormatter(languageStrings[currentLanguage] || languageStrings.en);
  const date = moment(notifications.createdAt).tz(timezone);
  const dateFormat = moment(notifications.createdAt).tz(timezone).format('DD, MMMM, YYYY HH:mm');

  const photoImg = "https://res.cloudinary.com/dn38dixg6/image/upload/c_auto,h_400,w_400/imgprofile_1725493971381_7j2jw6izo8r?_a=DATAdtAAZAA0";

  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (notifications.userId) {
          const res = await axios.get(`/api/users/pub/${notifications.userId}`);
          setUser(res.data);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };
    fetchUser();
  }, [notifications.userId]);

  const [user1, setUser1] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/me`);
        setUser1(res.data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <Link to={
      notifications.typeNotification === "follow" ? `/${user.username}` :
      notifications.typeNotification === "like" ? `/${user1.username}/post/${notifications.postId}` :
      notifications.typeNotification === "comment" ? `/${user1.username}/post/${notifications.postId}` :
      notifications.typeNotification === "reply" ? `/comment/${notifications.commentId}` :
      notifications.typeNotification === "commentlike" ? `/comment/${notifications.commentId}` :
      '#'
    }>      
      <div className="notificationsItem">
        <img src={user.img || photoImg} alt="" />

        <div className="n-text">
          <span>
          {notifications.userId && (<b>@{user.username} </b>)}
          {notifications.typeNotification === "like" ? (t("curtiu seu post")):("")}
          {notifications.typeNotification === "follow" ? (t("segue você")):("")}
          {notifications.typeNotification === "comment" ? (t("comentou seu post")):("")}
          {notifications.typeNotification === "reply" ? (t("respondeu seu comentário")):("")}
          {notifications.typeNotification === "commentlike" ? (t("curtiu seu comentário")):("")}
          {notifications.typeNotification === "2fa" ? (t("O seu código de acesso solicitado é:")):("")}
          <b> {notifications.code}</b>
          </span>
          {notifications.createdAt && <TimeAgo date={date} title={dateFormat} formatter={formatter} className="col-2" />}
        </div>
      </div>
    </Link>
  );
}

export default Notification;
