import "../../styles/main.sass";
import "../../styles/styles.sass";
import "../../styles/pages/Login.sass";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { Mail } from "lucide-react";

import { Helmet } from "react-helmet";
import { useTranslation } from 'react-i18next';
import Menu from "@/components/Menu";

const Login = () => {
  const { t } = useTranslation();
  const queryParams = location.search.split("?")[1];

  return (
    <aside id="Login" className="Container">    
      <Helmet>
        <title>Login / Ilhanet</title>
      </Helmet>

      <Menu/>
  
      <div className="Main">
          <div className="buttonItens">            
            <Link to={`/auth/login-email${queryParams ? `?${queryParams}` : ''}`}>
              <Button className="login-email">
                <Mail className="h-5 w-5" />
                {t("Entrar com o")} email
              </Button>
            </Link>
          </div>
      </div>
    </aside>
  );
}

export default Login;
