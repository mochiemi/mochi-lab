<template>
  <div class="test-container">
    <h1>Teste de Elementos de Texto HTML</h1>
    
    <!-- Títulos (Headings) -->
    <section class="test-section">
      <Card padding="normal" class="card-test-section">
      <h2>1. Títulos (h1 a h6)</h2>
      <h1>h1. Título nível 1</h1>
      <h2>h2. Título nível 2</h2>
      <h3>h3. Título nível 3</h3>
      <h4>h4. Título nível 4</h4>
      <h5>h5. Título nível 5</h5>
      <h6>h6. Título nível 6</h6>
      </Card>
    </section>

    <!-- Parágrafos e textos básicos -->
    <section class="test-section">
      <Card padding="normal" class="card-test-section">
      <h2>2. Parágrafos e Textos Básicos</h2>
      <p>p: Este é um parágrafo normal com texto simples.</p>
      <p>p: Outro parágrafo mostrando como o texto <br>br: pode ser quebrado com a tag br.</p>
      <p>p: Texto com <span>span: uma seção específica</span> dentro do parágrafo.</p>
      </Card>
    </section>

    <!-- Formatação de texto -->
    <section class="test-section">
      <Card padding="normal" class="card-test-section">
      <h2>3. Formatação de Texto</h2>
      <p><b>b: Texto em negrito (bold)</b></p>
      <p><strong>strong: Texto importante (semanticamente forte)</strong></p>
      <p><i>i: Texto em itálico</i></p>
      <p><em>em: Texto com ênfase</em></p>
      <p><mark>mark: Texto marcado</mark></p>
      <p><small>small: Texto pequeno</small></p>
      <p><del>del: Texto deletado</del></p>
      <p><ins>ins: Texto inserido</ins></p>
      <p><sub>sub: Texto subscrito</sub> e <sup>sup: Texto sobrescrito</sup></p>
      <p><u>u: Texto sublinhado</u></p>
      </Card>
    </section>

    <!-- Citações e referências -->
    <section class="test-section">
      <Card padding="normal" class="card-test-section">
      <h2>4. Citações e Referências</h2>
      <blockquote cite="https://exemplo.com">
        blockquote: Esta é uma citação longa de outra fonte. Pode conter múltiplas linhas e geralmente é identada.
      </blockquote>
      
      <p>q: <q>Esta é uma citação curta</q> dentro de um parágrafo.</p>
      
      <p><cite>cite: Título de uma obra (livro, filme, etc.)</cite></p>
      
      <p>abbr: <abbr title="HyperText Markup Language">HTML</abbr> (passe o mouse para ver o significado)</p>
      
      <address>
        address: Informações de contato<br>
        Rua Exemplo, 123<br>
        contato@exemplo.com
      </address>
      </Card>
    </section>

    <!-- Código e formatação técnica -->
    <section class="test-section">
      <Card padding="normal" class="card-test-section">
      <h2>5. Código e Formatação Técnica</h2>
      
      <p><code>code: console.log('Hello World');</code> - código inline</p>
      
      <pre>pre: Texto pré-formatado
  mantém      espaços
  e quebras
  de linha</pre>
      
      <pre><code>
// code dentro de pre - bloco de código
function saudacao(nome) {
  return `Olá, ${nome}!`;
}
      </code></pre>
      
      <p><kbd>kbd: Ctrl</kbd> + <kbd>kbd: C</kbd> (atalho de teclado)</p>
      
      <p><samp>samp: Mensagem de erro do sistema</samp></p>
      
      <p><var>var: x</var> = <var>y</var> + 2 (variável matemática)</p>
      
      <p><data value="123">data: Dado associado</data></p>
      
      <p><time datetime="2024-01-01">time: 1º de Janeiro de 2024</time></p>
      </Card>
    </section>

    <!-- Listas -->
    <section class="test-section">
      <Card padding="normal" class="card-test-section">
      <h2>6. Listas</h2>
      
      <h3>Lista não ordenada (ul)</h3>
      <ul>
        <li>li: Item 1</li>
        <li>li: Item 2
          <ul>
            <li>li: Subitem 2.1</li>
            <li>li: Subitem 2.2</li>
          </ul>
        </li>
        <li>li: Item 3</li>
      </ul>
      
      <h3>Lista ordenada (ol)</h3>
      <ol>
        <li>li: Primeiro item</li>
        <li>li: Segundo item</li>
        <li>li: Terceiro item</li>
      </ol>
      
      <h3>Lista de descrição (dl)</h3>
      <dl>
        <dt>dt: HTML</dt>
        <dd>dd: Linguagem de marcação para criação de páginas web</dd>
        
        <dt>dt: CSS</dt>
        <dd>dd: Linguagem de estilização para páginas web</dd>
        
        <dt>dt: JavaScript</dt>
        <dd>dd: Linguagem de programação para interatividade</dd>
      </dl>
    </Card>
    </section>

    <!-- Links e âncoras -->
    <section class="test-section">
      <Card padding="normal" class="card-test-section">
      <h2>7. Links</h2>
      <p><a href="#" target="_blank">a: Link normal</a></p>
      <p><a href="#" rel="nofollow">a: Link com rel="nofollow"</a></p>
      </Card>
    </section>

    <!-- Elementos interativos -->
    <section class="test-section">
      <Card padding="normal" class="card-test-section">
      <h2>8. Elementos Interativos</h2>
      
      <details>
        <summary>summary: Clique para expandir</summary>
        <p>details: Este conteúdo é mostrado quando o summary é clicado.</p>
        <p>Pode conter qualquer HTML aqui dentro.</p>
      </details>
      </Card>
    </section>

    <!-- Texto bidirecional -->
    <section class="test-section">
      <Card padding="normal" class="card-test-section">
      <h2>9. Texto Bidirecional</h2>
      <p><bdo dir="rtl">bdo: Texto da direita para esquerda</bdo></p>
      <p><bdi>bdi: Texto isolado</bdi> - útil para texto com direção diferente do contexto</p>
      </Card>
    </section>

    <!-- Variáveis reativas Vue 3 -->
    <section class="test-section" v-if="showReactive">
      <Card padding="normal" class="card-test-section">
      <h2>10. Exemplo de Reatividade Vue 3</h2>
      <p>Texto reativo: {{ reactiveText }}</p>
      <p>Contador reativo: {{ counter }}</p>
      <p>Texto computado (maiúsculo): {{ uppercaseText }}</p>
      <button @click="incrementCounter">Incrementar Contador</button>
      <button @click="toggleReactive">Ocultar seção</button>
    </Card>
    </section>

    <button v-else @click="toggleReactive">Mostrar seção reativa</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Card from '@/components/ui/Card.vue'

// Variáveis reativas
const showReactive = ref(true)
const reactiveText = ref('Este texto é reativo e pode ser alterado')
const counter = ref(0)

// Propriedade computada
const uppercaseText = computed(() => reactiveText.value.toUpperCase())

// Métodos
const incrementCounter = () => {
  counter.value++
}

const toggleReactive = () => {
  showReactive.value = !showReactive.value
}
</script>

<style scoped>
.test-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.card-test-section {
  margin: 1em auto;
  background-color: var(--surface-primary);
}

</style>