import React from 'react';
import Header from "../component/header";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { actions, store } from "../store";
import axios from 'axios';
import { Link } from "react-router-dom";

class AdminUser extends React.Component{
    state = {
        listUser:[],
        isLoading:true,
    };
    getListUser = async() => {
        const self=this;
        const req = {
            method : "get",
            url : "https://hijub.my.id/admin/user",
            headers : {
                Authorization: "Bearer " + localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
        }  
        await axios(req)
            .then(function (response) {
                self.setState({listUser: response.data, isLoading: false});
            })
            .catch(function (error) {
                self.setState({isLoading: false});
            });
    };
    deleteUser = async(event) => {
        const self=this;
        const req = {
            method : "delete",
            url : `https://hijub.my.id/admin/user/${event}`,
            headers : {
                Authorization: "Bearer " + localStorage.getItem('token'),
            },
        }  
        await axios(req)
            .then(function (response) {
                self.setState({isLoading: false});
                self.props.history.push(`/admin-user`);
                alert("Berhasil Hapus User");
            })
            .catch(function (error) {
                self.setState({isLoading: false});
                self.props.history.push(`/admin-user`);
                alert("Gagal Hapus User");
            });
    };
    componentDidMount = async() => {
        this.getListUser();
    };
    render(){
        const {listUser, isLoading} = this.state;
        const arrayUser = listUser.map((item, key) => {
            return(
                <tr className="table-admin">
                    <td>{item.id}</td>
                    <td>{item.username}</td>
                    <td>{item.password}</td>
                    <td>{item.nama_lengkap}</td>
                    <td>{item.email}</td>
                    <td>{item.no_hp}</td>
                    <td>
                        <ul className="list-unstyled list-inline my-0">
                            <li className="admin-action-trash px-2 list-inline-item">
                                <Link to={`/`} onClick={(event) => this.deleteUser(`${item.id}`)}><i className="fa fa-trash"></i></Link>
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
                            <h3>Dashboard beranda</h3>
                        </div>
                        <div className="row align-items-center">
                            <div className="col-md-12">
                                <h3>
                                    Table User
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
                                            <th className="th-sm">ID
                                            </th>
                                            <th className="th-sm">Username
                                            </th>
                                            <th className="th-sm">Password
                                            </th>
                                            <th className="th-sm">Nama Lengkap
                                            </th>
                                            <th className="th-sm">Email
                                            </th>
                                            <th className="th-sm">No HP
                                            </th>
                                            <th className="th-sm">Aksi
                                            </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {arrayUser}
                                        </tbody>
                                        <tfoot className="table-info">
                                            <tr>
                                            <th>ID
                                            </th>
                                            <th>Username
                                            </th>
                                            <th>Password
                                            </th>
                                            <th>Nama Lengkap
                                            </th>
                                            <th>Email
                                            </th>
                                            <th>No HP
                                            </th>
                                            <th>Aksi
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
            </div>
        )
    }
}
export default connect("", actions)(withRouter(AdminUser));