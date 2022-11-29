// Recuperando valores de cadastros
function cadastrarDespesas() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    //Criando o objeto dentro da função para guardar os valores em despesas
    let despesa = new Despesa(
        ano, mes, dia, tipo, descricao, valor
    )

    //Verificando validação de campos
    if (despesa.validarDados()) {
        bd.gravar(despesa)
        document.getElementById('_cortexto').style.color = 'green'
        document.getElementById('_titulo').innerText = 'Sucesso na gravação'
        document.getElementById('_conteudo').innerText = 'A despesa foi cadastrada com sucesso'
        document.getElementById('_voltar').className = 'btn btn-success'
        document.getElementById('_voltar').innerText = 'Voltar'
        $('#registraDespesa').modal('show')
        function limparDados() {
            document.getElementById('ano').value = ''
            document.getElementById('mes').value = ''
            document.getElementById('dia').value = ''
            document.getElementById('tipo').value = ''
            document.getElementById('descricao').value = ''
            document.getElementById('valor').value = ''
        }
        limparDados()
    } else {
        document.getElementById('_cortexto').style.color = 'red'
        document.getElementById('_titulo').innerText = 'Erro na gravação'
        document.getElementById('_conteudo').innerText = 'Existem campos obrigatorios que não foram preenchidos'
        document.getElementById('_voltar').className = 'btn btn-danger'
        document.getElementById('_voltar').innerText = 'Voltar e corrigir'
        $('#registraDespesa').modal('show')
    }
}

//Criando a classe responsavel pelo objeto que vai guardar e validar os valores
class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

//Logica para não haver sobreposição de resultados no local storage 
class Bd {
    constructor() {
        let id = localStorage.getItem('id')
        if (id === null)
            localStorage.setItem('id', 0)
    }
    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }
    gravar(d) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }
    recuperarTodosRegistros() {
        //Array de despesas
        let despesas = []

        let id = localStorage.getItem('id')

        //recuperar todas as depesas cadastradas em local storage
        for (let i = 1; i <= id; i++) {
            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i))
            //Tratando itens null no array pulando esses itens
            if (despesa === null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }
    pesquisar(despesa) {

        let dispesasFiltradas = Array()

        dispesasFiltradas = this.recuperarTodosRegistros()
        console.log(despesa)
        console.log(dispesasFiltradas)

        //Ano
        if (despesa.ano != '') {
            console.log('Filtro de ano')
            dispesasFiltradas = dispesasFiltradas.filter(x => x.ano == despesa.ano)
        }
        //mes
        if (despesa.mes != '') {
            console.log('Filtro de mes')
            dispesasFiltradas = dispesasFiltradas.filter(x => x.mes == despesa.mes)
        }

        //dia
        if (despesa.dia != '') {
            console.log('Filtro de mes')
            dispesasFiltradas = dispesasFiltradas.filter(x => x.dia == despesa.dia)
        }

        //tipo
        if (despesa.tipo != '') {
            console.log('Filtro de mes')
            dispesasFiltradas = dispesasFiltradas.filter(x => x.tipo == despesa.tipo)
        }

        //descricao
        if (despesa.descricao != '') {
            console.log('Filtro de descricao')
            dispesasFiltradas = dispesasFiltradas.filter(x => x.descricao == despesa.descricao)
        }
        //valor
        if (despesa.valor != '') {
            console.log('Filtro de valor')
            dispesasFiltradas = dispesasFiltradas.filter(x => x.valor == despesa.valor)
        }

        return dispesasFiltradas
    }
    remover(id) {
        localStorage.removeItem(id)
    }
}


let bd = new Bd()

function carregaListaDespesa(despesas = [], filtro = false) {
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }
    //selecionando o elemendo tbody da tabela 
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    //percorrer o array despesas, listando cada despesa de forma dinamica 

    despesas.forEach(function (x) {
        //criando linha (tr)
        let linha = listaDespesas.insertRow()

        //Criando as colunas
        linha.insertCell(0).innerHTML = `${x.dia}/${x.mes}/${x.ano}`

        //Ajustando o tipo
        switch (x.tipo) {
            case '1': x.tipo = 'Alimentação'
                break
            case '2': x.tipo = 'Educação'
                break
            case '3': x.tipo = 'Lazer'
                break
            case '4': x.tipo = 'Saúde'
                break
            case '5': x.tipo = 'Transporte'
                break

        }
        linha.insertCell(1).innerHTML = x.tipo
        linha.insertCell(2).innerHTML = x.descricao
        linha.insertCell(3).innerHTML = x.valor

        //Criando botao de exclusão 
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fa fa-times"></i>'
        btn.id = `id_despesa_${x.id}`
        btn.onclick = function () {
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)

    })



}
//Configurando filtro de pesquisas 
function pesquisaDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)
    carregaListaDespesa(despesas, true)

}
