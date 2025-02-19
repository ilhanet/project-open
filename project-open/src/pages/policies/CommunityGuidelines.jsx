import "../../styles/main.sass"
import "../../styles/styles.sass"
import "../../styles/pages/Policies.sass"
import Header2 from "../../components/Header2";
import { Helmet } from "react-helmet";

const CommunityGuidelines = () => {
  return (
      <aside id="Policies" className="Container NoMenu">
        <Helmet>
          <title>Diretrizes de comunidade - Ilhanet</title>
        </Helmet>

        <Header2/>

        <div className="Main">
          <h1>Diretrizes de comunidade</h1>
          <p>As Diretrizes de comunidade da Ilhanet são projetadas para garantir que o conteúdo gerado pelos usuários seja seguro e legalmente compatível para todos.</p>
          
          <h2>1. Divulgação de informações pessoais sensíveis</h2>
          <p>Não publique conteúdo que revele informações de identificação pessoal de outras pessoas (como endereços residenciais, endereços de e-mail e números de telefone que não estejam disponíveis ao público em geral, informações bancárias, números de previdência social/identidade nacional e números de passaporte).</p>

          <h2>2. Comportamento de ódio</h2>
          <p>Não publique conteúdo que promova violência e/ou discriminação de, indivíduos ou grupos, com base em raça, cor, etnia, nacionalidade, ancestralidade, religião, gênero ou orientação sexual.</p>

          <h2>3. Nudez não consensual e exploração sexual de menores</h2>
          <p>Não publique conteúdo de fotos ou vídeos íntimos de alguém os quais tenham sido produzidos ou distribuídos sem o devido consentimento, ou que retrate e/ou promova a pornografia e a exploração sexual de menores de idade.</p>

          <h2>4. Promover e comercializar bens ou serviços ilegais ou regulamentados</h2>
          <p>Não publique conteúdo que promova a venda, compra ou facilitação de transações relacionadas a bens ou serviços ilegais e/ou regulamentados.</p>

          <h2>5. Identidades falsas e enganosas</h2>
          <p>Não crie perfis e/ou publique conteúdo com fins de falsificar a identidade de indivíduos, grupos ou organizações para iludir, confundir ou enganar outras pessoas.</p>

          <h2>6. Manipulação da plataforma e spam</h2>
          <p>Não utilize nossa plataforma com fins de amplificar ou suprimir informações artificialmente, e/ou envolver-se em comportamento que manipule ou prejudique a experiência dos usuários.</p>

          <h2>7. Violência explícita</h2>
          <p>Não publique conteúdo de fotos ou vídeos de alguém vítima de violência com exposição de sangue e/ou cometendo ato de suicídio.</p>

          <h2>8. Direitos autorais e marcas registradas</h2>
          <p>Poderá ser removido perfis e/ou conteúdos que violem os direitos autorais e marcas registradas de outras pessoas.</p>

          <h2>Modificações</h2>
          <p>A Ilhanet pode revisar estas diretrizes de comunidade a qualquer momento, sem aviso prévio. Ao usar esta plataforma, você concorda em ficar vinculado à versão atual destas diretrizes de comunidade.</p>
        </div>
      </aside>
  );
}

export default CommunityGuidelines;
