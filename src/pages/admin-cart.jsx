import React from 'react';
import Header from "../component/header";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { actions, store } from "../store";
import axios from 'axios';
import { Link } from "react-router-dom";

class AdminCart extends React.Component{
    state = {
        listCart:[],
        isLoading:true,
        cart:{},
        "0": "Pesanan belum dicheckout.",
        "1": "Pesanan telah dicheckout.",
        "2": "Pesanan dikonfirmasi toko. Menunggu pembayaran.",
        "3": "Pembayaran telah dilakukan.",
        "4": "Pembayaran dikonfirmasi toko. Barang segera dipersiapkan.",
        "5": "Barang telah dikirim.",
    };
    getListCart = async() => {
        const self=this;
        const req = {
            method : "get",
            url : "https://hijub.my.id/cart/admin",
            headers : {
                Authorization: "Bearer " + localStorage.getItem('token'),
            },
        }  
        await axios(req)
            .then(function (response) {
                self.setState({listCart: response.data, isLoading: false});
            })
            .catch(function (error) {
                self.setState({isLoading: false});
            });
    };
    getCartById = async(event) => {
        const self = this;
        await axios
            .get(`https://hijub.my.id/cart/admin/${event}`)
            .then(function(response){
                self.setState({cart:response.data, isLoading: false});
            })
            .catch(function(error){
                self.setState({isLoading: false});
            });
    };
    konfirmasi = async(event) => {
        const self = this;
        const data = {
            "status": "2",
        };
        const req = {
            method : "put",
            url : `https://hijub.my.id/cart/admin/${event}`,
            headers : {
                Authorization: "Bearer " + localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            data : data
        };
        await axios(req)
            .then(function(response){
                self.props.history.push("/admin-cart");
                alert("Berhasil Konfirmasi Pesanan");
            })
            .catch(function(error){
                alert("Gagal Konfirmasi Pesanan");
                self.props.history.push("/admin-cart");
            });
            
    };
    konfirmasiPembayaran = async(event) => {
        const self = this;
        const data = {
            "status": "4",
        };
        const req = {
            method : "put",
            url : `https://hijub.my.id/cart/admin/${event}`,
            headers : {
                Authorization: "Bearer " + localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            data : data
        };
        await axios(req)
            .then(function(response){
                alert("Berhasil Konfirmasi Pembayaran");
                self.props.history.push("/admin-cart");
            })
            .catch(function(error){
                alert("Maaf Terjadi Kesalahan");
                self.props.history.push("/admin-cart");
            });
            
    };
    konfirmasiPengiriman = async(event) => {
        const self = this;
        const data = {
            "status": "5",
        };
        const req = {
            method : "put",
            url : `https://hijub.my.id/cart/admin/${event}`,
            headers : {
                Authorization: "Bearer " + localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            data : data
        };
        await axios(req)
            .then(function(response){
                alert("Berhasil Konfirmasi Pengiriman");
                self.props.history.push("/admin-cart");
            })
            .catch(function(error){
                alert("Maaf Terjadi Kesalahan");
                self.props.history.push("/admin-cart");
            });
            
    };
    componentDidMount = async() => {
        this.getListCart();
    };
    render(){
        const {listCart, isLoading} = this.state;
        const arrayCart = listCart.map((item, key) => {
            return(
                <tr className="table-admin">
                    <td>{item.id}</td>
                    <td>{item.id_user}</td>
                    <td>list product di cart</td>
                    <td>{item.alamat_lengkap}</td>
                    <td>{item.ongkir}</td>
                    <td>{item.total_harga}</td>
                    <td>{item.status}. {this.state[item.status]}</td>
                    <td>
                        <ul className="list-unstyled list-inline my-0">
                            <li>
                                {item.status=="1" ?
                                    <Link to={`/`}>
                                        <button className="btn-success" onClick={(event) => this.konfirmasi(`${item.id}`)}>
                                            Konfirmasi
                                        </button>
                                    </Link>
                                :
                                    item.status=="2" ?
                                        <div>Menunggu pembayaran . . .</div>
                                    :
                                        item.status=="3" ?
                                            <Link to={`/`}>
                                                <button className="btn-success" onClick={(event) => this.konfirmasiPembayaran(`${item.id}`)}>
                                                    Konfirmasi Pembayaran
                                                </button>
                                            </Link>
                                        :
                                            item.status=="4" ?
                                                <Link to={`/`}>
                                                    <button className="btn-success" onClick={(event) => this.konfirmasiPengiriman(`${item.id}`)}>
                                                        Konfirmasi Pengiriman
                                                    </button>
                                                </Link>
                                            :
                                                <div>Transaksi selesai</div>
                                }
                            </li>
                        </ul>
                    </td>
                </tr>
            );
        });
        return(
            <div>
                <Header/>
                <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet"/>
                <div className="container-fluid home-content">
                    <div className="isi-header"></div>
                    <div className="container">
                        <div className="row my-5">
                            <h3>Dashboard</h3>
                        </div>
                        <div className="row align-items-center">
                            <div className="col-md-12">
                                <h3>
                                    Table Cart
                                </h3>
                            </div>
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="page-item ml-auto mr-3 my-3">
                                    </div>
                                </div>                                
                            </div>
                            <div className="col-md-12">
                                <div className="table-responsive m-t-40">
                                    <table id="dtBasicExample" className="table table-striped table-bordered table-sm" cellspacing="0" width="100%">
                                        <thead className="table-info">
                                            <tr>
                                            <th className="th-sm">ID</th>
                                            <th className="th-sm">ID User</th>
                                            <th>List Barang</th>
                                            <th>Alamat Lengkap</th>
                                            <th>Ongkir</th>
                                            <th>Total Harga</th>
                                            <th>Status</th>
                                            <th className="th-sm">Aksi
                                            </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {arrayCart}
                                        </tbody>
                                        <tfoot className="table-info">
                                            <tr>
                                            <th className="th-sm">ID</th>
                                            <th className="th-sm">ID User</th>
                                            <th>List Barang</th>
                                            <th>Alamat Lengkap</th>
                                            <th>Ongkir</th>
                                            <th>Total Harga</th>
                                            <th>Status</th>
                                            <th>Aksi</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                    <div className="clearfix">
                                        <ul className="pagination">
                                            <li className="page-item">
                                                <Link className="page-link">
                                                    Previous
                                                </Link>
                                            </li>
                                            <li className="page-item">
                                                <Link className="page-link">
                                                    Next
                                                </Link>
                                            </li>
                                        </ul>
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
export default connect("", actions)(withRouter(AdminCart));