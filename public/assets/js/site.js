// DEX POWER — comportamento do site: menu no celular e pedido de orçamento.
// O pedido vai para o ERP (vira lead no Marketing); se o ERP não responder,
// a pessoa pode mandar o mesmo pedido pelo WhatsApp.
(function () {
  'use strict';
  var WHATSAPP = '5531975685224';
  var ERP = 'https://erp.dexpower.com.br';
  var FORMULARIO = 'site'; // endereço do formulário cadastrado no ERP (Marketing → Formulários)

  // ano do rodapé
  document.querySelectorAll('.ano').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  // menu no celular
  var topo = document.querySelector('.topo');
  var botaoMenu = document.querySelector('.menu-cel');
  if (topo && botaoMenu) {
    var fechar = function () { topo.classList.remove('aberto'); botaoMenu.setAttribute('aria-expanded', 'false'); botaoMenu.setAttribute('aria-label', 'Abrir menu'); };
    botaoMenu.addEventListener('click', function () {
      var aberto = topo.classList.toggle('aberto');
      botaoMenu.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });
    topo.querySelectorAll('nav a').forEach(function (a) { a.addEventListener('click', fechar); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechar(); });
  }

  var form = document.getElementById('orcamento');
  if (!form) return;
  var aviso = form.querySelector('.aviso');
  var botao = form.querySelector('button[type=submit]');
  var enviado = document.getElementById('orcamento-enviado');
  var v = function (nome) { return (form.elements[nome].value || '').trim(); };
  form.addEventListener('change', function (e) { if (e.target.name === 'aceite' && e.target.checked) aviso.textContent = ''; });

  function linkWhatsApp() {
    var linhas = ['Olá! Vim pelo site da DEX POWER e quero um orçamento.', '', 'Nome: ' + v('nome'), 'WhatsApp: ' + v('whatsapp')];
    if (v('email')) linhas.push('E-mail: ' + v('email'));
    if (v('cidade')) linhas.push('Cidade: ' + v('cidade'));
    linhas.push('Local: ' + v('local'));
    if (v('mensagem')) linhas.push('', v('mensagem'));
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(linhas.join('\n'));
  }

  function erro(texto, campo) {
    aviso.textContent = texto;
    if (campo) form.elements[campo].focus();
  }

  // UTM do anúncio (?utm_source=instagram…) vai junto para o ERP saber a origem
  function utm() {
    var dados = {};
    var busca = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
      var valor = busca.get(k);
      if (valor) dados[k] = valor.slice(0, 200);
    });
    return dados;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var digitos = v('whatsapp').replace(/\D/g, '');
    if (!v('nome')) return erro('Informe o seu nome.', 'nome');
    if (digitos.length < 10 || digitos.length > 13) return erro('Informe um WhatsApp com DDD.', 'whatsapp');
    if (v('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))) return erro('Confira o e-mail.', 'email');
    if (!form.elements.aceite.checked) return erro('Marque a autorização para podermos responder.', 'aceite');
    aviso.textContent = '';

    var mensagem = 'Onde vai ficar: ' + v('local') + (v('mensagem') ? '\n\n' + v('mensagem') : '');
    var corpo = Object.assign({
      nome: v('nome'), telefone: v('whatsapp'), email: v('email') || null, cidade: v('cidade') || null,
      mensagem: mensagem, aceite: true, site: v('site') || null,
    }, utm());

    botao.disabled = true;
    botao.textContent = 'Enviando…';
    fetch(ERP + '/api/publico/formularios/' + FORMULARIO, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo),
      credentials: 'omit', referrerPolicy: 'strict-origin-when-cross-origin',
    }).then(function (r) {
      if (r.ok) {
        document.getElementById('orcamento-whats').href = linkWhatsApp();
        form.hidden = true;
        enviado.hidden = false;
        enviado.focus();
        return;
      }
      return r.json().catch(function () { return {}; }).then(function (d) {
        var detalhe = d && typeof d.detail === 'string' ? d.detail : '';
        if (r.status === 422 && detalhe) throw { amigavel: detalhe.charAt(0).toUpperCase() + detalhe.slice(1) + '.' };
        if (r.status === 429) throw { amigavel: 'Muitos envios seguidos. Tente de novo mais tarde ou fale pelo WhatsApp.' };
        throw {};
      });
    }).catch(function (falha) {
      // sem conexão com o ERP (ou erro inesperado): mensagem simples e o WhatsApp como alternativa
      var texto = falha && falha.amigavel ? falha.amigavel : 'Não conseguimos enviar agora.';
      aviso.textContent = '';
      aviso.append(texto + ' ');
      var link = document.createElement('a');
      link.href = linkWhatsApp();
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Enviar pelo WhatsApp';
      aviso.append(link);
    }).finally(function () {
      botao.disabled = false;
      botao.textContent = 'Enviar pedido';
    });
  });
})();
