/**
 * Classe Consulta

 * @constructs Consulta
 * 
 * @param {number} id - id
 * @param {date} diaDaConsulta - dia da consulta
 * @param {number} hora  - hora da consulta
 * @param {Medico} medico - nome do medico
 * @param {string} nomeDoAnimal - nome do animal
 * @param {string} tipoDeConsulta - tipo de consulta
 * @param {string} efetivada  - se a consulta foi efeitvada ou nao, por omissao está nao.
 * @param {string} paga - se a consulta foi paga ou nao, por omissao está nao.
 */

function Consulta(id, diaDaConsulta, hora, medico, nomeDoAnimal, tipoDeConsulta, efetivada, paga) {
    this.id = id;
    this.diaDaConsulta = diaDaConsulta;
    if (hora == 14)
        throw Error("Não é possivel adicionar consultas na hora de almoco.");
    else
        this.hora = hora;
    this.medico = medico;
    this.nomeDoAnimal = nomeDoAnimal;
    this.tipoDeConsulta = tipoDeConsulta;
    this.efetivada = efetivada;
    this.paga = paga;
}

/**
 * Classe Lista Consultas
 * 
 * @constructs ListaConsultas
 * 
 */
function ListaConsulta() {
    if (localStorage['ListaConsultas']) {
        var retrievedObject = JSON.parse(localStorage['ListaConsultas']);
        this.consultas = retrievedObject;
    } else {
        this.consultas = [];
    }
}

/**
 * Obtem o numero de consultas
 * @method getNumberOfConsultas
 * @returnss O tamanho do localStorage, ou seja, o numero total de consultas
 */
ListaConsulta.getNumberOfConsultas = function () {
    var retrievedObject = JSON.parse(localStorage['ListaConsultas']);
    return retrievedObject.length;
};

/**
 * Cria os objetos, após se clicar em tipo de consulta
 * @method createObjects
 */
function createObjects() {
    var mainForm = document.getElementById("mainForm");
    listarTipoConsulta();
    createElements("DIV", mainForm, "idDiv");
}

/**
 * Criar o mapa da semana com as marcações
 * @method createMarcacoes
 * @param {HTMLObjectElement} medicoSelected
 * @returns mapa da semana por medico
 */
ListaConsulta.prototype.createMarcacoes = function (medicoSelected) {

    var medico = medicoSelected.value;

    var dataInput = document.getElementById("dataInput");
    dataInput.setAttribute("onChange", "new ListaConsulta().listHours(this,'" + medico + "')");

    document.getElementById("theadMarc").hidden = false;

    var tBody = document.getElementById("tbodySemana");

    removeChilds(tBody);

    var idHeader = document.getElementById("idHeader");

    idHeader.textContent = "Consultas do médico " + medico + " nos próximos 7 dias";


    for (let i = 0; i < 7; i++) {
        let tr = document.createElement("TR");
        let date = new Date();
        let td = document.createElement("TD");
        let text = document.createTextNode(date.addDays(i));
        let counter = 0, hoje = 0, horasRestantes = 0;

        tr.setAttribute("id", "myTR" + i);
        tBody.appendChild(tr);
        td.appendChild(text);
        document.getElementById("myTR" + i).appendChild(td);

        if (data.getDataAtual() >= 10 && data.getDataAtual <= 18) {
            if (data.getHoras() < 14) // verificar quantos espaços existem conforme a hora atual
                horasRestantes = 18 - data.getHoras() - 1; // o menos 1, é por causa da hora de almoço
            else
                horasRestantes = 18 - data.getHoras();
        } else {
            horasRestantes = 18;
        }

        this.consultas.forEach(function (consultasForEach) {
            if ((consultasForEach.medico == medico)) {
                if (consultasForEach.diaDaConsulta == text.textContent) {
                    tr.setAttribute("class", "notAvailable");
                    counter++;
                    if (consultasForEach.diaDaConsulta == data.getDataAtual())
                        hoje++; //counter para as consultas com o dia igual ao dia de hoje
                }
            }
        });

        /* Verificar se o dia está cheio de consultas OU se o dia de hoje tem a marcação cheia conforme as horas que são */
        if ((counter >= 8) || (text.textContent == data.getDataAtual() && hoje >= horasRestantes))
            tr.setAttribute("class", "notAvailableDate");

    }
}


