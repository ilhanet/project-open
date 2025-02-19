import "../styles/components/Post.sass"
import { Link, useLocation,  } from "react-router-dom";

import TextOverflow from 'react-text-overflow';

import { Numeral } from "react-numeral";
import { useEffect, useState } from "react";
import { Pin, PinOff } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const User = ({ userItem }) => {
  const {currentUser} = useSelector((state) => state.user);
  const { t } = useTranslation();
  const [user, setUser] = useState([]);
  const [groups, setGroups] = useState([]);
  const path = useLocation().pathname.split("/")[3];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/id/${userItem._id}`);
        setUser(res.data);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    };
    fetchUser();
  }, [userItem._id]);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`/api/groups/id/${path}`);
          setGroups(res.data);
      } catch (error) {
        console.error("Erro ao buscar grupos:", error);
      }
    };
    fetchGroup();
  }, [path]);

  const [isBlock, setIsBlock] = useState(false);

  useEffect(() => {
    if (currentUser._id === groups.userId) {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`/api/groups/block-check/${path}/${userItem._id}`);
    
          if (res.data.blockedYou === true) {
            setIsBlock(true);
          } else {
            setIsBlock(false);
          }
      } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      };
      fetchPosts();
    }
  }, [userItem._id, path, groups.userId, currentUser]);

  const handleBlock = async () => {
      try {
        await axios.post(`/api/groups/blockUser/${path}/${userItem._id}`);
        setIsBlock(true);
      } catch (error) {
        console.error("Erro ao bloquear usuário:", error);
      }
  };

  const handleUnblock = async () => {
      try {
        await axios.put(`/api/groups/unblockUser/${path}/${userItem._id}`);
        setIsBlock(false);
      } catch (error) {
        console.error("Erro ao desbloquear usuário:", error);
      }
  }

  return (
  <div className="userItem w-full col-1" key={user.id}> 
    <Link to={`/p/${user.username}`} key={user.id}> 
      <div className="flex gap-2 w-full">
        <img src={user.img} alt="" /> 

        <div className="Details">
          <div className="Username">
            <h1><TextOverflow text={user.name} /></h1>

            {user.verified === 1 ? (
              <svg className="verified1 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
              </svg>
            ):("")}

            <span className="flex items-center">@<TextOverflow text={user.username} /></span> {/* Suponho que 'username' seja uma propriedade do objeto do usuário */}
          </div>

          {(user.followersCount === 0) ? (
            <span className="col-2 followers">0 {t("seguidores")}</span> 
          ):(
            <span className="col-2 followers"><Numeral value={user.followersCount} format={"0,0"}/> {t("seguidores")}</span>
          )}
        </div>
      </div>
    </Link>

    {currentUser && 
        user._id !== currentUser._id && 
        groups.userId === currentUser._id && 
      <DropdownMenu>
        <DropdownMenuTrigger className="col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isBlock ? (
            <DropdownMenuItem onClick={handleUnblock}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              {t("Debloquear usuário de grupo")}
            </DropdownMenuItem>
          ):(
            <DropdownMenuItem onClick={handleBlock}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              {t("Bloquear usuário de grupo")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    }
  </div>

  );
}

export default User;
