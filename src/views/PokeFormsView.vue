<template>
  <div class="poke-forms-view">
    <div class="container">
      <Card class="quiz-card" :flat="false">
        <template #header>
          <h1 class="quiz-title">{{ $t('pokeQuiz.title') }}</h1>
          <p class="quiz-description">{{ $t('pokeQuiz.description') }}</p>
        </template>

        <div class="quiz-content">
          <div v-if="showResults" class="results-section">
            <div class="pokemon-result">
              <div class="pokemon-image">
                <img :src="resultPokemon.image" :alt="resultPokemon.name" />
              </div>
              <h2 class="result-title">{{ $t('pokeQuiz.yourPokemon') }}</h2>
              <h3 class="pokemon-name">{{ resultPokemon.name }}</h3>
              <p class="pokemon-description">{{ resultPokemon.description }}</p>
              
              <div class="result-actions">
                <Button variant="primary" @click="shareByEmail" :loading="sendingEmail">
                  <OhVueIcon name="oi-envelope-closed" />
                  {{ $t('pokeQuiz.shareResults') }}
                </Button>
                <Button variant="outline" @click="restartQuiz">
                  <OhVueIcon name="oi-reload" />
                  {{ $t('pokeQuiz.restartQuiz') }}
                </Button>
              </div>
            </div>
          </div>

          <div v-else class="questions-section">
              <div v-if="showIntroduction" class="introduction-section">
                <Card class="intro-card" :flat="true">
                  <div class="intro-content">
                    <img src="https://www.redbrick.me/wp-content/uploads/2020/03/ESb0DWWXkAMxSzI.jpg" alt="Pokemon Mystery Dungeon DX Promotional Image showing Alakazan, Mudkip, Pikachu, Squirtle, Totodile, Gengar, Tyranitar and two Murkrows">
                    <h3>{{ $t('pokeQuiz.introduction') }}</h3>
                    <p>{{ $t('pokeQuiz.introduction2') }}</p>
                    <p class="have-fun">{{ $t('pokeQuiz.haveFun') }}</p>
                    <Button variant="primary" @click="startQuiz" class="start-button">
                      Start Quiz
                    </Button>
                  </div>
                </Card>
              </div>
            <div v-else>
    <Progress 
      :value="progress" 
      :label="$t('pokeQuiz.progress')"
      variant="gradient"
      striped
      animated
      show-value
    />

    <div class="question-card">
      <h3 class="question-number">{{ $t('pokeQuiz.question') }} {{ currentQuestionIndex + 1 }}</h3>
      <h2 class="question-text">{{ currentQuestion.text }}</h2>

      <div class="options-grid">
        <Card 
          v-for="(option, index) in currentQuestion.options" 
          :key="index"
          :class="['option-card', { 'selected': selectedOption === index }]"
          :clickable="true"
          @click="selectOption(index)"
          :flat="true"
        >
          <div class="option-content">
            <Radio 
              :model-value="selectedOption" 
              :value="index"
              :label="option.text"
              class="option-radio"
            />
          </div>
        </Card>
      </div>

      <div class="question-actions">
        <Button 
          variant="secondary" 
          @click="previousQuestion" 
          :disabled="currentQuestionIndex === 0"
        >
          <OhVueIcon name="oi-arrow-thick-left" />
          {{ $t('pokeQuiz.previous') }}
        </Button>
        
        <Button 
          variant="primary" 
          @click="nextQuestion" 
          :disabled="selectedOption === null"
          :loading="processingAnswer"
        >
          <span v-if="isLastQuestion">{{ $t('pokeQuiz.seeResults') }}</span>
          <span v-else>{{ $t('pokeQuiz.next') }}</span>
          <OhVueIcon name="oi-arrow-thick-right" />
        </Button>
      </div>
    </div>
  </div>
</div>
</div>
      </Card>

      <Modal 
        v-model:show="showEmailModal" 
        :title="$t('pokeQuiz.shareResults')"
        size="medium"
      >
        <div class="email-form">
          <Input
            v-model="emailData.recipient"
            type="email"
            :label="$t('pokeQuiz.recipientEmail')"
            :placeholder="$t('pokeQuiz.emailPlaceholder')"
            :error="emailError"
          />
          
          <Textarea
            v-model="emailData.message"
            :label="$t('pokeQuiz.personalMessage')"
            :rows="4"
            :placeholder="emailPlaceholder"
          />

          <div class="modal-actions">
            <Button variant="outline" @click="showEmailModal = false">
              {{ $t('pokeQuiz.cancel') }}
            </Button>
            <Button variant="primary" @click="sendEmail" :loading="sendingEmail">
              {{ $t('pokeQuiz.sendEmail') }}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { OhVueIcon } from 'oh-vue-icons'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Radio from '@/components/ui/Radio.vue'
import Progress from '@/components/ui/Progress.vue'
import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import Modal from '@/components/ui/Modal.vue'

