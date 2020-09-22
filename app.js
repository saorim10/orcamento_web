class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;

    }

    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == "" || this[i] == null) {
                return false;
            }
        }
        return true;
    }
}


class Bd {
    constructor() {
        let id = localStorage.getItem("id");

        if (id === null) {
            localStorage.setItem("id", 0);
        }
    }

    getNextId() {
        let nextId = localStorage.getItem("id"); // null
        return parseInt(nextId) + 1;
    }

    gravar(registro) {
        let id = this.getNextId();
        localStorage.setItem(id, JSON.stringify(registro));
        localStorage.setItem("id", id);
    }

    recuperaTodosRegistros() {
        let despesas = Array();
        let id = localStorage.getItem("id");
        for (let i = 1; i <= id; i++){
            let despesa = JSON.parse(localStorage.getItem(i));
            if (despesa === null) {
                continue;
            }
            despesa.id = i;
            despesas.push(despesa);
        }
        return despesas;
    }

    pesquisar(despesa) {
        let despesasFiltradas = Array();

        despesasFiltradas = this.recuperaTodosRegistros();

        console.log(despesasFiltradas);
        console.log(despesa);

        if (despesa.ano != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
        }

        if (despesa.mes != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
        }

        if (despesa.dia != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
        }

        if (despesa.tipo != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
        }

        if (despesa.descricao != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
        }

        if (despesa.valor != "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
        }

        return (despesasFiltradas);
    }

    remover(id){
        localStorage.removeItem(id);
    }
}

let bd = new Bd();

function cadastrar() {
    let ano = document.getElementById("ano");
    let mes = document.getElementById("mes");
    let dia = document.getElementById("dia");
    let tipo = document.getElementById("tipo");
    let descricao = document.getElementById("descricao");
    let valor = document.getElementById("valor");

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    );

    if (despesa.validarDados()) {
        bd.gravar(despesa);
        
        document.getElementById("modal_title_div").className = "modal-header text-success";
        document.getElementById("modal_title").innerHTML = "Despesa gravada com sucesso!";
        document.getElementById("modal_contents").innerHTML = "Tudo certo !!!";
        document.getElementById("modal_button").innerHTML = "Voltar";
        document.getElementById("modal_button").className = "btn btn-success";

        $('#registraDespesa').modal('show');
        dia.value = "";
        mes.value = "";
        ano.value = "";
        tipo.value = "";
        descricao.value = "";
        valor.value = "";


    } else {
        document.getElementById("modal_title_div").className = "modal-header text-danger";
        document.getElementById("modal_title").innerHTML = "Erros na Gravação !!!";
        document.getElementById("modal_contents").innerHTML = "Existem campos obrigatórios que não foram preenchidos !!!";
        document.getElementById("modal_button").innerHTML = "Voltar e Corrigir...";
        document.getElementById("modal_button").className = "btn btn-danger";
        $('#registraDespesa').modal('show');
    }
}

function carregaLista(despesas = Array(), filter = false) {

    if (despesas.length == 0 && filter === false) {
        despesas = bd.recuperaTodosRegistros();
    }
    let listaDespesas = document.getElementById("listaDespesas");
    listaDespesas.innerHTML = "";
    despesas.forEach(function (e) {

        let linha = listaDespesas.insertRow();
        linha.insertCell(0).innerHTML = e.dia + "/" + e.mes + "/" + e.ano;

        switch (e.tipo) {
            case "1": e.tipo = "Alimentação";
                break;
            case "2": e.tipo = "Educação";
                break;
            case "3": e.tipo = "Lazer";
                break;
            case "4": e.tipo = "Saúde";
                break;
            case "5": e.tipo = "Transporte";
                break;
        }

        linha.insertCell(1).innerHTML = e.tipo;
        linha.insertCell(2).innerHTML = e.descricao;
        linha.insertCell(3).innerHTML = e.valor;

        let btn = document.createElement("button");
        linha.insertCell(4).append(btn);
        btn.className = "btn btn-danger";
        btn.innerHTML = "<i class='fas fa-times'></i>";
        btn.id = "id_despesa_" + e.id;
        btn.onclick = function(){
            let id_rem = this.id.replace("id_despesa_", "");
            bd.remover(id_rem);
            window.location.reload();
        }
    })
}

function pesquisarDespesa() {

    let ano = document.getElementById("ano").value;
    let mes = document.getElementById("mes").value;
    let dia = document.getElementById("dia").value;
    let tipo = document.getElementById("tipo").value;
    let descricao = document.getElementById("descricao").value;
    let valor = document.getElementById("valor").value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
    let despesas = bd.pesquisar(despesa);
    
    carregaLista(despesas, true);
}