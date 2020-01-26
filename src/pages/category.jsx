import React from 'react';
import Header from "../component/header";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { actions, store } from "../store";
import { Link } from "react-router-dom";
import axios from 'axios';
import CategoryData from './data/category-data';

class Category extends React.Component{
    axiosProductAwal = async() => {
        const id_category = this.props.match.params.id_category;
        await axios
            .get(`https://hijub.my.id/product?id_kategori=${id_category}`)
            .then(function(response){
                store.setState({listProduct: response.data, isLoading: false});
                store.setState({id_category:id_category});
            })
            .catch(function(error){
                store.setState({isLoading: false});
            });
    }
    componentDidMount = () => {
        this.axiosProductAwal();
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
    };
    changeInput = e => {
        store.setState({ [e.target.name]: e.target.value });
    };
    postCart = async() => {
        const self = this;
        const { alamatLengkap } = this.props;
        const data = {
            "alamat_lengkap": alamatLengkap
        };
        const req = {
            method : "post",
            url : "https://hijub.my.id/cart",
            headers : {
                Authorization: "Bearer " + localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            data : data
        }
        await axios(req)
            .then(function(response){
                self.props.history.push("/cart");
            })
            .catch(function(error){
            });
    };
    render(){
        console.warn("ini bawah")
        return(
            <div>
                <Header/>
                <div className="container-fluid home-content">
                    <div className="container py-5 mt-5">
                        <div className="row align-items-center pt-5">
                            <div className="col-md-12 category-judul pt-5">
                                <h3 style={{color:"#6405ad", fontWeight:"bold"}}>Kategori {this.props.id_category}</h3>
                            </div>
                        </div>
                        <div className="row align-items-center py-3">
                            <div className="col-md-9"></div>
                            <div className="col-md-3">
                                {/* <p className="my-0" style={{color:"#6405ad"}}>Ambil Keranjangmu Sebelum Order!</p> */}
                                {localStorage.getItem('isLogin')==="true" ?
                                    <form>
                                        <div className="form-group my-4 text-center" style={{textAlign:"left"}}>
                                            <label for="alamatLengkap" className="my-0">
                                                <p style={{color:"#6405ad"}}>Alamat Lengkap</p>
                                            </label>
                                            <input type="text" className="form-control" name="alamatLengkap" id="alamatLengkap" placeholder="Masukkan alamat" onChange={e => this.changeInput(e)} required/>
                                        </div>
                                        <button type="button" className="btn button-zooya" onClick={() => this.postCart()}><Link to="/">+ Keranjang</Link></button>
                                    </form>:
                                    <div>
                                        
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="row align-items-center home-category">
                            <CategoryData {...this.props} listProduct = {this.props.listProduct} isLoading={this.props.isLoading}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect("category, listProduct, isLoading, id_category, alamatLengkap, adminIsLogin", actions)(withRouter(Category));