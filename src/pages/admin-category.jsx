import React from 'react';
import Header from "../component/header";
import { withRouter } from "react-router-dom";
import { connect } from "unistore/react";
import { actions, store } from "../store";
import axios from 'axios';
import { Link } from "react-router-dom";

class AdminCategory extends React.Component{
    state = {
        listCategory:[],
        isLoading:true,
    };
    getListCategory = async() => {
        const self=this;
        const req = {
            method : "get",
            url : "https://hijub.my.id/category",
            headers : {
                "Content-Type": "application/json"
            },
        }  
        await axios(req)
            .then(function (response) {
                self.setState({listCategory: response.data, isLoading: false});
            })
            .catch(function (error) {
                self.setState({isLoading: false});
            });
    };
    componentDidMount = async() => {
        this.getListCategory();
    };
    render(){
        const {listCategory, isLoading} = this.state;
        const arrayCategory = listCategory.map((item, key) => {
            return(
                <tr className="table-admin">
                    <td>{item.id}</td>
                    <td>{item.nama}</td>
                    <td>
                        <ul className="list-unstyled list-inline my-0">
                            <li className="admin-action-edit px-2 list-inline-item">
                                <Link to={`/`}><i className="fa fa-edit"></i></Link>
                            </li>
                            <li className="admin-action-trash px-2 list-inline-item">
                                <Link to={`/`}><i className="fa fa-trash"></i></Link>
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
                                    Table Category
                                </h3>
                            </div>
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="page-item ml-auto mr-3 my-3">
                                        <Link className="page-link tambah-data">
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
                                            <th className="th-sm">Nama
                                            </th>
                                            <th className="th-sm">Aksi
                                            </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {arrayCategory}
                                        </tbody>
                                        <tfoot className="table-info">
                                            <tr>
                                            <th>ID
                                            </th>
                                            <th>Nama
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
export default connect("", actions)(withRouter(AdminCategory));