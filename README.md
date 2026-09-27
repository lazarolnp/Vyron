# VYRON — Site institucional

Site institucional da VYRON (Agência Digital — Sites, Tráfego & Performance).
HTML, CSS e JavaScript puros, sem etapa de build: basta publicar os arquivos em qualquer hospedagem estática (Netlify, Vercel, GitHub Pages, Hostinger etc.).

## Estrutura

```
index.html              Página única com todas as seções
assets/css/styles.css   Estilos (mobile-first)
assets/js/config.js     ⚙️ Dados de contato (WhatsApp, e-mail)
assets/js/main.js       Menu, animações, formulário → WhatsApp
assets/img/             Logo, favicon, ícones e imagem de compartilhamento (OG)
site.webmanifest, robots.txt
```

Para visualizar localmente: `python3 -m http.server` e abra http://localhost:8000.

## Contato (WhatsApp e e-mail)

Os dados já estão configurados. Para alterá-los, edite `assets/js/config.js`:

```js
whatsapp: "5579998242217",          // DDI + DDD + número, só dígitos
whatsappDisplay: "(79) 99824-2217", // como aparece no site
email: "vyronn01@gmail.com",
```

Todos os botões "Falar com a VYRON", o botão flutuante e o formulário de contato passam a usar esse número.
O formulário não precisa de servidor: ao enviar, abre o WhatsApp com a mensagem já preenchida.

O número e o e-mail também aparecem escritos em `index.html` (links de fallback e dados estruturados); ao trocar, faça uma busca por `5579998242217` e `vyronn01@gmail.com`.

## Atualizar projetos e depoimentos

- **Projetos** (`#projetos` em `index.html`): há instruções em comentário acima da seção. Troque o bloco `project-placeholder` por uma `<img>` em `assets/img/projetos/` e edite título/categoria.
- **Depoimentos**: substitua os textos entre colchetes por depoimentos **reais e autorizados** e remova a classe `is-placeholder` do `<figure>`.

## Quando tiver domínio

Em `index.html`, descomente as tags `canonical` e `og:url` e troque `og:image` / `twitter:image` por URLs absolutas (ex.: `https://www.seudominio.com.br/assets/img/og-image.png`) para que as prévias de compartilhamento funcionem em todas as redes.
