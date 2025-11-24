(function($) {
    'use strict';
  
    const config = {
      cepInput: '#id_cep',
      enderecoInput: '#id_endereco',
      numeroInput: '#id_numero',
      complementoInput: '#id_complemento',
      bairroInput: '#id_bairro',
      cidadeInput: '#id_cidade',
      estadoInput: '#id_estado',
      cepParaBuscar: '04538-132',
      numeroParaPreencer: '999'
    };
  
    // Função para verificar se os dados de endereço foram carregados
    function verificarSeCarregou() {
      const endereco = $(config.enderecoInput).val();
      const bairro = $(config.bairroInput).val();
      const cidade = $(config.cidadeInput).val();
      const estado = $(config.estadoInput).val();
  
      const enderecoPreenchido = endereco && endereco.trim().length > 0;
      const bairroPreenchido = bairro && bairro.trim().length > 0;
      const cidadePreenchido = cidade && cidade.trim().length > 0;
      const estadoPreenchido = estado && estado.trim().length > 0;
  
      return enderecoPreenchido && bairroPreenchido && cidadePreenchido && estadoPreenchido;
    }
  
    // Função para preencher campos que faltam
    function preencherOQueFalta() {
      // Preencher número
      $(config.numeroInput).val(config.numeroParaPreencer);
      $(config.numeroInput).trigger('change');
      $(config.numeroInput).trigger('input');
      
      // Selecionar radio button de envio digital
      const radioButton = $('input[name="forma_envio"][data-codigo="envio-digital"]');
      if (radioButton.length > 0) {
        radioButton.prop('checked', true);
        radioButton.trigger('change');
        radioButton.trigger('click');
      }
    }
  
    // Função principal
    function iniciarPreenchimento() {
      // Verificar se o input CEP existe
      if ($(config.cepInput).length === 0) {
        return;
      }
  
      // PASSO 1: Preencher CEP
      const cepInput = $(config.cepInput);
      cepInput.focus();
      cepInput.val(config.cepParaBuscar);
      cepInput.trigger('change');
      cepInput.trigger('input');
      cepInput.trigger('keyup');
      cepInput.trigger('keydown');
  
      // PASSO 2: Aguardar dados carregarem
      setTimeout(function() {
        cepInput.blur();
        
        let tentativas = 0;
        const maxTentativas = 60;
  
        const verificarIntervalo = setInterval(function() {
          tentativas++;
  
          if (verificarSeCarregou()) {
            clearInterval(verificarIntervalo);
  
            // PASSO 3: Preencher o que falta
            preencherOQueFalta();
            return;
          }
  
          if (tentativas >= maxTentativas) {
            clearInterval(verificarIntervalo);
            preencherOQueFalta();
          }
        }, 500);
      }, 2000);
    }
  
    // Executar somente após a página inteira carregar
    $(window).on('load', function() {
      setTimeout(function() {
        iniciarPreenchimento();
      }, 1000);
    });
  
    // Fallback: se window load não funcionar, tentar após 5 segundos do ready
    $(document).ready(function() {
      setTimeout(function() {
        if ($(config.cepInput).length === 0) {
          iniciarPreenchimento();
        }
      }, 5000);
    });
  
  })(jQuery);