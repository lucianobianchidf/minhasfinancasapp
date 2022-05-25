import React from "react";
import {withRouter} from 'react-router-dom'
import Card from "../../components/card";
import FormGroup from "../../components/form-group";
import SelectMenu from "../../components/selectMenu";
import LancamentosTable from "./lancamentosTable";
import LancamentoService from "../../app/service/lancamentoService";
import LocalStorageService from "../../app/service/localstorageService";

class ConsultaLancamentos extends React.Component{

    state = {
        ano: '',
        mes: '',
        tipo: '',
        lancamentos: []

    }

    constructor(){
        super();
        this.service = new LancamentoService();
    }

    buscar = () => {
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            usuario: usuarioLogado.id
        }

        this.service.consultar(lancamentoFiltro)
            .then( response => {
                this.setState({ lancamentos: response.data });
            }).catch(error => {
                console.log(error);
            });
    }

    render(){
        const meses = [
            {label: 'Selecione', value: ''},
            {label: 'Janeiro', value: 1},
            {label: 'Fevereiro', value: 2},
            {label: 'Março', value: 3},
            {label: 'Abril', value: 4},
            {label: 'Maio', value: 5},
            {label: 'Junho', value: 6},
            {label: 'Julho', value: 7},
            {label: 'Agosto', value: 8},
            {label: 'Setembro', value: 9},
            {label: 'Outubro', value: 10},
            {label: 'Novembro', value: 11},
            {label: 'Dezembro', value: 12}
        ]

        const tipos = [
            {label: 'Selecione', value: ''},
            {label: 'Receita', value: 'DESPESA'},
            {label: 'Despesa', value: 'RECEITA'}
        ]

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
                            <LancamentosTable lancamentos={this.state.lancamentos} />
                        </div>
                    </div>
                </div>
            </Card>
        )
    }
}

export default withRouter(ConsultaLancamentos);