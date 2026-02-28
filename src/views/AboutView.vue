<template>
  <div class="about">
    <Card :padding="'large'" class="about-card">
      <template #header>
        <div class="about-header">
          <div class="header-content">
            <h1><OhVueIcon name="gi-health-potion" class="header-icon"/>Sobre o Mochi Lab<OhVueIcon name="gi-erlenmeyer" class="header-icon"/></h1>
          </div>
        </div>
      </template>
      
      <div class="about-content">
        <div class="intro-section">
          <div class="lab-section">
            <div class="lab-description">
              <p>Olá, como descrito no início aqui é um espaço (laboratório) onde escrevo textos, estruturo páginas e até mesmo crio algumas pequenas aplicações e ferramentas para treinar programação ou mesmo para facilitar meu cotidiano (vide a <a href="/grade-horaria">grade horária</a> ).</p>
              <p>Aqui funcionará como um <abbr title="Single Page Application">SPA</abbr> relativamente simples onde vou aos poucos adicionando mais funcionalidades.</p>
              <p>Também pretendo escrever pequenos artigos no blog relacionados a Farmácia/Medicina e registrar algumas coisas do cotidiano acadêmico. </p>
            </div>
            <Tooltip size="xl" variant="secondary" position="right" content="Esta é a Puyu, mascote deste lugar, ela é uma cientista e suas cores são para destacar na tematica rosa/azul geral daqui. Seu nome pode ter vários significados, mas é mais inspirado em 'puyu', que em japonês significa 'pedaço de papel', representando este espaço como um lugar de anotações e simplicidade." class="puyu-tooltip">
              <img src="@/assets/images/mochipuyu-2.png" alt="Scientist Puyu-chan" loading="lazy"/>
            </Tooltip>
          </div>
        </div>
        <hr />
        <section class="future-features">
      <h2>Projetos Futuros</h2>
        <p class="future-projects">Projetos que tenho em mente para implantar aqui em algum momento. Estão sujeitos a mudanças e dependem da minha disponibilidade ao longo da jornada da vida.</p>
        <div class="features-grid">
          <Card 
            v-for="feature in futureFeatures" 
            :key="feature.id"
            class="feature-card"
            :padding="'medium'"
          >
            <div class="feature-icon">
              <OhVueIcon :name="feature.icon" />
            </div>
            <h3>{{ feature.titleKey }}</h3>
            <p>{{ feature.descriptionKey }}</p>
          </Card>
        </div>
        </section>

        <hr />

        <section class="profile-section">
            <h2>Sobre quem escreve</h2>
          <div class="profile-start">
            <div class="profile-image">
              <img src="@/assets/images/profile-selfie.jpg" alt="Mochiemi" />
            </div>
            <div class="profile-text">
              <p>
                Olá, meu nome é Juliana Tiemi, mas podem me chamar de Ju, Tiemi, Mochiemi, Mochi, etc. Não tenho muita preferência por pronomes, mas estou acostumada com Ela/Dela. Também tenho um apelido engraçado que gosto que é Diferentona ou 'Dif'.
              </p>
              <p>
                Nasci em São Paulo em 94, vivi dez anos em Botucatu/SP e agora em 2026 inicío minha saga rumo à Alfenas/MG. Tenho quatro gatos (fotinhas deles mais embaixo) e moro com eles e meu esposo. 
              </p>
              <p>
                Em geral sou do tipo de pessoa que gosta de ficar em casa, tem dia que sou quieta, é mais raro mas tem dia que falo demais  também. Sou neurodivertida com diagnóstico tardio aprendendo porque eu sofria tanto e hoje as vezes sou fria.
              </p>
              <p class="dory-quote"><q>Continue a nadar — Dory</q><cite class="dory-cite"> (Procurando Nemo - 2003)</cite></p>
            </div>
          </div>
          <hr />
          <div class="fun-facts">
            <h2>Fatos Curiosos</h2>  
            <List 
              :items="funFactsListItems" 
              :custom-bullet="customBulletImage"
            />
          </div>
      </section>
        <hr />
        <div class="cats-slide">
          <MyCatsSlide />
        </div>
      </div>

      <template #footer>
        <div class="about-footer">
          <Button 
            variant="primary" 
            @click="$router.push('/')"
            class="footer-btn"
          >
            <OhVueIcon name="hi-home" class="btn-icon" />
            Início
          </Button>
          <Button 
            variant="secondary"
            @click="$router.push('/contact')"
            class="footer-btn"
          >
            <OhVueIcon name="fa-regular-paper-plane" class="btn-icon" />
            Contato
          </Button>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { OhVueIcon } from 'oh-vue-icons'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import List from '@/components/ui/List.vue'
import MyCatsSlide from '@/components/layout/misc/myCatsSlide.vue'

const customBulletImage = 'src/assets/icons/mini-mochi.gif'