const { t, locale } = useI18n()


const currentQuestionIndex = ref(0)
const selectedOption = ref(null)
const answers = ref([])
const showResults = ref(false)
const processingAnswer = ref(false)
const showEmailModal = ref(false)
const sendingEmail = ref(false)
const showIntroduction = ref(true)

const startQuiz = () => {
  showIntroduction.value = false
}

const emailData = ref({
  recipient: '',
  message: ''
})
const emailError = ref('')


const resultPokemonId = ref(null)
const resultPokemon = computed(() => {
  if (!resultPokemonId.value) return {}
  return pokemonData.value.find(p => p.id === resultPokemonId.value) || {}
})

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1)
const progress = computed(() => ((currentQuestionIndex.value + 1) / questions.value.length) * 100)
const emailPlaceholder = computed(() => {
  if (resultPokemon.value.name) {
    return t('pokeQuiz.messagePlaceholder', { pokemon: resultPokemon.value.name })
  }
  return t('pokeQuiz.messagePlaceholder', { pokemon: 'Pokémon' })
})

const questions = computed(() => [
  {
    id: 1,
    text: t('pokeQuiz.questions.q1'),
    options: [
      { text: t('pokeQuiz.options.brave1'), type: "brave" },
      { text: t('pokeQuiz.options.wise1'), type: "wise" },
      { text: t('pokeQuiz.options.friendly1'), type: "friendly" },
      { text: t('pokeQuiz.options.mysterious1'), type: "mysterious" }
    ]
  },
  {
    id: 2,
    text: t('pokeQuiz.questions.q2'),
    options: [
      { text: t('pokeQuiz.options.brave2'), type: "brave" },
      { text: t('pokeQuiz.options.wise2'), type: "wise" },
      { text: t('pokeQuiz.options.friendly2'), type: "friendly" },
      { text: t('pokeQuiz.options.mysterious2'), type: "mysterious" }
    ]
  },
  {
    id: 3,
    text: t('pokeQuiz.questions.q3'),
    options: [
      { text: t('pokeQuiz.options.brave3'), type: "brave" },
      { text: t('pokeQuiz.options.wise3'), type: "wise" },
      { text: t('pokeQuiz.options.friendly3'), type: "friendly" },
      { text: t('pokeQuiz.options.mysterious3'), type: "mysterious" }
    ]
  },
  {
    id: 4,
    text: t('pokeQuiz.questions.q4'),
    options: [
      { text: t('pokeQuiz.options.brave4'), type: "brave" },
      { text: t('pokeQuiz.options.wise4'), type: "wise" },
      { text: t('pokeQuiz.options.friendly4'), type: "friendly" },
      { text: t('pokeQuiz.options.mysterious4'), type: "mysterious" }
    ]
  },
  {
    id: 5,
    text: t('pokeQuiz.questions.q5'),
    options: [
      { text: t('pokeQuiz.options.brave5'), type: "brave" },
      { text: t('pokeQuiz.options.wise5'), type: "wise" },
      { text: t('pokeQuiz.options.friendly5'), type: "friendly" },
      { text: t('pokeQuiz.options.mysterious5'), type: "mysterious" }
    ]
  }
])

const pokemonData = computed(() => [
  {
    id: 1,
    personality: "friendly",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    name: t('pokeQuiz.pokemon.pikachu.name'),
    description: t('pokeQuiz.pokemon.pikachu.description')
  },
  {
    id: 2,
    personality: "brave", 
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
    name: t('pokeQuiz.pokemon.charizard.name'),
    description: t('pokeQuiz.pokemon.charizard.description')
  },
  {
    id: 3,
    personality: "wise",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png",
    name: t('pokeQuiz.pokemon.alakazam.name'),
    description: t('pokeQuiz.pokemon.alakazam.description')
  },
  {
    id: 4,
    personality: "mysterious",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png",
    name: t('pokeQuiz.pokemon.gengar.name'),
    description: t('pokeQuiz.pokemon.gengar.description')
  },
  {
    id: 5,
    personality: "wise",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png",
    name: t('pokeQuiz.pokemon.lucario.name'),
    description: t('pokeQuiz.pokemon.lucario.description')
  },
  {
    id: 6,
    personality: "friendly",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
    name: t('pokeQuiz.pokemon.eevee.name'),
    description: t('pokeQuiz.pokemon.eevee.description')
  },
  {
    id: 7,
    personality: "brave",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png",
    name: t('pokeQuiz.pokemon.dragonite.name'),
    description: t('pokeQuiz.pokemon.dragonite.description')
  },
  {
    id: 8,
    personality: "mysterious",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png",
    name: t('pokeQuiz.pokemon.mew.name'),
    description: t('pokeQuiz.pokemon.mew.description')
  }
])

const selectOption = (index) => {
  selectedOption.value = index
}

