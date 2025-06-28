# Guia de usuario

## Login e tela inicial

Ao abrir o app, haverá um botão de "LOGIN" que te redirecionará ao Discord

Após realizar o login, você será levado à tela incial, que haverá certas informações do usuário, um botão de logout e, para admins, um botão para acessar o painel de admin

<video controls src="https://github.com/PrincessCyanMarine/TCApp-Manager/raw/refs/heads/master/videos/login.mp4" title="Title"></video>

### Comparação entre tela inicial para admin e para um usuário normal

<video controls src="https://github.com/PrincessCyanMarine/TCApp-Manager/raw/refs/heads/master/videos/admin1.mp4" title="Title"></video>

## Moderação de servidores

Usuários com a permissão de "Administrador" em um servidor são tambem como administradores daquele servidor no app

Administradores de um servidor podem configurar roles que serão reconhecidos como moderador

<video controls src="https://github.com/PrincessCyanMarine/TCApp-Manager/raw/refs/heads/master/videos/moderators.mp4" title="Title"></video>

## Ligar/Desligar/Reiniciar

Admins podem ligar, desligar ou reiniciar os bots a partir do menu de admin

<video controls src="https://github.com/PrincessCyanMarine/TCApp-Manager/raw/refs/heads/master/videos/turnon_off_restart.mp4" title="Title"></video>


## Ativação/Bloqueio de comandos por servidor/geral

Comandos podem ser ativados/desativados por servidor pelos admins ou moderadores do servidor em questão ou em todos os servidores por admins do sistema

Comandos desativados no sistema como um todo têm sua ativação bloqueada na configuração por servidor

<video controls src="https://github.com/PrincessCyanMarine/TCApp-Manager/raw/refs/heads/master/videos/command_activation.mp4" title="Title"></video>

## Uso de comandos

Admins e moderadores de servidores podem ver quantas vezes cada comando foi usado no servidor

Admins do sistema podem ver quantas vezes cada comando foi usado no total em todos os servidores

<video controls src="https://github.com/PrincessCyanMarine/TCApp-Manager/raw/refs/heads/master/videos/commandusage.mp4" title="Title"></video>


## Rank de mensagens

Qualquer membro de um servidor pode ver quantas mensagens cada membro do servidor enviou (a partir da adição dos bots ao servidor)

<video controls src="https://github.com/PrincessCyanMarine/TCApp-Manager/raw/refs/heads/master/videos/messageranking.mp4" title="Title"></video>


## Card customization

Qualquer usuario pode customizar a aparencia do comando "!card" a partir do aplicativo

<video controls src="https://github.com/PrincessCyanMarine/TCApp-Manager/raw/refs/heads/master/videos/2025-06-24 16-31-21.mp4" title="Title"></video>


# Guia de desenvolvedor

## Instalação
Realize a instalação dos bots como indicado em 
[https://github.com/PrincessCyanMarine/TriviumComicsBots/tree/master](https://github.com/PrincessCyanMarine/TriviumComicsBots/tree/master)


Clone e instale esse repositório
```bash
git clone https://github.com/PrincessCyanMarine/TCApp-Manager.git
cd TCApp
npm i
cd ../BotWatcher
npm i
tsc
```

O .env do BotWatcher contem as seguintes 4 variaveis em comum com os bots
```
DATABASE_URL
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
FIREBASE_PROJECT_ID
```
Eles devem ser preenchidos pelos exatos mesmos valores utilizados para os bots

O .env do aplicativo contem as seguintes informações
```
CLIENT_ID
REDIRECT_URI
PUBLIC_SERVER_IP
```
CLIENT_ID é o Client ID do bot que realizará o gerenciamento do login, pode ser encontrado na aba de OAuth do bot

PUBLIC_SERVER_IP é o IP do computador no qual os bots e o BotWatcher estão rodando

REDIRECT_URI é o mesmo configurado no Oauth2 dos bots, normalmente `http://[o ip configurado em PUBLIC_SERVER_IP]:9000/`


Para rodar o app, entre na pasta TCApp e rode `npm run dev`

Para que as funções de desligar/ligar/reiniciar os bots funcione, [os bots precisam estar usando pm2](https://github.com/PrincessCyanMarine/TriviumComicsBots/tree/master?tab=readme-ov-file#running) e BotWatcher precisa estar rodando

Para rodar BotWatcher, entre na pasta do mesmo nome e rode `node .`


## Desenvolvimento
O aplicativo utiliza a configuração padrão do [Quasar](https://quasar.dev/) e somente requer conhecimento basico em [Vue](https://quasar.dev/start/how-to-use-vue)

[Documentação dos bots](https://github.com/PrincessCyanMarine/TriviumComicsBots)