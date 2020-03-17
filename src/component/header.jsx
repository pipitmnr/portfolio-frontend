import React, {Component} from 'react';
import "../assets/css/bootstrap.min.css";
import "../assets/css/main.css";
import { Link } from "react-router-dom";
import { actions, store } from "../store";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import axios from 'axios';

class Header extends Component{    
    logout = async() => {
        store.setState({username: ""});
        store.setState({password: ""});
        store.setState({nama_lengkap: ""});
        store.setState({email: ""});
        store.setState({no_hp: ""});
        store.setState({token: ""});
        store.setState({isLogin: false});
        store.setState({adminIsLogin: false});
        localStorage.setItem("token", "");
        localStorage.setItem("isLogin", false);
        localStorage.setItem("adminIsLogin", false);
    };
    
    axiosProduct = async(event) => {
        await axios
            .get(`https://hijub.my.id/product?id_kategori=${event}`)
            .then(function(response){
                store.setState({listProduct: response.data, isLoading: false, id_category: event});
            })
            .catch(function(error){
                store.setState({isLoading: false});
            });
        console.warn("ini dari axios product di category", this.props.listProduct, event)
    };    
    render(){
        return(
            <header style={{borderBottom: "1px solid #ececec", backgroundColor:"#fffeb3"}}>
                <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet"/>
                <div className="container-fluid">
                    <div className="row align-items-center py-4">
                        <div className="col-md-3">
                            <div className="logo">
                                <h3><Link to={`/`} style={{textDecoration:"none", fontWeight:"bold", color:"#574d5f"}}>
                                    HI JUB
                                </Link></h3>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="header-category">
                                <ul className="list-unstyled list-inline mb-0"> 
                                    {(localStorage.getItem('adminIsLogin')=="true") ?
                                        <React.Fragment>
                                            <li className="list-inline-item px-3">
                                                <Link to={`/admin-user`}>
                                                    User
                                                </Link>
                                            </li>
                                            <li className="list-inline-item px-3">
                                                <Link to={`/admin-category`}>
                                                    Category
                                                </Link>
                                            </li>
                                            <li className="list-inline-item px-3">
                                                <Link to={`/admin-product`}>
                                                    Product
                                                </Link>
                                            </li>
                                            <li className="list-inline-item px-3">
                                                <Link to={`/admin-cart`}>
                                                    Cart
                                                </Link>
                                            </li>
                                        </React.Fragment>
                                    :
                                        <React.Fragment>
                                            <li className="list-inline-item px-3" onClick={(event) => this.axiosProduct("1")}>
                                                <Link to={`/category/1`}>
                                                    Segi Empat
                                                </Link>
                                            </li>
                                            <li className="list-inline-item px-3" onClick={(event) => this.axiosProduct("2")}>
                                                <Link to={`/category/2`}>
                                                    Bergo
                                                </Link>
                                            </li>
                                            <li className="list-inline-item px-3" onClick={(event) => this.axiosProduct("3")}>
                                                <Link to={`/category/3`}>
                                                    Pashmina
                                                </Link>
                                            </li>
                                        </React.Fragment>
                                    }
                                </ul>
                            </div>                            
                        </div>
                        <div className="col-md-3">
                            <div className="header-auth">
                                <ul className="list-unstyled list-inline mb-0">
                                    {(localStorage.getItem('isLogin')=="true") | (localStorage.getItem('adminIsLogin')=="true") | ((this.props.isLogin==true) | (this.props.adminIsLogin==true)) ?
                                        (<React.Fragment>
                                            <li className="list-inline-item px-2">
                                                <Link to={`/cart`}><i className="fa fa-shopping-cart"></i></Link>
                                            </li>
                                            <li className="list-inline-item px-2">
                                                <Link to={`/profile`}><i className="fa fa-user"></i></Link>
                                            </li>
                                            <li className="list-inline-item px-2">
                                                <Link to="/checkout"> Pesanan</Link>
                                            </li>
                                            <li className="list-inline-item px-2" onClick={() => this.logout()}>
                                                <Link to="/"> Keluar</Link>
                                            </li>
                                            
                                        </React.Fragment>)
                                    :                                     
                                        (<li className="list-inline-item px-2">
                                            <Link to={`/login`}>Masuk</Link>
                                        </li>)
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

export default connect("category, isLogin, token, full_name, email, no_hp, id_category, isLoading, listProduct, adminIsLogin, listUser", actions)(withRouter(Header));
