import "../../styles/main.sass"
import "../../styles/styles.sass"
import "../../styles/pages/Policies.sass"
import Header2 from "../../components/Header2";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const PrivacyApp = () => {

  return (
      <aside id="Policies" className="Container NoMenu">
        <Helmet>
            <title>Política de Privacidade do aplicativo - Ilhanet</title>
        </Helmet>

        <Header2/>

        <div className="Main">
            <h1>Política de Privacidade do aplicativo Ilhanet</h1>

            <p>Bem-vindo ao aplicativo da Ilhanet. Nossa prioridade é proteger a privacidade dos nossos usuários. Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações ao utilizar nosso aplicativo de VPN.</p>

            <h2>1. Informações Coletadas</h2>
            <p>Nosso aplicativo respeita sua privacidade e evita a coleta desnecessária de dados. No entanto, podemos coletar determinadas informações para fornecer e melhorar nossos serviços.</p>

            <h3>1.1. Informações Coletadas Automaticamente</h3>
            <ul>
                <li><strong>Dados de Uso:</strong> Inclui informações sobre a interação do usuário com o aplicativo, como tempo de conexão, servidores utilizados (sem logs de atividade ou sites visitados).</li>
                <li><strong>Endereço IP:</strong> Apenas temporariamente, para fins de conexão e segurança, mas não armazenamos logs de navegação.</li>
                <li><strong>Dispositivo e Sistema Operacional:</strong> Coletamos informações sobre o tipo de dispositivo e versão do sistema operacional para aprimorar a compatibilidade do aplicativo.</li>
            </ul>

            <h3>1.2. Informações Coletadas no Acesso à Plataforma</h3>
            <p>Nosso aplicativo inclui um componente para acessar nossa plataforma. Isso significa que:</p>
            <ul>
                <li>Todo o tráfego na plataforma é regido pela <Link className="col-3" to="/i/policies/pt/privacy-cookies">Políticas de Privacidade</Link> e <Link className="col-3" to="/i/policies/pt/terms">Termos de uso</Link> da Ilhanet. Em caso de uso de sites externos, o usuário deverá consultar as políticas dos respectivos sites.</li>
                <li>Não capturamos ou armazenamos credenciais inseridas na plataforma.</li>
            </ul>

            <h2>2. Uso das Informações</h2>
            <p>Utilizamos as informações coletadas para:</p>
            <ul>
                <li>- Prover e melhorar nosso serviço de VPN.</li>
                <li>- Monitorar e corrigir problemas técnicos.</li>
                <li>- Garantir a segurança e integridade do serviço.</li>
                <li>- Cumprir obrigações legais e regulatórias.</li>
            </ul>

            <h2>3. Compartilhamento de Informações</h2>
            <p>Nós não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, mas podemos divulgar informações caso seja exigido por lei ou para proteger nossos direitos e a segurança dos usuários.</p>

            <h2>4. Política de Logs</h2>
            <p>O aplicativo da Ilhanet é um serviço sem registro de atividades (<strong>No-Log Policy</strong>). Isso significa que não armazenamos registros de navegação, endereços IP, históricos de conexões ou qualquer dado que possa identificar sua atividade na internet.</p>

            <h2>5. Cookies e Tecnologias de Rastreamento</h2>
            <p>O aplicativo, ao acessar a plataforma, pode carregar páginas que utilizam cookies para oferecer uma melhor experiência ao usuário. No entanto, isso é controlado pelos sites acessados, e recomendamos que os usuários revisem suas respectivas políticas de privacidade.</p>

            <h2>6. Segurança dos Dados</h2>
            <p>Implementamos medidas de segurança para proteger suas informações contra acessos não autorizados, alteração, divulgação ou destruição.</p>

            <h2>7. Direitos do Usuário</h2>
            <p>O uso continuado de nosso site e/ou aplicativo será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato pelo email: <a href="mailto:privacy@ilhanet.com">privacy@ilhanet.com</a>.</p>

            <h2>8. Alterações nesta Política</h2>
            <p>Podemos atualizar esta Política de Privacidade. Notificaremos os usuários sobre mudanças significativas por meio do aplicativo ou e-mail.</p>
        </div>
      </aside>
  );
}

export default PrivacyApp;