const futureFeatures = [
  {
    id: 1,
    icon: 'la-pills-solid',
    titleKey: 'Lista de Medicamentos',
    descriptionKey: 'Aos poucos quero adicionar uma lista de medicamentos e fitoterápicos (principalmente os disponíveis na farmácia popular e no SUS)',
  },
  {
    id: 2,
    icon: 'io-construct',
    titleKey: 'Calculadoras e outras ferramentas',
    descriptionKey: 'Desde calculadoras simples de doses medicamentosas, e talvez outras ferramentas úteis',
  },
  {
    id: 3,
    icon: 'md-librarybooks-outlined',
    titleKey: 'Divulgação Científica',
    descriptionKey: 'Futuramente em uma seção própria, a medida que aprendo e participo mais da comunidade científica quero trazer textos acessíveis de divulgação científica.',
  },
  {
    id: 4,
    icon: 'md-donotdisturb',
    titleKey: 'Interações medicamentosas',
    descriptionKey: 'Uma ferramenta que gostaria de criar, principalmente em relação aos medicamentos já registrados, dando destaque a misturas perigosas.',
  }
]

const funFactsListItems = [
  { id: 1, text: 'Sonhos de infância', description: 'A primeira coisa que "quis ser quando crescesse" foi ser cantora aos 6 anos por causa de Sandy&Junior, depois entre uns 8 - 12 anos de idade queria ser veterinária. Hoje sou estudante.' },
  { id: 2, text: 'Já comecei 2 outras graduações e não terminei', description: '2013 - Poli-USP Engenharia (falhei no 1º semestre) e 2016-2023 - Unesp - Medicina (Falhei burnautada)' },
  { id: 3, text: 'Sobrenome materno', description: 'Bom, sou a irmã mais velha entre três e a única com sobrenome materno, meus pais acharam meu nome muito longo na hora de escrever e decidiram não repetir isso com os outros dois.' }
]

</script>

<style scoped>
.about {
  max-width: 1200px;
  margin: 3em auto;
}

.about-card {
  margin-top: 3em;
  background: var(--surface-primary);
}

.about-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  flex-wrap: wrap;
  gap: 1em;
  margin: 1em auto;
}

.header-content {
  flex: 1;
}

.header-content h1 {
  margin-bottom: -0.5em;
}

.header-icon {
  color: var(--badge-teal);
  transform: scale(3);
}

.about-content {
  color: var(--text-secondary);
}

.intro-section {
  margin-bottom: 2em;
}

.lab-section {
  display: flex;
  flex: row;
  align-items: center;
  justify-content: space-around;
  text-align: justify;
}

.lab-description {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.lab-description p {
  margin: 0.5em;
}

.lab-section img {
  margin: 0.5em;
  display: inline-block;
  max-width: 800px;
  min-width: 200px;
  width: 35%;
}

.profile-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.profile-start {
  display: flex;
  flex: row;
  align-items: center;
  justify-content: space-between;
  text-align: justify;
}

.profile-image {
  display: inline-block;
  margin: 1rem;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--primary);
  box-shadow: 0px 0px 20px 6px var(--shadow);
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(80%);
  transform: rotate(180deg);
  transition: all 0.8s ease;
}

.profile-image img:hover {
  filter: grayscale(0%);
  transform: rotate(0deg);
}

.profile-text {
  display: flex;
  flex-direction: column;
  text-align: justify;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  max-width: 70%;
  color: var(--text-primary);
}

.profile-text p {
  margin-bottom: 1rem;
}

.dory-quote {
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
  text-align: right;
}

.dory-cite {
  font-size: 1.3rem;
}


hr {
  margin: 1rem;
}
h2 {
  color: var(--title-secondary);
  text-align: center;
}

.future-projects {
  text-align: center;
  margin: 1rem auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
  margin-bottom: 4rem;
}

.feature-card {
  text-align: center;
  transition: all 0.3s ease;
  background: var(--inner-surface);
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 10px var(--shadow-hover);
}

.feature-icon {
  color: var(--strong-rose);
  margin: 1rem;
  transform: scale(2);
}

.feature-card h3 {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.feature-card p {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.fun-facts {
  margin: 0;
}

.fun-facts h2 {
margin-bottom: 2rem;
}

.cats-slide {
  margin-top: 2rem;
}

.about-footer {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}

.footer-btn {
  min-width: 160px;
}

.btn-icon {
  margin-right: 0.5rem;
}

@media (max-width: 968px) {
  .profile-section {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
  
  .profile-image {
    margin: 0 auto;
    width: 150px;
    height: 150px;
  }
  
  
  .profile-stats {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .header-icon {
    transform: scale(1.5);
  }
  .about {
    padding: 0.5rem;
  }
  
  .about-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .header-content h1 {
    text-align: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .about-footer {
    flex-direction: column;
    align-items: center;
  }
  
  .footer-btn {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .profile-image {
    width: 100px;
    height: 100px;
  }
  
  .facts-grid {
    grid-template-columns: 1fr;
  }
  
  .feature-icon {
    font-size: 2.5rem;
  }
}
</style>