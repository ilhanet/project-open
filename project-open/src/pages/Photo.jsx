import { useLocation, useNavigate } from "react-router-dom";
import "../styles/main.sass"
import "../styles/pages/Photo.sass"
import { useEffect, useState } from "react";
import axios from "axios";
import NotFoundPage from "./NotFound";

const Photo = () => {
  const navigate = useNavigate();
  const pathUser = useLocation().pathname.split("/")[1];
  const path1 = useLocation().pathname.split("/")[3];
  const path2 = useLocation().pathname.split("/")[5];

  const [post, setPost] = useState({});
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/posts/pub/${pathUser}/${path1}`);
        if (res.data) {
          setPost(res.data.photo[path2]);
        }
        
        if (!res.data.photo[path2]) {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
      }
    };

    if (path1) {
      fetchPosts();
    }
  }, [path1, path2, pathUser]);

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <aside id="Photo">
        <div onClick={() => navigate(-1)} className="hbButton col-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </div>

      <div className="Main">
        <img src={post} alt="" />
      </div>
    </aside>
  );
}

export default Photo;
