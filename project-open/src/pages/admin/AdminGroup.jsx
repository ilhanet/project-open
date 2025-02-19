import Post from "../../components/Post";
import "../../styles/pages/Group.sass";
import "../../styles/main.sass";
import "../../styles/styles.sass";
import Menu from "../../components/Menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"

import { Loading } from "@/components/loading";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Expandable2 from "@/components/Expendable2";
import { Numeral } from "react-numeral";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import TextOverflow from "react-text-overflow";
import axios from "axios";
import NotFoundPage from "../NotFound";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import NoDatos from "../NoDatos";
import DOMPurify from "dompurify";

const AdminGroup = () => {
  const path = useLocation().pathname.split("/")[3];
  const navigate = useNavigate();
  const {currentUser} = useSelector((state) => state.user);
  const { t } = useTranslation();

  const [notFound, setNotFound] = useState(false);
  const [groups, setGroups] = useState([]);
  const [notDatos, setNotDatos] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`/api/admin/groups/${path}`);
        if (res.data) {
          setGroups(res.data);
        } else {
          setNotFound(true);
        }  

        if (res.data.status === "blocked") {
          setIsBlock(true);
        } else {
          setIsBlock(false);
        }
      } catch (error) {
        console.error("Erro ao buscar grupos:", error);
        setNotDatos(true);
      }
    };
    fetchGroup();
  }, [path]);

  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/admin/user/id/${groups.userId}`);
        setUser(res.data);
      } catch (error) {
        console.error("Erro ao buscar vídeos:", error);
      }
    };
    fetchUser();
  }, [groups.userId]);

  const [Posts, setPosts] = useState([]);

  useEffect(() => {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`/api/admin/posts/group/${path}`);
          setPosts(res.data);
        } catch (error) {
          console.error("Erro ao buscar posts:", error);
        }
      };
      fetchPosts();
  }, [groups, path]);

  const [isBlock, setIsBlock] = useState(false);

  const handleBlock = async () => {
    try {
      await axios.post(`/api/groups/blockAdmin/${path}`);
      setIsBlock(true);
    } catch (error) {
      console.error("Erro ao bloquear usuário:", error);
    }
  };

  const handleUnblock = async () => {
      try {
        await axios.put(`/api/groups/unblockAdmin/${path}`);
        setIsBlock(false);
      } catch (error) {
        console.error("Erro ao desbloquear usuário:", error);
      }
  }

  const descriptionHTML = DOMPurify.sanitize(groups.description);

  const [visiblePostsCount, setVisiblePostsCount] = useState(15);
  const [loading, setLoading] = useState(false);

  const loadMorePosts = () => {
    setLoading(true);
    setTimeout(() => {
      setVisiblePostsCount((prevCount) => prevCount + 15);
      setLoading(false);
    }, 800); // Simulando um pequeno delay para carregar mais posts
  };

  const [userAuth, setAuth] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/auth/authId`);
        setAuth(res.data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    fetchUser();
  }, [currentUser]);

  if (userAuth.admin !== 1) {
    return <NotFoundPage />;
  }

  if (notDatos) {
    return <NoDatos />;
  }

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <aside id="Group" className="Container">
      <Loading/>

      <div className="headerBack bg-1">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>

      <div className="Main"> 
        {groups.img && <img src={groups.img} className="thumbGroup" alt="" />}       

        <div className="headerGroup">
          <div className="hu-details1">
            <div className="hu-details2">
              <h1>{groups.title}</h1>

              <div className="flex">
                <Link to={`/${user.username}`}>
                  <div className="Username">
                    <img src={user.img} alt="" />
                      <h1><TextOverflow text={user.name} /></h1>

                      {user.verified === 1 ? (
                        <svg className="verified1 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                        </svg>
                      ):("")}
                      
                      <span className="flex items-center">@<TextOverflow text={user.username} /></span>
                  </div>
                </Link>
              </div>
            </div>

            {currentUser &&
              <div className="hu-buttons">
                <DropdownMenu>
                  <DropdownMenuTrigger className="col-1">
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
                        Debloquear grupo
                      </DropdownMenuItem>
                    ):(
                      <DropdownMenuItem onClick={handleBlock}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                        Bloquear grupo
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            }
          </div>

          <div className="hu-details3">
            <div className="hu-numbers">
              <span onClick={() => navigate(`/group/members/${path}`)}>
                <b title={100}><Numeral value={groups.followsCount} format={"0a"}/></b> {t("membros")}
              </span>
            </div>

            {groups.description ? (
              <Expandable2 className="col-2">
                {descriptionHTML}
              </Expandable2>
            ):("")}

            <br/>
            <p>Status: {groups.status}</p>
          </div>
        </div>

        {Posts.length === 0 ? (
          <span className="NoItems">{t("Nenhum post")}.</span>
        ) : (
          Posts.slice(0, visiblePostsCount).map((post) => <Post key={post._id} post={post} /> )
        )}

        {visiblePostsCount < Posts.length && (
          <Button variant="outline" className="MoreButton col-3" onClick={loadMorePosts} disabled={loading}>
            {loading ? 
            (<Loader2 className="mr-2 h-4 w-4 animate-spin" />):(<>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
              {t("Ver mais posts")}
            </>)}
          </Button>
        )}
      </div>

      <Menu/>
    </aside>
  );
}

export default AdminGroup;
