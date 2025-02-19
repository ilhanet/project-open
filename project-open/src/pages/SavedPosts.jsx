import "../styles/pages/Group.sass";
import "../styles/main.sass";
import "../styles/styles.sass";
import Menu from "../components/Menu";

import { Loading } from "@/components/loading";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import NoDatos from "./NoDatos";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Post from "@/components/Post";

const SavedPosts = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {currentUser} = useSelector((state) => state.user);

  const [Posts, setPosts] = useState([]);
  const [notDatos, setNotDatos] = useState(false);

  useEffect(() => {
      const fetchPosts = async () => {
        try {
          const res = await axios.get(`/api/posts/savedposts`);
          setPosts(res.data);
        } catch (error) {
          console.error("Erro ao buscar grupos:", error);
          setNotDatos(true);
        }
      };
      fetchPosts();
  }, [currentUser]);

  const [visiblePostsCount, setVisiblePostsCount] = useState(15);
  const [loading, setLoading] = useState(false);

  const loadMorePosts = () => {
    setLoading(true);
    setTimeout(() => {
      setVisiblePostsCount((prevCount) => prevCount + 15);
      setLoading(false);
    }, 800); // Simulando um pequeno delay para carregar mais posts
  };

  if (notDatos) {
    return <NoDatos />;
  }

  return (
    <aside id="GroupsUser" className="Container">
      <Loading/>

      {Posts && <Helmet>
        <title>{t("Posts salvos")} / Ilhanet</title>
      </Helmet>}

      <div className="Main">
        <div className="headerBack bg-1">
          <div onClick={() => navigate(-1)} className="hbButton col-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </div>
        </div>

        <div className="w-full">
          <h1 className="title col-2">{t("Posts salvos")}</h1>

          {Posts === null ? (
            <span className="NoItems">{t("Nenhum post")}</span>
          ) : Posts.length > 0 ? (
            Posts.slice(0, visiblePostsCount).map((post) => (
              <Post key={post._id} post={post} />
            ))
          ) : (
            <div className="loadingPosts py-4 col-3">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}

          {Posts !== null && visiblePostsCount < Posts.length && (
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
      </div>

      <Menu/>
    </aside>
  );
}

export default SavedPosts;
