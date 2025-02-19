import "../../styles/main.sass"
import "../../styles/styles.sass"
import "../../styles/pages/Policies.sass"
import Header2 from "../../components/Header2";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const PrivacyAndCookiesPolicies = () => {

  return (
      <aside id="Policies" className="Container NoMenu">
        <Helmet>
            <title>Políticas de Privacidade e Cookies - Ilhanet</title>
        </Helmet>

        <Header2/>

        <div className="Main">
            <h1>Políticas de Privacidade e Cookies</h1>

            <p>A sua privacidade é importante para nós. É política do Ilhanet respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site <a href="https://teste.com">Ilhanet</a>, e outros sites que possuímos e operamos.</p>
            <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.</p>
            <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>
            <p>Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.</p>
            <p>O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.</p>
            <p>Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.</p>
            <p>Você pode consultar, modificar e/ou eliminar seus dados, acessando a pagina de Editar perfil, <a href="/u/editprofile" target="_blank" rel="noopener">clicando aqui</a>.</p>
            <p>A eliminação de seus dados poderá ser feita através da exclusão de sua conta. A Ilhanet poderá manter seus dados para fins de utilização em processos judiciais e/ou regulatória.</p>
            <p>O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato pelo email: <Link to="mailto:privacy@ilhanet.com">privacy@ilhanet.com</Link>.</p>
            
            <h2>Política de Cookies</h2>
            <h3>O que são cookies?</h3>
            <p>Como é prática comum em quase todos os sites profissionais, este site usa cookies, que são pequenos arquivos baixados no seu computador, para melhorar sua experiência. Esta página descreve quais informações eles coletam, como as usamos e por que às vezes precisamos armazenar esses cookies. Também compartilharemos como você pode impedir que esses cookies sejam armazenados, no entanto, isso pode fazer o downgrade ou quebrar certos elementos da funcionalidade do site.</p>
            <h3>Como usamos os cookies?</h3>
            <p>Utilizamos cookies por vários motivos, detalhados abaixo. Infelizmente, na maioria dos casos, não existem opções padrão do setor para desativar os cookies sem desativar completamente a funcionalidade e os recursos que eles adicionam a este site. É recomendável que você deixe todos os cookies se não tiver certeza se precisa ou não deles, caso sejam usados para fornecer um serviço que você usa.</p>
            
            <h3>Gerenciar cookies</h3>
            <p>O usuário pode consultar, bloquear e/ou desativar os cookies em uso a qualquer momento, em qualquer site, inclusive o nosso, acessando as configurações do seu browser. Consulte abaixo guias de ajuda dos principais navegadores:</p>
            <ul>
            <li><Link target="_blank" rel="noopener" to="https://support.google.com/accounts/answer/61416?hl=en">Google Chrome</Link></li>
            <li><Link target="_blank" rel="noopener" to="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop?redirectlocale=en-US&amp;redirectslug=enable-and-disable-cookies-website-preferences">Firefox</Link></li>
            <li><Link target="_blank" rel="noopener" to="https://support.microsoft.com/pt-br/help/17442/windows-internet-explorer-delete-manage-cookies">Microsoft Edge</Link></li>
            <li><Link target="_blank" rel="noopener" to="https://blogs.opera.com/news/2015/08/how-to-manage-cookies-in-opera/">Opera</Link></li>
            <li><Link target="_blank" rel="noopener" to="https://support.apple.com/pt-br/guide/safari/sfri11471/mac">Safari</Link></li>
            </ul>
            <p className="col-2">Saiba mais em <Link target="_blank" rel="noopener" to="https://allaboutcookies.org">allaboutcookies.org</Link></p>

            <h3>Cookies que definimos</h3>
            <ul className="listCookies">
            <li>
                <span>Cookies necessários (Necessary cookies)</span><br />
                Esses cookies são necessários para que o site funcione corretamente.<br/><br/>
            </li>
            <li>
                <span>Cookies de desempenho (Performance cookies)</span><br/>
                Esses cookies são usados para coletar informações estatísticas sobre o uso do nosso site, também chamados de cookies analíticos. Usamos esses dados para desempenho e otimização do site.<br/><br/>
            </li>
            <li>
                <span>Cookies de publicidade/rastreamento (Advertising cookies)</span><br/>
                Esses cookies são definidos por parceiros de publicidade externos e são usados para criar perfis e rastrear dados em vários sites. Se você aceitar esses cookies, poderemos exibir nossos anúncios em outros sites com base em seu perfil de usuário e preferências.
                Esses cookies também salvam dados sobre quantos visitantes viram ou clicaram em nossos anúncios para otimizar campanhas publicitárias.<br/>
            </li>
            </ul>

            <h3>Cookies de parceiros</h3>
            <ul className="listCookies">
            <li>
                <b className="col-2">Google</b><br />
                <p>Política de Privacidade: <Link target="_blank" to="https://policies.google.com/technologies/partner-sites">https://policies.google.com/technologies/partner-sites/</Link></p>
            </li>
            <br />
            <li>
                <b className="col-2">Cloudinary</b><br />
                <p>Política de Privacidade: <Link target="_blank" to="https://cloudinary.com/privacy">https://cloudinary.com/privacy/</Link></p>
            </li>
            </ul>

            <h3>Compromisso do Usuário</h3>
            <p>O usuário se compromete a fazer uso adequado dos conteúdos e da informação que a Ilhanet oferece no site e com caráter enunciativo, mas não limitativo:</p>
            <ul>
            <li>A) Não se envolver em atividades que sejam ilegais ou contrárias à boa fé a à ordem pública;</li>
            <li>B) Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) da Ilhanet, de seus fornecedores ou terceiros, para introduzir ou disseminar vírus informáticos ou quaisquer outros sistemas de hardware ou software que sejam capazes de causar danos anteriormente mencionados.</li>
            </ul>
            <h3>Mais informações</h3>
            <p>Esperemos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site.</p>
            <p>Esta política é efetiva a partir de <strong>Set</strong>/<strong>2024</strong>.</p>
        </div>
      </aside>
  );
}

export default PrivacyAndCookiesPolicies;
