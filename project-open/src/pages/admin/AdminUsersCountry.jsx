import "../../styles/main.sass"
import "../../styles/styles.sass"
import "../../styles/pages/Admin.sass"

import { Loading } from "@/components/loading";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import Menu from "@/components/Menu";
import NotFoundPage from "../NotFound";
import { useNavigate } from "react-router-dom";

const AdminUsersCountry = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const {currentUser} = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin/usersCountry');
        setData(response.data);
      } catch (err) {
        console.log("Erro na requisição")
      }
    };

    fetchData();
  }, []);

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
        <Loading/>

        <div className="Main">
          <div className="headerBack bg-1">
            <div onClick={() => navigate(-1)} className="hbButton col-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </div>
          </div>

          <h1 className="titlePage col-2">Usuários por país</h1>

          {data.map(item => (
            <div key={item._id} className="w-full">
              <div className="info-alert">
              {item._id}: {item.count}
              </div>
            </div>
          ))}
        </div>

        <Menu/>
      </aside>
  );
}

export default AdminUsersCountry;