const nextQuestion = async () => {
  if (selectedOption.value === null) return

  processingAnswer.value = true
  
  answers.value[currentQuestionIndex.value] = selectedOption.value
  
  await new Promise(resolve => setTimeout(resolve, 500))
  
  if (isLastQuestion.value) {
    calculateResult()
  } else {
    currentQuestionIndex.value++
    selectedOption.value = answers.value[currentQuestionIndex.value] ?? null
  }
  
  processingAnswer.value = false
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    selectedOption.value = answers.value[currentQuestionIndex.value] ?? null
  }
}

const calculateResult = () => {
  const typeCount = {}
  
  answers.value.forEach((answerIndex, questionIndex) => {
    const type = questions.value[questionIndex].options[answerIndex].type
    typeCount[type] = (typeCount[type] || 0) + 1
  })
  
  const dominantType = Object.keys(typeCount).reduce((a, b) => 
    typeCount[a] > typeCount[b] ? a : b
  )

  const matchingPokemon = pokemonData.value.filter(pokemon => 
    pokemon.personality === dominantType
  )
  
  const randomIndex = Math.floor(Math.random() * matchingPokemon.length)
  
  resultPokemonId.value = matchingPokemon[randomIndex].id
  showResults.value = true
}

const shareByEmail = () => {
  showEmailModal.value = true
}

const sendEmail = async () => {

  if (!emailData.value.recipient || !emailData.value.recipient.includes('@')) {
    emailError.value = t('msgError.email')
    return
  }
  
  emailError.value = ''
  sendingEmail.value = true
  

  await new Promise(resolve => setTimeout(resolve, 2000))
  

  console.log('Sending email:', {
    to: emailData.value.recipient,
    subject: `My Pokémon is: ${resultPokemon.value.name}!`,
    message: emailData.value.message
  })
  
  sendingEmail.value = false
  showEmailModal.value = false
  
  alert(t('pokeQuiz.emailSuccess'))
}
const restartQuiz = () => {
  currentQuestionIndex.value = 0
  selectedOption.value = null
  answers.value = []
  showResults.value = false
  resultPokemonId.value = null
  emailData.value = { recipient: '', message: '' }
  emailError.value = ''
  showIntroduction.value = true
}

watch(() => locale.value, () => {
  if (showResults.value && resultPokemon.value.id) {
    const updatedPokemon = pokemonData.value.find(p => p.id === resultPokemon.value.id)
    if (updatedPokemon) {
      resultPokemon.value = { ...updatedPokemon }
    }
  }
})

onMounted(() => {
})
</script>

<style scoped>
.poke-forms-view {
  min-height: 100vh;
  padding: 2rem 1rem;
  background: var(--gradient-bg);
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.quiz-card {
  margin-bottom: 2rem;
}

.quiz-description {
  color: var(--text-secondary);
  text-align: center;
  font-size: 1.1rem;
  line-height: 1.6;
}

.introduction-section {
  margin-bottom: 2rem;
}

.intro-card {
  padding: 2rem;
  text-align: center;
  background: var(--surface-contrast);
}

.intro-content img {
  width: 80%;
  border-radius: 1rem;
}

.intro-content h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.intro-content p {
  color: var(--border-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.have-fun {
  color: var(--title-primary) !important;
  font-size: 1.1rem;
  font-weight: 600;
}

.start-button {
  margin: 1rem auto;
}

.intro-banner {
  margin-bottom: 1.5rem;
}

.intro-message h4 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.intro-message p {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.quiz-content {
  padding: 1rem 0;
}

.quiz-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.question-card {
  padding: 2rem;
  background: var(--surface);
  border-radius: 12px;
  border: 1px solid var(--border);
}

.question-number {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.question-text {
  color: var(--text-primary);
  font-size: 1.3rem;
  margin-bottom: 2rem;
  line-height: 1.4;
}

.options-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.option-card.selected {
  border-color: var(--primary);
  background: var(--surface-contrast);
}

.option-card:hover:not(.selected) {
  border-color: var(--border);
  transform: translateY(-2px);
}

.option-content {
  padding: 1rem;
}

.option-radio {
  width: 100%;
}

.question-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.results-section {
  text-align: center;
  padding: 2rem;
}

.pokemon-result {
  max-width: 500px;
  margin: 0 auto;
}

.pokemon-image {
  margin-bottom: 1.5rem;
}

.pokemon-image img {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.result-title {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.pokemon-name {
  color: var(--text-primary);
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.pokemon-description {
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.result-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.email-form {
  padding: 1rem 0;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .poke-forms-view {
    padding: 1rem 0.5rem;
  }
  
  .quiz-title {
    font-size: 1.5rem;
  }
  
  .question-card {
    padding: 1rem;
  }
  
  .question-text {
    font-size: 1.1rem;
  }
  
  .question-actions {
    flex-direction: column;
  }
  
  .result-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .pokemon-name {
    font-size: 2rem;
  }
  
  .pokemon-image img {
    width: 150px;
    height: 150px;
  }
}
</style>