import React from 'react';
import Header from "../component/header";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { actions, store } from "../store";
import { Link } from "react-router-dom";
import axios from 'axios';

class Login extends React.Component{
    changeInput = e => {
        store.setState({ [e.target.name]: e.target.value });
    };
    postLogin = async() => {
        const self=this;
        const { username, password } = this.props;
        const data = {
            "username": username,
            "password": password
        };
        const req = {
            method : "post",
            url : "https://hijub.my.id/login",
            headers : {
                "Content-Type": "application/json"
            },
            data : data
        }
        
        await axios(req)
            .then(function (response) {
                if (response.data.token!=="") {
                    if(data.username=="admin" & data.password=="admin"){
                        store.setState({adminIsLogin: true});
                        store.setState({token: response.data.token});
                        localStorage.setItem("token", response.data.token);
                        localStorage.setItem("adminIsLogin", true);
                        alert("Admin Berhasil Masuk");
                        self.props.history.push("/admin-user/");
                    }
                    else{
                        store.setState({token: response.data.token});
                        store.setState({isLogin: true});
                        localStorage.setItem("token", response.data.token);
                        localStorage.setItem("isLogin", true);
                        self.props.history.push("/");
                        alert("Berhasil Masuk");
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
                alert("Gagal Masuk");
                self.props.history.push("/login");
            });
    };
    render(){
        return(
            <div>
                <Header categoryHijab={event => this.props.categoryHijab(event)} category={this.props.category} isLogin={this.props.isLogin}/>
                <div className="container-fluid home-content">
                    <div className="container py-5 mt-5">
                        <div className="row py-5 align-items-center">
                            <div className="col-md-1"></div>
                            <div className="col-md-4 pt-5 login-img">
                                <img src={require('../assets/image/login.jpg')} alt=""/>
                            </div>
                            <div className="col-md-1"></div>
                            <div className="col-md-1 pt-5"></div>
                            <div className="col-md-4 pt-5">
                                <div>
                                    <h3 style={{color:"#6405ad", fontWeight:"bold"}}>Login</h3>
                                </div>
                                <div className="login-card p-5">
                                    <form>
                                        <div className="form-group my-4" style={{textAlign:"left"}}>
                                            <label for="username" className="my-0">
                                                Username<span style={{color:"red"}}>*</span>
                                            </label>
                                            <input type="text" className="form-control" name="username" id="username" placeholder="Username" onChange={e => this.changeInput(e)} required/>
                                        </div>
                                        <div className="form-group my-4" style={{textAlign:"left"}}>
                                            <label for="password" className="my-0">
                                                Password<span style={{color:"red"}}>*</span>
                                            </label>
                                            <input type="password" className="form-control" name="password" id="password" placeholder="Password" onChange={e => this.changeInput(e)} required/>
                                        </div>
                                        <button type="submit" className="btn button-zooya-invers" onClick={() => this.postLogin()}><Link to="/">Masuk</Link></button>
                                    </form>
                                    <div className="link-signup pt-4">
                                        <p>Belum punya akun?</p>
                                        <p>Daftar <Link to={`/signup`}>di sini</Link></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect("username, password, token, isLogin, adminIsLogin", actions)(withRouter(Login));