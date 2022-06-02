import React from 'react'
import Card from '../components/card'
import FormGroup from '../components/form-group'
import UsuarioService from '../app/service/usuarioService'
import LocalStorageService from '../app/service/localstorageService'
import {withRouter} from 'react-router-dom'
import {mensagemErro} from '../components/toastr'
import { AuthContext } from '../main/provedorAutenticacao'

class Login extends React.Component {

    state = {
        email: '',
        senha: ''
    }

    constructor() {
        super();
        this.service = new UsuarioService();
    }

    entrar = () => {
        this.service.autenticar({
            email: this.state.email,
            senha: this.state.senha
        })
        .then( response => {
            this.context.iniciarSessao(response.data);
            this.props.history.push({pathname: '/home'})
        } ).catch( erro => {
            mensagemErro(erro.response.data);
        } )
    }

    nextPath(path) {
        this.props.history.push(path);
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-6" style={ {position: 'relative', left: '300px'} } >
                    <div className="bs-docs-section">
                        <Card title="Login">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="bs-component">
                                        <fieldset>
                                            <FormGroup label="Emaill: *" htmlFor="exampleInputEmail1">
                                                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" 
                                                    value={this.state.email} onChange={e => this.setState({email: e.target.value})}
                                                    placeholder="Digite o Email" />
                                            </FormGroup>                                            
                                            <FormGroup label="Senha: *" htmlFor="exampleInputPassword1">
                                                <input type="password" className="form-control" id="exampleInputPassword1" 
                                                    value={this.state.senha} onChange={e => this.setState({senha: e.target.value})}
                                                    placeholder="Password" />
                                            </FormGroup>                        

                                            <button onClick={this.entrar} className="btn btn-success">Entrar</button>
                                            <button onClick={() => this.nextPath('/cadastro-usuarios')} className="btn btn-danger">Cadastrar</button>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

}

Login.contextType = AuthContext

export default withRouter(Login)