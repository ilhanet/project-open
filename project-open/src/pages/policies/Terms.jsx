import "../../styles/main.sass"
import "../../styles/styles.sass"
import "../../styles/pages/Policies.sass"
import Header2 from "../../components/Header2";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const TermsPolicies = () => {
  return (
      <aside id="Policies" className="Container NoMenu">
        <Helmet>
          <title>Termos de uso - Ilhanet</title>
        </Helmet>

        <Header2/>

        <div className="Main">
            <h1>Termos de uso</h1> 

            <h2>1. Termos</h2> 
            <p>Ao acessar ao site Ilhanet, você concorda em cumprir os nossos Termos de uso, as <Link className="col-3" to="/i/policies/pt/community">Diretrizes de Comunidade</Link> e todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.</p> 

            <h2>2. Idade mínima</h2>  
            <p>Ao criar uma conta em nossa plataforma, você declara e garante que possui 18 anos de idade ou mais. É de sua responsabilidade garantir que atende a esse requisito antes de realizar o cadastro.</p>

            <h2>3. Uso de Licença</h2> 
            <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Ilhanet, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode: </p> 
            <ol> 
            <li><b>1.</b> modificar ou copiar os materiais;</li> 
            <li><b>2.</b> usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li> 
            <li><b>3.</b> tentar descompilar ou fazer engenharia reversa de qualquer software contido no site Ilhanet;</li> 
            <li><b>4.</b> remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou</li> 
            <li><b>5.</b> transferir os materiais para outra pessoa ou espelhar os materiais em qualquer outro servidor.</li> 
            </ol> 
            <p>Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida pela Ilhanet a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrónico ou impresso.</p> 
            
            <h2>4. Isenção de responsabilidade</h2> 
            <ol> 
            <li>Os materiais no site da Ilhanet são fornecidos como estão. A Ilhanet não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.</li> 
            <li>Além disso, a Ilhanet não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.</li> 
            </ol> 
            
            <h2>5. Limitações</h2> 
            <p>Em nenhum caso a Ilhanet ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais na Ilhanet, mesmo que a Ilhanet ou um representante autorizado da Ilhanet tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos consequentes ou incidentais, essas limitações podem não se aplicar a você.</p> 
            
            <h2>6. Precisão dos materiais</h2> 
            <p>Os materiais exibidos no site da Ilhanet podem incluir erros técnicos, tipográficos ou fotográficos. A Ilhanet não garante que qualquer material em seu site seja preciso, completo ou atual. A Ilhanet pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio. No entanto, a Ilhanet não se compromete a atualizar os materiais.</p> 
            
            <h2>7. Links</h2> 
            <p>A Ilhanet não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por Ilhanet do site. O uso de qualquer site vinculado é por conta e risco do usuário.</p> 
            
            <h3>Modificações</h3> 
            <p>A Ilhanet pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.</p> 
            
            <h3>Lei aplicável</h3> 
            <p>Estes termos e condições são regidos e interpretados de acordo com as leis do Estado da Flórida, FL (EUA), e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.</p> 
          </div>
      </aside>
  );
}

export default TermsPolicies;
