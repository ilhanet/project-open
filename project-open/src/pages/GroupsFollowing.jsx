import "../styles/pages/Group.sass";
import "../styles/main.sass";
import "../styles/styles.sass";
import Menu from "../components/Menu";

import { Loading } from "@/components/loading";
import { Link, useNavigate } from "react-router-dom";
import { Numeral } from "react-numeral";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import NoDatos from "./NoDatos";
import { Helmet } from "react-helmet";
import { Loader2 } from "lucide-react";

const GroupsFollowing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {currentUser} = useSelector((state) => state.user);

  const [groups, setGroups] = useState([]);
  const [notDatos, setNotDatos] = useState(false);

  useEffect(() => {
      const fetchGroup = async () => {
        try {
          const res = await axios.get(`/api/groups/following`);
          setGroups(res.data);
        } catch (error) {
          console.error("Erro ao buscar grupos:", error);
          setNotDatos(true);
        }
      };
      fetchGroup();
  }, [currentUser]);

  if (notDatos) {
    return <NoDatos />;
  }

  return (
    <aside id="GroupsUser" className="Container">
      <Loading/>

      {groups && <Helmet>
        <title>{t("Grupos seguidos")} / Ilhanet</title>
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
          <h1 className="title col-2">{t("Grupos seguidos")}</h1>

          {groups === null ? (
            <span className="NoItems">{t("Nenhum grupo")}.</span>
          ) : groups.length > 0 ? (
            groups.map((group) => (
              <Link to={`/group/${group._id}`} key={group._id}>
                <div className="groupItem">
                  <h1>{group.title}</h1>
                  <span>
                    <b><Numeral value={group.followsCount} format={"0a"} /></b> {t("membros")}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="loadingPosts py-4 col-3">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}
        </div>
      </div>

      <Menu/>
    </aside>
  );
}

export default GroupsFollowing;
