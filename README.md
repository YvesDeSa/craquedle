# ⚽🎮 Brasileirãodle ❖ O Jogo Diário do Brasileirão Série A

<p align="center">
  <img src="https://media.api-sports.io/football/leagues/71.png" alt="Brasileirão Série A" width="90" />
</p>

<p align="center">
  <strong>Jogo web diário de adivinhação de jogadores do Campeonato Brasileiro Série A com mecânica estilo Narutodle e Grid 3x3 (Futbol11 / Tiki-Taka-Toe), envelopado em direção de arte Retro Arcade & Pixel UI anos 90.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-7.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/100%25-Client--Side-B8FF01?style=for-the-badge" alt="Client-Side" />
</p>

---

## 🕹️ Modos de Jogo

### 1. ▶ Modo Clássico (Narutodle)
* **Sorteio Determinístico Diário:** Todo dia à meia-noite (Horário de Brasília), um novo craque secreto é sorteado a partir de uma semente matemática (`hash(date) % players.length`).
* **Autocomplete Instantâneo com Foto:** Digite o nome do atleta e selecione-o diretamente no dropdown arcade. Chute livre digitado sem seleção é bloqueado para manter integridade total dos dados.
* **Linha de Comparação (6 Atributos em 16-bit):**
  * `JOGADOR`: Foto quadrada e nome do atleta.
  * `TIME`: 🟩 Correto / 🟥 Incorreto.
  * `IDADE`: 🟩 Exata / 🟨 Parcial (±2 anos) / 🟥 Diferença ≥ 3 anos + Seta arcade de indicação (`↑` mais velho / `↓` mais novo).
  * `POSIÇÃO`: Goleiro, Defensor, Meia ou Atacante.
  * `PAÍS`: 🟩 Mesmo país / 🟥 País diferente.
  * `TÍTULOS`: Brasileirão, Copa do Brasil e Libertadores (🟩 3 exatos / 🟨 Pelo menos 1 em comum / 🟥 Nenhum).
* **Animação Flip Reveladora:** Revelação card a card com 150ms de delay entre as colunas.
* **Modal High Score:** Placar final com foto, estatísticas, cronômetro até o próximo craque e botão **`▶ COPIAR RESULTADO`** gerando a grade de emojis (`🟩🟨🟥⬆️⬇️`) para WhatsApp e X/Twitter!

### 2. 🏁 Grid do Brasileirão 3x3 (Futbol11 Grid / Tiki-Taka-Toe)
* Tabuleiro 3x3 cruzando clubes e atributos (ex: *Flamengo*, *Palmeiras*, *Corinthians* vs. *Libertadores*, *Atacante*, *Brasil*).
* Validação automática considerando clube atual e histórico de carreira (`careerTeams`).
* Chuva de confetes comemorativa ao completar as 9 células!

---

## 🎨 Direção de Arte "Retro Arcade"
* **Background Fixo:** Fotografia da clássica mesa de pebolim Nike com vinheta escura e efeito sutil de *scanlines* de monitor CRT.
* **Paleta PlayVerse:** Fundo azul meia-noite (`#0A0B1E`), moldura roxa vibrante (`#6D28D9`), cantoneiras em pixel art verde-limão (`#B8FF01`), ciano arcade (`#38BDF8`) e sombras duras (`box-shadow: 0 6px 0 #000`).
* **Tipografia:** Google Fonts `'Press Start 2P'`, `'Silkscreen'` e `'Chakra Petch'`.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* Node.js v18+ instalado
* NPM ou PNPM

```bash
# 1. Clone o repositório
git clone https://github.com/YvesDeSa/brasileiraodle.git

# 2. Acesse a pasta do projeto
cd brasileiraodle

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

---

## ⚡ Sincronização com API-Sports

O projeto já vem com uma base local pronta em `src/data/players.json` contendo mais de 40 estrelas da Série A. Caso queira atualizar os dados automaticamente direto da API-Sports:

1. Crie um arquivo `.env` na raiz com:
   ```env
   VITE_API_SPORTS_KEY=sua_chave_aqui
   ```
2. Execute o script utilitário:
   ```bash
   npm run sync:players
   ```

---

## 📦 Build para Produção

```bash
npm run build
```

Os arquivos estáticos otimizados serão gerados na pasta `dist/` prontos para deploy no Vercel, Netlify ou GitHub Pages sem necessidade de backend!

---

## 📄 Licença

Distribuído sob a licença MIT. Desenvolvido por [YvesDeSa](https://github.com/YvesDeSa).