/**
 * Listar as horas do mapa da semana
 * @method listHours
 * @param {date} data
 * @param {string} medico - nome do medico
 * @returns horas do mapa da semana 
 */
ListaConsulta.prototype.listHours = function (data, medico) {

    document.getElementById("theadMarc").hidden = false;

    var tBody = document.getElementById("tbodySemana");

    removeChilds(tBody);

    var idHeader = document.getElementById("idHeader");

    idHeader.textContent = "Hora | Marcações para o dia: " + data.value;

    for (var i = 10; i <= 18; i++) {
        var tr = document.createElement("TR");
        var td = document.createElement("TD");
        var text;

        tr.setAttribute("id", i);
        tBody.appendChild(tr);
        document.getElementById(i).appendChild(td);

        this.consultas.forEach(function (currentValue, index, array) {
            if ((currentValue.medico == medico) && (currentValue.diaDaConsulta == data.value) && (currentValue.hora == i)) { //verificar disponibilidade da consulta
                tr.setAttribute("class", "notAvailable");
                createSpans(i + ":00", td, "notAvailable");
                text = document.createTextNode(" - Indisponível - " + currentValue.nomeDoAnimal);
            }
        });

        if (i == 14) { //hora de almoco
            tr.setAttribute("class", "notAvailable");
            createSpans(i + ":00", td, "notAvailable");
            text = document.createTextNode(" - Hora de almoço");
        } else if (!tr.getAttribute("class")) { //hora normal
            createSpans(i + ":00", td, "hours" + i);
            text = document.createTextNode(" - Clique para adicionar");
            tr.setAttribute("onclick", "checkHour(this)");
        }

        td.appendChild(text);
    }
}


/**
 * Verificar hora selecionada
 * @method checkHour
 * @param {HTMLObjectElement} tr 
 */
function checkHour(tr) {
    if (tr.getAttribute("class")) {
        tr.removeAttribute("class");
    } else {
        var table = document.getElementById('marcacoesTable');
        var numberChilds = table.rows.length;

        for (var i = 1; i < numberChilds; i++) {// se algum ja tiver selecionado, tirar a classe checked a todos 
            if (table.rows[i].getAttribute("class") == "checked")
                table.rows[i].removeAttribute("class");
        }

        tr.setAttribute("class", "checked"); // e colocar a class aquele que foi selecionado
        tr.text = "teste";
    }
}

/**
 * Elimina os filhos de um "Pai"
 * @method removeChilds
 * @param {HTMLObjectElement} myNode - elementos HTML
 */
