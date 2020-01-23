import React from 'react';
import Header from "../component/header";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { actions, store } from "../store";
import axios from 'axios';
import { Link } from "react-router-dom";

class AdminProduct extends React.Component{
    state = {
        listProduct:[],
        isLoading:true,
        product:{},
    };
    getListProduct = async() => {
        const self=this;
        const req = {
            method : "get",
            url : "https://hijub.my.id/product",
            headers : {
                "Content-Type": "application/json"
            },
        }  
        await axios(req)
            .then(function (response) {
                self.setState({listProduct: response.data, isLoading: false});
            })
            .catch(function (error) {
                self.setState({isLoading: false});
            });
    };
    getProductById = async(event) => {
        const self = this;
        await axios
            .get(`https://hijub.my.id/product/${event}`)
            .then(function(response){
                self.setState({product:response.data, isLoading: false});
            })
            .catch(function(error){
                self.setState({isLoading: false});
            });
    };
    deleteProduct = async(event) => {
        const self=this;
        const req = {
            method : "delete",
            url : `https://hijub.my.id/product/${event}`,
            headers : {
                Authorization: "Bearer " + localStorage.getItem('token'),
            },
        }  
        await axios(req)
            .then(function (response) {
                self.setState({isLoading: false});
                self.props.history.push(`/admin-product`);
                alert("Berhasil Hapus Hijab");
            })
            .catch(function (error) {
                self.setState({isLoading: false});
                self.props.history.push(`/admin-product`);
                alert("Gagal Hapus Hijab");
            });
    };
    componentDidMount = async() => {
        this.getListProduct();
    };
    render(){
        const {listProduct, isLoading} = this.state;
        const arrayProduct = listProduct.map((item, key) => {
            return(
                <tr className="table-admin">
                    <td>{item.id}</td>
                    <td>{item.id_kategori}</td>
                    <td>{item.nama}</td>
                    <td>{item.harga}</td>
                    <td>{item.deskripsi}</td>
                    <td>{item.keterangan}</td>
                    <td><img src={item.gambar} alt="" style={{width:"120px", height:"120px"}}/></td>
                    <td>
                        <ul className="list-unstyled list-inline my-0">
                            <li className="admin-action-edit px-2 list-inline-item">
                                <Link to={{
                                    pathname: `/form-product`,
                                    state: {
                                        id_product : item.id,
                                    }
                                    }}><i className="fa fa-edit"></i>
                                </Link>
                            </li>
                            <li className="admin-action-trash px-2 list-inline-item">
                                <Link to={`/`} onClick={(event) => this.deleteProduct(`${item.id}`)}><i className="fa fa-trash"></i></Link>
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
                                    Table Product
                                </h3>
                            </div>
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="page-item ml-auto mr-3 my-3">
                                        <Link to="/form-product" className="page-link tambah-data">
                                            Tambah Data
                                        </Link>
                                    </div>
                                </div>                                
                            </div>
                            <div className="col-md-12">
                                <div className="table-responsive m-t-40">
                                    <table id="dtBasicExample" className="table table-striped table-bordered table-sm" cellspacing="0" width="100%">
                                        <thead className="table-info">
                                            <tr>
                                            <th className="th-sm">ID
                                            </th>
                                            <th className="th-sm">ID Kategori
                                            </th>
                                            <th>Nama</th>
                                            <th>Harga</th>
                                            <th>Deskripsi</th>
                                            <th>Keterangan</th>
                                            <th>Gambar</th>
                                            <th className="th-sm">Aksi
                                            </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {arrayProduct}
                                        </tbody>
                                        <tfoot className="table-info">
                                            <tr>
                                            <th width="2%">ID
                                            </th>
                                            <th width="5%">ID Kategori
                                            </th>
                                            <th width="10%">Nama</th>
                                            <th width="5%">Harga</th>
                                            <th width="30%">Deskripsi</th>
                                            <th width="15%">Keterangan</th>
                                            <th>Gambar</th>
                                            <th width="10%">Aksi
                                            </th>
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
                <script>
                    {/* $(document).ready(function () {
                        $('#dtBasicExample').DataTable();
                        $('.dataTables_length').addClass('bs-select');
                    }); */}
                </script>
            </div>
        )
    }
}
export default connect("", actions)(withRouter(AdminProduct));