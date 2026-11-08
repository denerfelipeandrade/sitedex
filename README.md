# Site DEX POWER — dexpower.com.br

Site institucional estático: só HTML, CSS e JavaScript, sem banco de dados, login ou build.

## Estrutura

```
public/                  tudo o que vai para o ar
  index.html             página inicial
  privacidade.html       política de privacidade (LGPD)
  404.html               página de erro
  _headers               cabeçalhos de segurança (CSP, HSTS…) aplicados pela Cloudflare Pages
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

## Publicação (Cloudflare Pages)

1. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → escolher `sitedex`.
2. Framework preset: **None** · Build command: **(vazio)** · Build output directory: **`public`**.
3. Cada push na branch `main` publica o site automaticamente.
4. Custom domains → adicionar `dexpower.com.br` e `www.dexpower.com.br`.

## Segurança

- Sem segredos neste repositório: chaves e senhas nunca entram aqui.
- `public/_headers` define a política de segurança de conteúdo: só carrega scripts, estilos, imagens e fontes do próprio site.
- O formulário não guarda dados: monta a mensagem e abre o WhatsApp.
