import React from "react";
import Card from "../../components/card";
import FormGroup from "../../components/form-group";
import SelectMenu from "../../components/selectMenu";
import { withRouter } from 'react-router-dom'
import * as messages from '../../components/toastr';

import LancamentoService from "../../app/service/lancamentoService";
import LocalStorageService from "../../app/service/localstorageService";

class CadastroLancamentos extends React.Component {

    state = {
        id: null,
        descricao: '',
        ano: '',
        mes: '',
        valor: '',
        tipoLancamento: '',
        statusLancamento: '',
        idUsuario: null,
        atualizando: false
    }

    constructor(){
        super();
        this.service = new LancamentoService();
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({ [name]: value });
    }

    submit = () => {
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

        const { descricao, valor, mes, ano, tipoLancamento } = this.state;
        const lancamento = {descricao, valor, mes, ano, tipoLancamento, idUsuario: usuarioLogado.id};

        try {
            this.service.validar(lancamento)
        }catch(erro){
            const mensagens = erro.mensagens;
            mensagens.forEach(msg => messages.mensagemErro(msg));
            return false;
        }

        this.service.salvar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos');
                messages.mensagemSucesso('Lançamento cadastrado com sucesso');
            }).catch(error => {
                messages.mensagemErro(error.response.data);
            });
    }

    atualizar = () => {
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

        const { descricao, valor, mes, ano, tipoLancamento, statusLancamento, id, idUsuario } = this.state;
        const lancamento = {descricao, valor, mes, ano, tipoLancamento, statusLancamento, id, idUsuario};

        this.service.atualizar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos');
                messages.mensagemSucesso('Lançamento atualizado com sucesso');
            }).catch(error => {
                messages.mensagemErro(error.response.data);
            });
    }

    componentDidMount() {
        const params = this.props.match.params;
        
        if(params.id){
            this.service.obterPorId(params.id)
                    .then(response => {
                        this.setState( {...response.data, atualizando: true} )
                    }).catch(error => {
                        messages.mensagemErro(error.response.data);
                    });
        }
    }

    render() {
        const listaMeses = this.service.obterListaMeses();
        const listaTipos = this.service.obterListaTipos();

        return(
            <Card title={this.state.atualizando ? 'Atualização de Lançamento' : 'Cadastro de Lançamento'}>
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup htmlFor="inputDescricao" label="Descrição: *">
                            <input id="inputDescricao" name="descricao" type="text" className="form-control" onChange={this.handleChange} value={this.state.descricao} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <FormGroup htmlFor="inputAno" label="Ano: *">
                            <input id="inputAno" name="ano" type="text" className="form-control" onChange={this.handleChange} value={this.state.ano} />
                        </FormGroup>
                    </div>
                    <div className="col-md-6">
                        <FormGroup htmlFor="inputMes" label="Mês: *">
                            <SelectMenu id="inputMes" name="mes" lista={listaMeses} className="form-control" onChange={this.handleChange} value={this.state.mes} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <FormGroup htmlFor="inputValor" label="Valor: *">
                            <input id="inputValor" name="valor" type="text" className="form-control" onChange={this.handleChange} value={this.state.valor} />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup htmlFor="inputTipo" label="Tipo: *">
                            <SelectMenu id="inputTipo" name="tipo" lista={listaTipos} className="form-control" onChange={this.handleChange} value={this.state.tipoLancamento} />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup htmlFor="inputStatus" label="Status:" >
                            <input type="text" id="inputStatus" name="status" className="form-control" disabled value={this.state.statusLancamento} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        {
                            this.state.atualizando ? 
                            (
                                <button onClick={this.atualizar} className="btn btn-primary">Atualizar</button>
                            ):
                            (
                                <button onClick={this.submit} className="btn btn-success">Salvar</button>
                            )
                        }
                        <button onClick={e => this.props.history.push('/consulta-lancamentos')} className="btn btn-danger">Cancelar</button>
                    </div>
                </div>
            </Card>
        )
    }
}

export default withRouter(CadastroLancamentos);