import React from "react";
import Card from "../components/card";
import FormGroup from "../components/form-group";
import UsuarioService from "../app/service/usuarioService";
import {mensagemErro, mensagemSucesso} from '../components/toastr';
import {withRouter} from 'react-router-dom';

class CadastroUsuario extends React.Component{

    state = {
        nome: '',
        email: '',
        senha: '',
        senhaRepeticao: ''
    }

    constructor(){
        super();
        this.service = new UsuarioService();
    }

    cadastrar = () => {
        const msgs = this.validar();

        if (msgs && msgs.length > 0){
            msgs.forEach( (msg, index) => {
                mensagemErro(msg);
            });

            return false;
        }

        const usuario = {
            nome: this.state.nome,
            email: this.state.email,
            senha: this.state.senha
        }

        this.service.salvar(usuario)
            .then(response => {
                mensagemSucesso('Usuário cadastrado com sucesso');
                this.props.history.push('/login');
            }).catch(erro => {
                mensagemErro(erro.response.data);
            })
    }

    validar(){
        const msgs = [];

        if (!this.state.nome)
            msgs.push('O campo nome é obrigatório');

        if (!this.state.email) {
            msgs.push('O campo email é obrigatório');
        } else if (!this.state.email.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]/)){
            msgs.push('Informe um email válido')
        }

        if (!this.state.senha || !this.state.senhaRepeticao)
            msgs.push('Digite a senha duas vezes');
        else if(this.state.senha !== this.state.senhaRepeticao){
            msgs.push('As senhas não batem');
        }

        return msgs;
    }

    render(){
        return(
            <Card title="Cadastro de Usuário">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="bs-component">
                            <FormGroup label="Nome: *" htmlFor="inputNome">
                                <input type="text" id="inputNome" placeholder="Digite o Nome" className="form-control"
                                    onChange={e => this.setState({nome: e.target.value})} />
                            </FormGroup>
                            <FormGroup label="Email: *" htmlFor="inputEmail">
                                <input type="email" id="inputEmail" placeholder="Digite o Email" className="form-control"
                                    onChange={e => this.setState({email: e.target.value})} />
                            </FormGroup>
                            <FormGroup label="Senha: *" htmlFor="inputSenha">
                                <input type="password" id="inputSenha" placeholder="Digite a Senha" className="form-control"
                                    onChange={e => this.setState({senha: e.target.value})} />
                            </FormGroup>
                            <FormGroup label="Repita a Senha: *" htmlFor="inputRepitaSenha">
                                <input type="password" id="inputRepitaSenha" placeholder="Digite a Senha novamente" className="form-control"
                                    onChange={e => this.setState({senhaRepeticao: e.target.value})} />
                            </FormGroup>

                            <button type="button" onClick={this.cadastrar} className="btn btn-success">Salvar</button>
                            <button type="button" className="btn btn-danger">Cancelar</button>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }

}

export default withRouter(CadastroUsuario)