// DEX POWER — comportamento do site (menu no celular e pedido de orçamento pelo WhatsApp).
(function () {
  'use strict';
  var WHATSAPP = '5531975685224';

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

  // pedido de orçamento: monta a mensagem e abre o WhatsApp (nenhum dado é guardado pelo site)
  var form = document.getElementById('orcamento');
  if (!form) return;
  var aviso = form.querySelector('.aviso');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = function (nome) { return (form.elements[nome].value || '').trim(); };
    var digitos = v('whatsapp').replace(/\D/g, '');
    if (!v('nome')) { aviso.textContent = 'Informe o seu nome.'; form.elements.nome.focus(); return; }
    if (digitos.length < 10 || digitos.length > 13) { aviso.textContent = 'Informe um WhatsApp com DDD.'; form.elements.whatsapp.focus(); return; }
    aviso.textContent = '';
    var linhas = [
      'Olá! Vim pelo site da DEX POWER e quero um orçamento.',
      '',
      'Nome: ' + v('nome'),
      'WhatsApp: ' + v('whatsapp'),
    ];
    if (v('email')) linhas.push('E-mail: ' + v('email'));
    if (v('cidade')) linhas.push('Cidade: ' + v('cidade'));
    linhas.push('Local: ' + v('local'));
    if (v('mensagem')) linhas.push('', v('mensagem'));
    var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(linhas.join('\n'));
    window.open(url, '_blank', 'noopener');
  });
})();
