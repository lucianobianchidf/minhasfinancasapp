import React from "react";
import {withRouter} from 'react-router-dom'
import Card from "../../components/card";
import FormGroup from "../../components/form-group";
import SelectMenu from "../../components/selectMenu";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button'
import LancamentosTable from "./lancamentosTable";
import LancamentoService from "../../app/service/lancamentoService";
import LocalStorageService from "../../app/service/localstorageService";
import * as messages from '../../components/toastr'
import lancamentosTable from "./lancamentosTable";

class ConsultaLancamentos extends React.Component{

    state = {
        ano: '',
        mes: '',
        tipo: '',
        showConfirmDialog: false,
        lancamentoDeletar: {},
        lancamentos: []
    }

    constructor(){
        super();
        this.service = new LancamentoService();
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamentos/${id}`)
    }

    abrirConfirmacao = (lancamento) => {
        this.setState({showConfirmDialog: true, lancamentoDeletar: lancamento})
    }
    
    cancelarDelecao = () => {
        this.setState({showConfirmDialog: false, lancamentoDeletar: {} })
    }

    alterarStatus = (lancamento, status) => {
        this.service.alterarStatus(lancamento.id, status)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(lancamento);

                if(index !== -1){
                    lancamento['status'] = status;
                    lancamentos[index] = lancamento;
                    this.setState({lancamento});
                }

                messages.mensagemSucesso("Status atualizado com sucesso");
            });
    }

    deletar = () => {
        this.service.deletar(this.state.lancamentoDeletar.id)
        .then( response => {
            const lancamentos = this.state.lancamentos;
            const index = lancamentos.indexOf(this.state.lancamentoDeletar);
            lancamentos.splice(index, 1);
            this.setState( {lancamentos: lancamentos, showConfirmDialog: false} );
            messages.mensagemSucesso('Lançamento deletado com sucesso');
        }).catch( error => {
            messages.mensagemErro('Ocorreu um erro ao deletar o lançamento');
        });
    }

    buscar = () => {
        if (!this.state.ano){
            messages.mensagemAlerta('O preenchimento do ano é obrigatório')
            return false;
        }

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            usuario: usuarioLogado.id
        }

        this.service
            .consultar(lancamentoFiltro)
            .then( resposta => {
                const lista = resposta.data;

                if(lista.length < 1){
                    messages.mensagemAlerta("Nenhum resultado encontrado");
                }

                this.setState({ lancamentos: lista })
            }).catch( error => {
                console.log(error)
            })
    }

    render(){
        const meses = this.service.obterListaMeses();
        const tipos = this.service.obterListaTipos();

        const confirmDialogFooter = (
            <div>
                <Button label="Sim" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Não" icon="pi pi-times" onClick={this.cancelarDelecao} />
            </div>
        );

        return(
            <Card title="Consulta de lançamentos">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="bs-component">
                            <FormGroup label="Ano: *" htmlFor="inputAno">
                                <input type="text" className="form-control" id="inputAno" aria-describedby="anoHelp" 
                                    value={this.state.ano}
                                    onChange={e => this.setState({ano: e.target.value})}
                                    placeholder="Digite o Ano" />
                            </FormGroup>
                            <FormGroup label="Mês:" htmlFor="inputMes">
                                <SelectMenu id="inputMes" className="form-control" lista={meses} 
                                    value={this.state.mes}
                                    onChange={e => this.setState({mes: e.target.value})} />
                            </FormGroup>
                            <FormGroup label="Tipo:" htmlFor="inputTipo">
                                <SelectMenu id="inputTipo" className="form-control" lista={tipos} 
                                    value={this.state.tipo}
                                    onChange={e => this.setState({tipo: e.target.value})} />
                            </FormGroup>

                            <button type="button" onClick={this.buscar} className="btn btn-success">Buscar</button>
                            <button type="button" className="btn btn-danger">Cancelar</button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="bs-component">
                            <LancamentosTable lancamentos={this.state.lancamentos} deletar={this.abrirConfirmacao} editar={this.editar} alterarStatus={this.alterarStatus} />
                        </div>
                    </div>
                </div>
                <div>
                <Dialog header="Header" 
                    visible={this.state.showConfirmDialog} 
                    style={{ width: '50vw' }}  
                    modal={true}
                    footer={confirmDialogFooter}
                    onHide={() => this.setState({showConfirmDialog: false})}>
                    Confirma a exclusão desse lançamento?
                </Dialog>
                </div>
            </Card>
        )
    }
}

export default withRouter(ConsultaLancamentos);