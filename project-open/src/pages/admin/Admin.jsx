import "../../styles/main.sass"
import "../../styles/styles.sass"
import "../../styles/pages/Admin.sass"

import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { Loading } from "@/components/loading";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import Menu from "@/components/Menu";
import { Input } from "@/components/ui/input";
import { Numeral } from "react-numeral";
import { useNavigate } from "react-router-dom";
import TextOverflow from "react-text-overflow";
import { useTranslation } from 'react-i18next';
import NotFoundPage from "../NotFound";

const Admin = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {currentUser} = useSelector((state) => state.user);
  const [usersPopular, setPopular] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/admin/usersPopular`);
        setPopular(res.data);
      } catch (error) {
        console.error("Erro ao buscar usuarios:", error);
      }
    };
      fetchPosts();
  }, []);

  const [usersRecents, setRecents] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/admin/usersRecents`);
        setRecents(res.data);
      } catch (error) {
        console.error("Erro ao buscar usuarios:", error);
      }
    };
      fetchPosts();
  }, []);

  const [countsTotal, setCountsTotal] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/admin/countsTotal`);
        setCountsTotal(res.data);

        if (res.data.activeUsers === 0) {
          setCountsTotal(prevCounts => ({ ...prevCounts, activeUsers: "0" }));
        }

        if (res.data.activeGroups === 0) {
          setCountsTotal(prevCounts => ({ ...prevCounts, activeGroups: "0" }));
        }
      } catch (error) {
        console.error("Erro ao buscar usuarios:", error);
      }
    };
      fetchPosts();
  }, []);

  const [counts, setCounts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/admin/countsMonth`);
        setCounts(res.data);

        if (res.data.activeUsers === 0) {
          setCounts(prevCounts => ({ ...prevCounts, activeUsers: "0" }));
        }

        if (res.data.activePosts === 0) {
          setCounts(prevCounts => ({ ...prevCounts, activePosts: "0" }));
        }

        if (res.data.activeComments === 0) {
          setCounts(prevCounts => ({ ...prevCounts, activeComments: "0" }));
        }

        if (res.data.activeGroups === 0) {
          setCounts(prevCounts => ({ ...prevCounts, activeGroups: "0" }));
        }
      } catch (error) {
        console.error("Erro ao buscar usuarios:", error);
      }
    };
      fetchPosts();
  }, []);

  const [inputText, setInputText] = useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`search?q=${inputText}`);
  };

  const [inputTextPost, setInputTextPost] = useState('');
  const handleSubmitPost = (event) => {
    event.preventDefault();
    navigate(`/admin/post/${inputTextPost}`);
  };

  const [inputTextGroup, setInputTextGroup] = useState('');
  const handleSubmitGroup = (event) => {
    event.preventDefault();
    navigate(`/admin/group/${inputTextGroup}`);
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

  return (
      <aside id="Admin" className="Container">
        <Header/>
        <Loading/>

        <div className="Main">
          <h1 className="titlePage col-2">Painel Admin</h1>

          <div className="Cards">
            <Card className="Items w-[230px]">
              <CardHeader>
                <CardDescription>Usuário/total</CardDescription>
                <CardTitle><Numeral value={countsTotal.activeUsers} format={"0,0"}/></CardTitle>
              </CardHeader>
            </Card>

            <Card className="Items w-[230px]">
              <CardHeader>
                <CardDescription>Usuário/mês</CardDescription>
                <CardTitle>+<Numeral value={counts.activeUsers} format={"0,0"}/></CardTitle>
              </CardHeader>
            </Card>

            <Card className="Items w-[230px]">
              <CardHeader>
                <CardDescription>Posts/mês</CardDescription>
                <CardTitle>+<Numeral value={counts.activePosts} format={"0,0"}/></CardTitle>
              </CardHeader>
            </Card>

            <Card className="Items w-[230px]">
              <CardHeader>
                <CardDescription>Comentários/mês</CardDescription>
                <CardTitle>+<Numeral value={counts.activeComments} format={"0,0"}/></CardTitle>
              </CardHeader>
            </Card>

            <Card className="Items w-[230px]">
              <CardHeader>
                <CardDescription>Grupos/total</CardDescription>
                <CardTitle><Numeral value={countsTotal.activeGroups} format={"0,0"}/></CardTitle>
              </CardHeader>
            </Card>

            <Card className="Items w-[230px]">
              <CardHeader>
                <CardDescription>Grupos/mês</CardDescription>
                <CardTitle>+<Numeral value={counts.activeGroups} format={"0,0"}/></CardTitle>
              </CardHeader>
            </Card>
          </div>

          <form className="inputSearch" onSubmit={handleSubmit}>
            <Input
              type="search"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Buscar por usuário..."
              minLength="1"
              required
            />

            <div className="flex gap-2">
              <Link to="users-blocked"><span className="msg2 col-3">Usuários bloqueados</span></Link>
              <Link to="users-countries"><span className="msg2 col-3">Lista de usuários por país</span></Link>
            </div>
          </form>

          <form className="inputSearch" onSubmit={handleSubmitPost}>
            <Input
              type="search"
              value={inputTextPost}
              onChange={(e) => setInputTextPost(e.target.value)}
              placeholder="ID de post..."
              minLength="1"
              required
            />
          </form>

          <form className="inputSearch" onSubmit={handleSubmitGroup}>
            <Input
              type="search"
              value={inputTextGroup}
              onChange={(e) => setInputTextGroup(e.target.value)}
              placeholder="ID de grupo..."
              minLength="1"
              required
            />
          </form>

          <div className="w-100">
            <Card className="w-100">
              <CardHeader className="p-4">
                <CardDescription>Usuários mais seguidos</CardDescription>
                <hr />

                {usersPopular.slice(0, 6).map((user) => ( 
                  <Link to={`/${user.username}`} key={user.id} className="w-100"> 
                    <div className="userItem col-1" key={user.id}> 
                      <img src={user.img} alt="" /> 

                      <div className="Details">
                        <div className="Username">
                          <h1><TextOverflow text={user.name} /></h1>

                          {(user.verified === 1 || user.verified === 2) && (
                            <svg className="verified1 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                            </svg>
                          )}

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
                ))}
              </CardHeader>
            </Card>
          </div>

          <div className="w-100">
            <Card className="w-100">
              <CardHeader className="p-4">
                <CardDescription>Usuários mais recentes</CardDescription>
                <hr />

                {usersRecents.slice(0, 6).map((user) => ( 
                  <Link to={`/${user.username}`} key={user.id} className="w-100"> 
                    <div className="userItem col-1" key={user.id}> 
                      <img src={user.img} alt="" /> 

                      <div className="Details">
                        <div className="Username">
                          <h1><TextOverflow text={user.name} /></h1>

                          {(user.verified === 1 || user.verified === 2) && (
                            <svg className="verified1 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                            </svg>
                          )}

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
                ))}
              </CardHeader>
            </Card>
          </div>

        </div>

        <Menu/>
      </aside>
  );
}

export default Admin;
