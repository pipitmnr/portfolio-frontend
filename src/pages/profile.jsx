import React from 'react';
import Header from "../component/header";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { actions, store } from "../store";
import axios from 'axios';
// import { Link } from "react-router-dom";

class Profile extends React.Component{
    axiosUser = async() => {
        let urlfix = "";
        if (this.props.adminIsLogin === true) {
            urlfix = "https://hijub.my.id/admin/user";
        }
        else {
            urlfix = "https://hijub.my.id/user";
        }
        const req = {
            method : "get",
            url : urlfix,
            headers : {
                Authorization: "Bearer " + localStorage.getItem('token')
            },
        }
        await axios(req)
            .then(function(response){
                if (this.props.adminIsLogin === false){
                    store.setState({nama_lengkap: response.data.nama_lengkap,
                        email: response.data.email,
                        no_hp: response.data.no_hp,
                        isLoading: false});
                }
                else{
                    store.setState({listUser: response.data,
                        isLoading: false})
                }
            })
            .catch(function(error){
                store.setState({isLoading: false});
            });
    };
    componentDidMount = () => {
        this.axiosUser();
    }
    render(){
        console.warn("ini dari profile", this.props)
        return(
            <div>
                <Header/>
                <div className="container-fluid home-content">
                    <div className="container py-5 mt-5">
                        <div className="row py-5 align-items-center">
                            <div className="col-md-2"></div>
                            <div className="col-md-8">
                                <div className="login-card p-5">
                                    <div className="row align-items-center pb-4">
                                        <div className="col-md-4"></div>
                                        <div className="col-md-4 profile-img">
                                            <img src="https://image.flaticon.com/icons/png/512/1499/1499575.png" alt=""/>
                                        </div>
                                    </div>
                                    <div className="row align-items-center pt-4">
                                        <div className="col-md-5">
                                            <p>Nama Lengkap</p>
                                            <p>Email</p>
                                            <p>No HP</p>
                                            <p>Username</p>
                                        </div>
                                        <div className="col-md-2">
                                            <p>:</p>
                                            <p>:</p>
                                            <p>:</p>
                                            <p>:</p>
                                            <p>:</p>
                                        </div>
                                        <div className="col-md-5">
                                            <p>{this.props.nama_lengkap}</p>
                                            <p>{this.props.email}</p>
                                            <p>{this.props.no_hp}</p>
                                            <p>{this.props.username}</p>
                                        </div>
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
export default connect("category, username, password, isLoading, isLogin, nama_lengkap, no_hp, email", actions)(withRouter(Profile));