import "../../styles/main.sass";
import "../../styles/styles.sass";
import "../../styles/pages/Search.sass";
import Menu from "../../components/Menu";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Numeral } from "react-numeral";

const Search = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [inputText, setInputText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const encodedInput = encodeURIComponent(inputText);
    navigate(`/search/users?q=${encodedInput}`);
  };

  const [trending, setTrending] = useState([]);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      const currentTime = new Date().getTime();

      if (lastFetchTime && currentTime - lastFetchTime < 5 * 60 * 1000) {
        return;
      }

      try {
        const response = await axios.get('/api/trending/hashtags');
        setTrending(response.data);
        setLastFetchTime(currentTime);
      } catch (error) {
        console.error('Erro ao buscar trending topics', error);
      }
    };

    fetchTrendingTopics();
  }, [lastFetchTime]);

  return (
    <aside id="Search" className="Container SearchMenu noheaderMenu">
      <Helmet>
        <title>{t("Buscar")} / Ilhanet</title>
      </Helmet>

      <div className="Main headerMenu">
        <form className="inputSearch" onSubmit={handleSubmit}>
          <Input
            type="search"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t("Buscar")}
            minLength="1"
            required
          />
          <button type="submit" className="buttonSearch col-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </form>

        {trending && trending !== null && trending.length > 0 && (
          <div className="trending">
            <h1 className="col-2">{t("Hashtags mais mencionadas")}</h1>
            {trending === null ? (
              <span className="NoItems">{t("Nada por aqui.")}</span>
            ) : trending.length > 0 ? (
              <ul>
                {trending.map((topic, index) => (
                  <Link to={`/search/posts?q=%23${topic._id}`} key={index}>
                    <li>
                      <h3 className="col-3">#{topic._id}</h3>
                      <span className="col-2"><Numeral value={topic.count} format={"0,0"}/> {t("menções")}</span>
                    </li>
                  </Link>
                ))}
              </ul>
            ) : (
              <div className="loadingPosts py-4 col-3">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>

      <Menu />
    </aside>
  );
};

export default Search;
