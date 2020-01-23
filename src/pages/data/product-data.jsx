import React, { Component } from "react";
import { actions, store } from "../../store";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { Link } from "react-router-dom";
import axios from 'axios';
class ProductData extends Component{
    changeInput = e => {
        console.warn("INI DARI FUNGSI CHANGEINPUT", e.target.value, e.target.name);
        store.setState({ [e.target.name]: e.target.value });
    };
    postCartDetail = async() => {
        const self = this;
        const { id_cart, jumlah_item } = this.props;
        const data = {
            "id_cart": id_cart,
            "jumlah_item": jumlah_item,
            "id_product": this.props.product.id
        };
        const req = {
            method : "post",
            url : "https://hijub.my.id/cartdetail",
            headers : {
                Authorization: "Bearer " + localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            data : data
        }
        await axios(req)
            .then(function(response){
                alert("Berhasil Tambah Barang");
                self.props.history.push("/cart");
            })
            .catch(function(error){
                alert("Gagal Tambah Barang");
            });
    };
    render(){
        return(
            <React.Fragment>
                <div className="container py-5 mt-5">
                    <div className="row py-5">
                        <div className="col-md-6 pt-5">
                            <div className="detail-product-img">
                                <img src={this.props.product.gambar} alt=""/>
                            </div>
                        </div>
                        <div className="col-md-6 pt-5">
                            <div className="row align-items-center">
                                <div className="col-md-12 detail-product px-5">
                                    <h3 style={{color:"#6405ad"}}>{this.props.product.nama}</h3>
                                    <h5 style={{color:"#574d5f"}}>Rp.{this.props.product.harga}</h5>
                                    <div className="detail-product-deskripsi my-3">
                                        <p>Deskripsi:</p>
                                        <p>{this.props.product.deskripsi}</p>
                                    </div>
                                    <div className="detail-product-keterangan my-3">
                                        <p>Keterangan:</p>
                                        <p>{this.props.product.keterangan}</p>
                                    </div>
                                </div>
                                <div className="col-md-2"></div>
                                <div className="col-md-8 py-5">
                                    {localStorage.getItem('isLogin')==="true" ?
                                        <form>
                                            <div className="form-group my-4 text-center" style={{textAlign:"left"}}>
                                                <label for="id_cart" className="my-0">
                                                    <p style={{color:"#6405ad"}}>Masukkan ID Keranjang</p>
                                                </label>
                                                <input type="text" className="form-control" name="id_cart" id="id_cart" placeholder="Contoh: 1" onChange={e => this.changeInput(e)} required/>
                                            </div>
                                            <div className="form-group my-4 text-center" style={{textAlign:"left"}}>
                                                <label for="jumlah_item" className="my-0">
                                                    <p style={{color:"#6405ad"}}>Jumlah</p>
                                                </label>
                                                <input type="number" className="form-control" name="jumlah_item" id="jumlah_item" placeholder="Masukkan jumlah item" onChange={e => this.changeInput(e)} required/>
                                            </div>
                                            <button type="button" className="btn button-zooya" onClick={() => this.postCartDetail()}><Link to="/">Masukkan Ke Keranjang</Link></button>
                                        </form>:
                                        <div></div>
                                    }
                                    {/* <button type="button" className="btn button-zooya">Masukkan Ke Keranjang</button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
export default connect("product, isLoading, id_product, id_cart, jumlah_item", actions)(withRouter(ProductData));