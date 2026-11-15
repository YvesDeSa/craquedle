# ⚽🎮 CRAQUEDLE ❖ O Jogo Diário do Brasileirão Série A

<p align="center">
  <img src="https://media.api-sports.io/football/leagues/71.png" alt="Brasileirão Série A" width="90" />
</p>

<p align="center">
  <strong>Jogo web diário de adivinhação de jogadores do Campeonato Brasileiro Série A com mecânica do Narutodle e Grid 3x3 do Brasileirão (Futbol11 Grid / Tiki-Taka-Toe), envelopado em direção de arte Brasil Retro Arcade (Verde Floresta, Amarelo Canarinho e Branco).</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/CRAQUEDLE-2026-FFDF00?style=for-the-badge&logo=target" alt="Craquedle" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-7.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-00DF81?style=for-the-badge&logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Layout-Zero_Scroll_100vh-FFDF00?style=for-the-badge" alt="Zero Scroll" />
</p>

---

## 🕹️ Modos de Jogo

### 1. ▶ Modo Clássico (Narutodle)
* **Sorteio Determinístico Diário:** Todo dia à meia-noite (Horário de Brasília), um novo craque secreto é sorteado a partir de semente matemática baseada na data (`YYYY-MM-DD`).
* **Autocomplete Instantâneo com Foto e Bandeira:** Selecione o atleta no dropdown com foto real oficial, bandeira do país e clube atual. Chute livre digitado sem seleção é bloqueado.
* **Linha de Comparação (6 Atributos em 16-bit):**
  * `JOGADOR`: Foto quadrada e nome do atleta.
  * `TIME`: 🟩 Correto / 🟥 Incorreto.
  * `IDADE`: 🟩 Exata / 🟨 Parcial (±2 anos) / 🟥 Incorreto + Seta arcade indicando se o segredo é mais velho (`↑`) ou mais novo (`↓`).
  * `POSIÇÃO`: Goleiro, Defensor, Meia ou Atacante (fonte Chakra Petch com suporte total a acentos).
  * `PAÍS`: Bandeira oficial em alta definição (FlagCDN) + nome do país.
  * `TÍTULOS`: Badges individuais com ícones das taças (estilo elementos do Narutodle):
    * 🏆 **`BR`**: Campeão do Brasileirão Série A.
    * 🥇 **`CdB`**: Campeão da Copa do Brasil.
    * 🌟 **`LIB`**: Campeão da CONMEBOL Libertadores.
* **Layout Zero Scroll:** A página cabe 100% na altura da tela (`100vh`) sem barra de rolagem na janela do navegador. As linhas de palpites contam com scroll vertical interno dedicado (`max-h-[40vh]`).
* **Modal High Score:** Placar final com foto, estatísticas, cronômetro regressivo e botão **`▶ COPIAR RESULTADO`** para WhatsApp e X/Twitter!

### 2. 🏁 Grid do Brasileirão 3x3 (Futbol11 Grid / Tiki-Taka-Toe)
* Tabuleiro 3x3 cruzando clubes e atributos (ex: *Flamengo*, *Palmeiras*, *Corinthians* vs. *Libertadores*, *Atacante*, *Brasil*).
* Validação automática considerando clube atual e histórico de carreira (`careerTeams`).
* Chuva de confetes comemorativa ao completar as 9 células!

---

## 🎨 Direção de Arte Brasil Retro Arcade
* **Paleta Brasil Arcade:** Fundo verde floresta profundo (`#061A12` / `#0A2619`), moldura arcade em Amarelo Canarinho (`#FFDF00`), cantoneiras pixel em Verde Neon (`#00DF81`) e Branco (`#FFFFFF`), e sombras duras (`box-shadow: 0 5px 0 #000`).
* **Background Fixo:** Fotografia da clássica mesa de pebolim Nike com vinheta escura e efeito sutil de *scanlines* de TV CRT.
* **Tipografia:** Google Fonts `'Chakra Petch'`, `'Press Start 2P'`, `'Silkscreen'` e `'Inter'`.

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

## ⚡ Sincronização da Base de Jogadores

O projeto vem com **165+ atletas da Série A** já populados com fotos 100% reais verificadas e histórico de carreira:

```bash
# Atualiza automaticamente a base de jogadores via Cartola FC e API-Sports
npm run sync
```

---

## 📦 Build para Produção

```bash
npm run build
```

Arquivos estáticos gerados em `dist/`, prontos para deploy sem necessidade de backend!
