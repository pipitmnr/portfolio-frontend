import React from 'react';
import Header from "../component/header";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { actions, store } from "../store";
import { Link } from "react-router-dom";
import axios from 'axios';

class Signup extends React.Component{
    changeInput = e => {
        console.warn("ini fungsi changeinput", e.target.name, e.target.value)
        store.setState({ [e.target.name]: e.target.value });
    };
    postSignup = async() => {
        const self = this;
        const { username, password, nama_lengkap, email, no_hp } = this.props;
        const data = {
            "username": username,
            "password": password,
            "nama_lengkap": nama_lengkap,
            "email": email,
            "no_hp": no_hp
        };
        const req = {
            method : "post",
            url : "https://hijub.my.id/signup",
            headers : {
                "Content-Type": "application/json"
            },
            data : data
        };
        await axios(req)
            .then(function(response){
                self.props.history.push("/login");
                alert("Berhasil Daftar");
            })
            .catch(function(error){
                alert("Gagal Daftar");
                self.props.history.push("/signup");
            });
            
    };
    render(){
        return(
            <div>
                <Header categoryHijab={event => this.props.categoryHijab(event)} category={this.props.category}/>
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
                                    <h3 style={{color:"#6405ad", fontWeight:"bold"}}>Sign Up</h3>
                                </div>
                                <div className="login-card p-5">
                                    <form>
                                        <div className="form-group my-4" style={{textAlign:"left"}}>
                                            <label for="nama_lengkap" className="my-0">
                                                Nama Lengkap<span style={{color:"red"}}>*</span>
                                            </label>
                                            <input type="text" className="form-control" name="nama_lengkap" id="nama_lengkap" placeholder="Nama Lengkap" onChange={e => this.changeInput(e)} required/>
                                        </div>
                                        <div className="form-group my-4" style={{textAlign:"left"}}>
                                            <label for="email" className="my-0">
                                                Email<span style={{color:"red"}}>*</span>
                                            </label>
                                            <input type="email" className="form-control" name="email" id="email" placeholder="Email" onChange={e => this.changeInput(e)} required/>
                                        </div>
                                        <div className="form-group my-4" style={{textAlign:"left"}}>
                                            <label for="no_hp" className="my-0">
                                                No HP<span style={{color:"red"}}>*</span>
                                            </label>
                                            <input type="text" className="form-control" name="no_hp" id="no_hp" placeholder="No HP" onChange={e => this.changeInput(e)} required/>
                                        </div>
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
                                        <button type="submit" className="btn button-zooya-invers" onClick={() => this.postSignup()}><Link to="/login">Daftar</Link></button>
                                    </form>
                                    <div className="link-signup pt-4">
                                        <p>Sudah punya akun?</p>
                                        <p>Masuk <Link to={`/login`}>di sini</Link></p>
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
export default connect("username, password, email, no_hp, nama_lengkap", actions)(withRouter(Signup));