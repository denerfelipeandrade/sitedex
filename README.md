# Site DEX POWER — dexpower.com.br

Site institucional estático: só HTML, CSS e JavaScript, sem banco de dados, login ou build.

## Estrutura

```
public/                  tudo o que vai para o ar
  index.html             página inicial
  privacidade.html       política de privacidade (LGPD)
  404.html               página de erro
  robots.txt, sitemap.xml, favicon.svg
  assets/css/site.css    estilos (nada de estilo embutido no HTML: a CSP bloqueia)
  assets/js/site.js      menu do celular e pedido de orçamento pelo WhatsApp
  assets/img/            fotos dos produtos, conectores, logo e imagem de compartilhamento (og.png)
  assets/fontes/         Sora e Inter (SIL Open Font License, ver LICENCA.txt)
  assets/docs/           portfólio em PDF
```

## Ver no computador

```
python3 -m http.server 8000 --directory public
```

e abra http://localhost:8000.

## Publicação (GitHub Pages)

O workflow `.github/workflows/publicar.yml` publica a pasta `public/` a cada push na `main`.
Configuração única no repositório: Settings → Pages → Source: **GitHub Actions**.
Domínio: Settings → Pages → Custom domain → `dexpower.com.br`, com **Enforce HTTPS** ligado.

## Segurança

- Sem segredos neste repositório: chaves e senhas nunca entram aqui.
- Cada página declara a política de segurança de conteúdo (CSP): só carrega scripts, estilos, imagens e fontes do próprio site.
- O formulário não guarda dados: monta a mensagem e abre o WhatsApp.
