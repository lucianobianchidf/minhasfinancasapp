import React from "react";
import Card from "../../components/card";
import FormGroup from "../../components/form-group";
import SelectMenu from "../../components/selectMenu";
import { withRouter } from 'react-router-dom'

import LancamentoService from "../../app/service/lancamentoService";

class CadastroLancamentos extends React.Component {

    state = {
        id: null,
        descricao: '',
        ano: '',
        mes: '',
        valor: 0,
        tipo: ''
    }

    constructor(){
        super();
        this.service = new LancamentoService();
    }

    render() {
        const listaMeses = this.service.obterListaMeses();
        const listaTipos = this.service.obterListaTipos();

        return(
            <Card title="Cadastro de Lançamentos">
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup htmlFor="inputDescricao" label="Descrição: *">
                            <input id="inputDescricao" type="text" className="form-control" />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <FormGroup htmlFor="inputAno" label="Ano: *">
                            <input id="inputAno" type="text" className="form-control" />
                        </FormGroup>
                    </div>
                    <div className="col-md-6">
                        <FormGroup htmlFor="inputMes" label="Mês: *">
                            <SelectMenu id="inputMes" lista={listaMeses} className="form-control" />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <FormGroup htmlFor="inputValor" label="Valor: *">
                            <input id="inputValor" type="text" className="form-control" />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup htmlFor="inputTipo" label="Tipo: *">
                            <SelectMenu id="inputTipo" lista={listaTipos} className="form-control" />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup htmlFor="inputStatus" label="Status:">
                            <input type="text" className="form-control" disabled />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <button className="btn btn-success">Salvar</button>
                        <button className="btn btn-danger">Cancelar</button>
                    </div>
                </div>
            </Card>
        )
    }
}

export default withRouter(CadastroLancamentos);