function removeChilds(myNode) {
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

/**
 * Obter a opção selecionada
 * @method getSelected
 * @param {HTMLObjectElement} selectObject - valor do select
 */
function getSelected(selectObject) {
    var elem = document.getElementById('idDiv');
    removeChilds(elem);
    var value = selectObject.value;
    listarMedicos(value);
}

/**
 * Criar o select com o tipo de Consulta
 * @method listarTipoConsulta
 */
function listarTipoConsulta() {

    var arr = JSON.parse(localStorage['Especialidade']);

    var mainForm = document.getElementById("mainForm");

    createLabels("Tipo de Consulta: ", mainForm);
    createElements("SELECT", mainForm, "tipoConsulta", "custom-select");
    createBrs(mainForm);

    var getSelectTipo = document.getElementById("tipoConsulta");
    getSelectTipo.setAttribute("onchange", "getSelected(this)");

    var option = document.createElement("option");
    option.text = "Escolher opção:";
    getSelectTipo.add(option);

    for (let i = 0; i < arr.length; i++) {
        var option = document.createElement("option");
        option.text = arr[i];
        getSelectTipo.add(option);
    }
    getSelectTipo.options[0].disabled = true;
}

/**
 * Criar o select com os médicos relacionados com o tipo de consulta
 * @method listarMedicos
 * @param {HTMLObjectElement} opcao - opão do select
 */
function listarMedicos(opcao) {

    var mainForm = document.getElementById("idDiv");

    createBrs(mainForm);

    createLabels("Médicos: ", mainForm);

    createElements("SELECT", mainForm, "medicos", "custom-select");

    createBrs(mainForm);

    createBrs(mainForm);

    var getSelectMedicos = document.getElementById("medicos");

    getSelectMedicos.setAttribute("onfocus", " new ListaConsulta().createMarcacoes(this)");

    var founded = false;

    if (localStorage['ListaMedicos']) {
        var arr = JSON.parse(localStorage['ListaMedicos']);
        for (let i = 0; i < arr.length; i++) {
            if (opcao == arr[i].especialidade) {
                var option = document.createElement("option");
                option.text = arr[i].nome;
                getSelectMedicos.add(option);
                founded = true;
            }
        }
    }

    if (!founded) {
        var option = document.createElement("option");
        option.text = "Não existem médicos";
        getSelectMedicos.disabled = true;
        getSelectMedicos.add(option);
        var button = document.getElementById('submit');
        button.parentNode.removeChild(button);
    }

    createLabels("Dia da consulta:", mainForm);
    createInputs(mainForm, "dataInput", "date", "form-control");
    createBrs(mainForm);
    createButtons(mainForm, "submit", "submit", "btn btn-primary", "Submeter", "");

    getSelectMedicos.focus();
   }

/**
 * Quardar as consultas no localStorage
 * @method saveConsultas
 */
ListaConsulta.prototype.saveConsultas = function () {
    localStorage['ListaConsultas'] = JSON.stringify(this.consultas);
}

/**
 * Adicionar consulta
 * @method acrescentarConsulta
 * @param {Consulta} consulta - objeto consulta
 */
ListaConsulta.prototype.acrescentarConsulta = function (consulta) {
    this.consultas.push(consulta);
    this.saveConsultas();
}

/**
 * Remover todas as consultas referente ao médico
 * @method removerConsultasByMedico
 * @param {string} medico - string medico
 */

ListaConsulta.prototype.removerConsultasByMedico = function (medico) {
    for (let i = this.consultas.length - 1; i >= 0; i--) {
        if (this.consultas[i].medico === medico) {
            this.consultas.splice(i, 1);
        }
    }
    this.saveConsultas();
}

/**
 * Procurar um index de uma array
 * @method searchIndex
 * @param {array} array
 * @param {string} attr
 * @param {number} value
 */
function searchIndex(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

/**
 * Remover consultas
 * @method removerConsulta
 * @param {number} posicao
 */
ListaConsulta.prototype.removerConsulta = function (posicao) {
    for (let i = 0; i < this.consultas.length; i++) {
        if (this.consultas[i].id === posicao) {
            var index = searchIndex(this.consultas, 'id', posicao);
            this.consultas.splice((index), 1);
            this.saveConsultas();
            break;
        }
    }
    ListaConsulta.apresentar();
}



/**
 * Adicionar consultas
 * @method acrescentarConsultas
 * @param {consulta} consulta - objeto consulta
 */
ListaConsulta.prototype.acrescentarConsultas = function () {
    consulta = Array.prototype.slice.call(arguments); //Transformar o "arguments" num array par poder usar o forEach
    consulta.forEach(function (currentValue, index, array) {
        this.acrescentarConsulta(currentValue);
    }, this);
    return this;

};

/**
 * Modal Save do efetivar/Pagar
 * @method saveModal
 * @param {number} id
 */
function saveModal(id) {
    var localStorageObjs = JSON.parse(localStorage['ListaConsultas']);
    var selectModal = document.getElementById("idSelect");

    for (let i = 0; i < localStorageObjs.length; i++) {
        if (localStorageObjs[i].id == id) {
            localStorageObjs[i].efetivada = selectModal.options[selectModal.selectedIndex].text;
        }
    }
    localStorage['ListaConsultas'] = JSON.stringify(localStorageObjs);
    ListaConsulta.apresentar();
}

/**
 * Modal Open do efetivar/Pagar
 * @method openModal
 * @param {number} id - id
 * @param {string} option - efetivada
 */
function openModal(id, option) {
    var modal = document.getElementById('modal-body');
    var saveButton = document.getElementById('saveButton');
    var paymentButton = document.getElementById('paymentButton');

    removeChilds(modal);

    saveButton.setAttribute("onclick", "saveModal(" + id + ")");

    createLabels("Efetivada: ", modal);

    createElements("SELECT", modal, "idSelect", "custom-select");

    var selectModal = document.getElementById("idSelect");

    selectModal.setAttribute("onchange", "checkOption(this.value)");

    createOptions(selectModal, "Escolher Opção");
    createOptions(selectModal, "Sim");
    createOptions(selectModal, "Não");

    selectModal.options[0].disabled = true;

    if (option == "Sim")
        paymentButton.disabled = false;
    else
        paymentButton.disabled = true;

    checkOption(option);

    selectModal.value = option;
}


/**
 * Verificar opção - Modal
 * @method checkOption
 * @param {HTMLObjectElement} getSelected - objeto select
 */
function checkOption(getSelected) {
    if (getSelected == "Sim")
        paymentButton.disabled = false;
    else
        paymentButton.disabled = true;
}

/**
 * Listar consultas - Tabela
* @method listarConsultas
 */
ListaConsulta.prototype.listarConsultas = function (hoje) { //boolean para listar os dia de hoje se o parametro passar true
    var today = false;
    if (this.consultas.length === 0) { //quando nao ha dados na localStorage
        return "<h4>Não existem consultas na base de dados!</h4>";

    } else {
        if (hoje) {
            var resultado = `<table class='table'><thead class="thead-dark"><tr><th>Hora</th><th>Medico</th><th>Nome do Animal</th><th>Tipo de Consulta</th><th>Efetivada</th><th>Paga</th><th>Remover</th><th>Efetivar/Pagar</th></tr></thead>`;
            this.consultas.forEach(function (currentValue, index, array) { //percorrer o array para criar a tabela
                if (currentValue.diaDaConsulta === data.getDataAtual()) { // verificar se as consultas são para o dia atual
                    var remove = `<td><a onclick="new ListaConsulta().removerConsulta(` + currentValue.id + `)" class='far fa-times-circle'></a></td>`;
                    resultado += "<tr><td> " + currentValue.hora + ":00</td><td> " + currentValue.medico + "</td><td> " + currentValue.nomeDoAnimal + "</td><td>" +
                        currentValue.tipoDeConsulta + "</td><td>" + currentValue.efetivada + "</td><td>" + currentValue.paga + "</td>" +
                        remove + "<td><a onclick='openModal(" + currentValue.id + ",`" + currentValue.efetivada + "`)' data-toggle='modal' data-target='#exampleModal'><i class='far fa-edit'></i></a></td></tr>";
                    today = true;
                }
            });
            if (today)
                resultado += "</table>";
            else
                resultado = "<h4>Não existem consultas para hoje! :(</h4>"; //Quando nao ha consultas para o dia de hoje na localStorage

        } else {
            var resultado = `<table class='table'><thead class="thead-dark"><tr><th>Data</th><th>Hora</th><th>Medico</th><th>Nome do Animal</th><th>Tipo de Consulta</th><th>Efetivada</th><th>Paga</th><th>Remover</th><th>Efetivar/Pagar</th></tr></thead>`;
            this.consultas.forEach(function (currentValue, index, array) {
                var remove = `<td><a onclick="new ListaConsulta().removerConsulta(` + currentValue.id + `)" class='far fa-times-circle'></a></td>`;
                resultado += "<tr><td> " + currentValue.diaDaConsulta + "</td><td> " + currentValue.hora + ":00</td><td> " + currentValue.medico + "</td><td> " + currentValue.nomeDoAnimal + "</td><td>" +
                    currentValue.tipoDeConsulta + "</td><td>" + currentValue.efetivada + "</td><td>" + currentValue.paga + "</td>" +
                    remove + "<td><a onclick='openModal(" + currentValue.id + ",`" + currentValue.efetivada + "`)' data-toggle='modal' data-target='#exampleModal'><i class='far fa-edit'></i></a></td></tr>";
            });
            resultado += "</table>";
        }

        return resultado;
    }
};

/**
 * Guardar as consultas num array de consultas
 * @method getConsultasLocal
 */
ListaConsulta.prototype.getConsultasLocal = function () {
    if (localStorage['ListaConsultas']) {
        this.consultas = JSON.parse(localStorage['ListaConsultas']);
    }
}

function switchConsultas(obj) {
    let change = false;
    if (obj.text.includes("dia")) {
        obj.innerHTML = '<i class="fa fa-clipboard-list"></i> Mostrar todas as consultas';
        change = true
    } else {
        obj.innerHTML = '<i class="fa fa-clipboard-list"></i> Mostrar consultas do dia';
        change = false
    }
    ListaConsulta.apresentar("", change);
}

/**
 * Apresentar consulta
 * @method apresentar
 * @param {Consulta} consulta - objeto do tipo consulta
 * @param {boolean} hoje - true = consultas do dia hoje // false = todas as consultas
 */
ListaConsulta.apresentar = function (consulta, hoje) {

    if (hoje == undefined) // por default, se não se passar nada como parametro, so aparece as consultas do dia
        hoje = true;

    consulta = consulta || new ListaConsulta().acrescentarConsultas();
    consulta.getConsultasLocal();
    document.getElementById("todayConsultation").innerHTML = consulta.listarConsultas(hoje);
    consulta.saveConsultas();
};

/**
 * Verificar se um campo é null ou nao está preenchido
 * @method isNull
 * @param {HTMLObjectElement} campo - um objeto html
 * @returns retorna true se o campo for inválido
 */
function isNull(campo) {
    return (campo == "" || campo == null || campo == undefined);
}

/**
 * Manda um alert e dá focus ao campo, quando dá erro
 * @method alertAndFocus
 * @param {} campo
 * @param {} msg
 * @param {} classError
 * @returns quando o campo é invalido retorna false
 */
function alertAndFocus(campo, msg, classError) {
    alert(msg);
    campo.focus();
    campo.setAttribute("class", classError);
    return false;
}

/**
 * Verificações ao adicionar consulta
 * @method checkConsulta
 * @param {Medico} medico - objeto do tipo médico
 * @param {string} nomeAnimal
 * @param {string} tipoConsulta
 * @param {date} dataInput
 * @param {number} hora
 */
function checkConsulta(medico, nomeAnimal, tipoConsulta, dataInput, hora) {
    if (isNull(dataInput.value))
        alertAndFocus(dataInput, "Data inválida", "input-error form-control");
    else if (dataInput.value < data.getDataAtual())
        alertAndFocus(dataInput, "Data Indisponível", "input-error form-control");
    else if (isNull(hora))
        alert("Hora inválida");
    else if (hora.id <= data.getHoras() && dataInput.value == data.getDataAtual())  //comentar para testes
        alertAndFocus(hora, "Hora indisponível!");
    else if (hora.id == 14)
        alertAndFocus(hora, "Não é possivel adicionar consultas na hora de almoço ");
    else if (isNull(nomeAnimal.value))
        alertAndFocus(nomeAnimal, "O campo 'Nome do Animal' é um obrigatório!", "input-error form-control");
    else if (isNull(tipoConsulta.value))
        alertAndFocus(tipoConsulta, "O campo 'Tipo de Consulta' é obrigatório!", "input-error form-control");
    else if (isNull(medico.value))
        alertAndFocus(medico, "Obrigatório escolher um médico", "input-error form-control");
    else if (medico.value == "Não existem médicos")
        alertAndFocus("Não existem médicos para este tipo de consulta", "input-error form-control");
    else
        return true;

}

/**
 * Acrescentar Consulta
 * @method acrescentar
 * @param {Consulta} consulta - objeto do tipo consulta

 */
ListaConsulta.acrescentar = function (consulta) {
    try {
        var table = document.getElementById('marcacoesTable');
        var numberChilds = table.rows.length;
        var hora;

        for (var i = 1; i < numberChilds; i++) {
            if (table.rows[i].getAttribute("class") == "checked") {
                hora = table.rows[i]; // ir buscar a hora selecionada ao mapa da semana
                break;
            }
        }

        var dataInput = document.getElementById("dataInput");
        var nAnimal = document.getElementById("nomeAnimal");
        var tipoConsulta = document.getElementById("tipoConsulta");
        var medico = document.getElementById("medicos");

        if (checkConsulta(medico, nAnimal, tipoConsulta, dataInput, hora)) {
            consulta = new ListaConsulta().acrescentarConsultas();
            consulta.acrescentarConsulta(new Consulta((ListaConsulta.getNumberOfConsultas() + 1), dataInput.value, hora.id, medico.value, nAnimal.value, tipoConsulta.value, 'Não', 'Não'));
            alert("Consulta adicionada com sucesso");
            window.location.href = "index.html";
        }
    } catch (e) {
        throw Error(e);
    }
};