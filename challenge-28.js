(function (DOM) {
  'use strict';

  /*
  No HTML:
  - Crie um formulário com um input de texto que receberá um CEP e um botão
  de submit;
  - Crie uma estrutura HTML para receber informações de endereço:
  "Logradouro, Bairro, Estado, Cidade e CEP." Essas informações serão
  preenchidas com os dados da requisição feita no JS.
  - Crie uma área que receberá mensagens com o status da requisição:
  "Carregando, sucesso ou erro."

  No JS:
  - O CEP pode ser entrado pelo usuário com qualquer tipo de caractere, mas
  deve ser limpo e enviado somente os números para a requisição abaixo;
  - Ao submeter esse formulário, deve ser feito um request Ajax para a URL:
  "https://viacep.com.br/ws/[CEP]/json/", onde [CEP] será o CEP passado
  no input criado no HTML;
  - Essa requisição trará dados de um CEP em JSON. Preencha campos na tela
  com os dados recebidos.
  - Enquanto os dados são buscados, na área de mensagens de status, deve mostrar
  a mensagem: "Buscando informações para o CEP [CEP]..."
  - Se não houver dados para o CEP entrado, mostrar a mensagem:
  "Não encontramos o endereço para o CEP [CEP]."
  - Se houver endereço para o CEP digitado, mostre a mensagem:
  "Endereço referente ao CEP [CEP]:"
  - Utilize a lib DOM criada anteriormente para facilitar a manipulação e
  adicionar as informações em tela.
  */

  function app() {

    let $formCEP = new DOM('[data-js="form-cep"]')
    let $inputCEP = new DOM('[data-js="input-cep"]')
    let $logradouro = new DOM('[data-js="logradouro"]')
    let $bairro = new DOM('[data-js="bairro"]')
    let $estado = new DOM('[data-js="estado"]')
    let $cidade = new DOM('[data-js="cidade"]')
    let $cep = new DOM('[data-js="cep"]')
    let $status = new DOM('[data-js="status"]')
    let ajax = new XMLHttpRequest()
    $formCEP.on("submit", handleSubmitFormCEP)

    function handleSubmitFormCEP(event) {
      event.preventDefault()
      let url = getUrl()
      console.log("URL", url)
      ajax.open("GET", url)
      ajax.send()
      getMessage("loading")
      ajax.addEventListener("readystatechange", handleReadyStateChange)
    }

    function getUrl() {
      return replaceCEP("https://cdn.apicep.com/file/apicep/[cep].json")
    }

    function clearCEP() {
      return $inputCEP.get()[0].value
    }

    function handleReadyStateChange() {
      if (isRequestOk()) {
        getMessage("ok")
        fillCEPFields()
      }
    }

    function isRequestOk() {
      return ajax.readyState === 4 && ajax.status === 200
    }

    function fillCEPFields() {
      let data = parseData()
      if (!data) {
        getMessage("error")
        data = clearData()
      }

      $logradouro.get()[0].textContent = data.address
      $bairro.get()[0].textContent = data.district
      $estado.get()[0].textContent = data.state
      $cidade.get()[0].textContent = data.city
      $cep.get()[0].textContent = data.code
    }

    function clearData() {
      return {
        address: "-",
        district: "-",
        state: "-",
        city: "-",
        code: "-",
      }
    }

    function parseData() {
      let result
      try {
        result = JSON.parse(ajax.responseText)
      } catch (e) {
        result = null
      }
      return result
    }

    function getMessage(type) {
      let messages = {
        loading: replaceCEP("Buscando informações para o CEP [cep]..."),
        ok: replaceCEP("Endereço referente ao CEP [cep]:"),
        error: replaceCEP("Não encontramos o endereço para o CEP [cep]."),
      }
      $status.get()[0].textContent = messages[type]
    }

    function replaceCEP(message) {
      return message.replace("[cep]", clearCEP())
    }

    return {
      getMessage: getMessage,
      replaceCEP: replaceCEP
    };

  };

  window.app = app();
  app();

})(window.DOM);
