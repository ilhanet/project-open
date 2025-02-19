import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";

const GoLink = () => {
  const { pathname } = useLocation();
  const path = pathname.split("/")[2];

  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/posts/link/${path}`);
        setPost(res.data);
      } catch (error) {
        console.error("Erro ao buscar posts:", error);
        setError(true);
      }
    };

    if (path) {
      fetchPosts();
    }
  }, [path]);

  if (post) {
    return <Navigate replace to={`/${post.username}/post/${post.id}`} />;
  }

  if (error) {
    return <Navigate replace to="/" />;
  }

  return null;
};

export default GoLink;
