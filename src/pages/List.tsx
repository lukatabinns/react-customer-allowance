import React, { Component } from 'react';
import {Spinner} from '../util/Spinner';
import {Table} from '../util/Table';
import Modal from '../util/GenModal';
import { useLocation, useParams } from "react-router-dom";
import {ApiService} from '../services/ApiService';
import {Button, GlobalStyles, Box, Panel, H1} from '@bigcommerce/big-design';
import {Link, Navigate} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class List extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            isAllowanceLoading: false,
            showModal:false,
            redirect:false,
            allCustomers:null,
            id:0,
            allAllowances:[],
            editAllowance:false,
            editId:0,
            editName:null,
            editCreditValue:null,
            editDayNumber:null,
            editActive:null,
            editBcCustomerId:0,
            editStoreId:0
        };
    }

    componentDidMount() {
        this.loadAllowances();
        this.showMsg();
    }

    handleModal = (id: number) => this.setState({showModal:!this.state.showModal, id:id});

    tableHeaders = [
        {
            header: 'Name',
            hash: 'name',
            render: ({ name }: {name: string}) => name
        },
        {
            header: 'Email',
            hash: 'email',
            render: ({ email }: {email: string}) => email
        },
        {
            header: 'Credit value',
            hash: 'credit_value',
            render: ({ credit_value }: {credit_value: number}) => credit_value,
        },
        {
            header: 'Day number',
            hash: 'day_number',
            render: ({ day_number }: {day_number: number}) => day_number,
        },
        {
            header: 'Active',
            hash: 'active',
            render: ({ active }: {active: boolean}) => active,
        },
        {
            header: "Options",
            hash: 'options',
            render: (data: any) => {
                    return (
                        <>
                            <GlobalStyles />
                            <span>
                                <Button type="button" actionType="normal" onClick={(e) => this.editAllowance(data.id, data.bc_customer_id, data.name, data.credit_value, data.day_number, data.active)}>Edit</Button>
                                <Button type="button" actionType="destructive" onClick={() => this.handleModal(data.id)}>Delete</Button>
                            </span>
                        </>
                    );
            },
        },
    ];

    showMsg = () => {
        const submitted = sessionStorage.getItem('isSubmitted');
        if(submitted === "created"){
            toast("customer ambassador allowance created");
            setTimeout(() => {sessionStorage.setItem('isSubmitted', "false")}, 2000);
        }else if(submitted === "updated"){
            toast("customer ambassador allowance updated");
            setTimeout(() => {sessionStorage.setItem('isSubmitted', "false")}, 2000);
        }
    }

    loadAllowances = () => {
        ApiService.allCustomerAllowances().then(response => {
            if(response.status === 200) {
                let allowance = response.data.data;
                let bcStoreId = response.data.bc_store_id;

                this.getAllCustomers(allowance, bcStoreId);
            }
        }).catch((error) => {
            console.log(error.response.data);
        });
    }

    getAllCustomers = (allowance: any, bcStoreId: number) => {
        ApiService.getCustomers().then(response => {
            if(response.data.success) {

                let allCustomers = response.data.data;
                let createAllowance = {};

                for(let i = 0; i < allCustomers.length; i++){
                    for(let a = 0; a < allowance.length; a++) {
                        if (allCustomers[i].id === allowance[a].bc_customer_id) {
                            createAllowance = {name:allCustomers[i].first_name+" "+allCustomers[i].last_name,
                                email:allCustomers[i].email,
                                credit_value:'£'+allowance[a].credit_value,
                                day_number:allowance[a].day_number,
                                active:allowance[a].active,
                                bc_customer_id:allowance[a].bc_customer_id,
                                id:allowance[a].id};
                            this.state.allAllowances.push(createAllowance);
                        }
                    }
                }

                this.setState({
                    isAllowanceLoading:true,
                    editStoreId: bcStoreId,
                });
            }else{
                toast(response.data.message);
            }
        }).catch((error) => {
            this.setState({
                errorMsg: "No customers found",
            });
        });
    }

    hasAllowances() {
        return (this.state.allAllowances.length > 0);
    }

    editAllowance(id: string, bcId: number, name: string, creditVal: number, dayNum: number, active: boolean){
        this.setState({
            editAllowance: true,
            editId:id,
            editBcCustomerId:bcId,
            editName:name,
            editCreditValue:creditVal,
            editDayNumber:dayNum,
            editActive:active
        });

        sessionStorage.setItem('id', id);
    }

    deleteAllowance = (id: number) => {
        this.setState({showModal:false, isAllowanceLoading:false, allAllowances:[]});
        ApiService.deleteCustomerAllowance(id).then(response => {
            if(response.data.success === "customer allowance deleted") {
                this.loadAllowances();
                toast("customer ambassador allowance deleted");
            }else{
                this.setState({showModal:false});
                toast("Whoops!! customer ambassador allowance not deleted. Try later");
            }
        }).catch((error) => {
            this.setState({showModal:false});
            toast("Whoops!! customer ambassador allowance not deleted. Try later");
            console.log(error.response);
        });
    }

    renderRedirect = () => {
        this.setState({
            redirect: true,
        });
    }

    render() {

        return (
            <>
                <ToastContainer />
                {(this.state.editAllowance)?<Navigate to={`/allowance/${this.state.editId}`}
                                                      state={{bcId:this.state.editBcCustomerId,
                                                          bcStoreId:this.state.editStoreId,
                                                          name:this.state.editName,
                                                          creditVal:this.state.editCreditValue,
                                                          dayNum:this.state.editDayNumber, active:this.state.editActive}} />:null}
                {(this.state.redirect)?<Navigate to='/allowance/add' />:
                (!this.state.isAllowanceLoading)?<Spinner/>:
                <Box backgroundColor="secondary20" padding="xxLarge" className="box-top">
                    <div>
                        <div className="row">
                        <div className="col-10 Heading1"><H1>Ambassadors Allowance</H1></div>
                        <div className="col-2 float-end btn-add-rule">
                            <Button type="button" onClick={this.renderRedirect} className="btn btn-danger">
                                Add Rule
                            </Button>
                        </div>
                        </div>
                    </div>

                    <Panel>
                        {
                            this.hasAllowances()
                                ?
                                <section>
                                    <div className="clear-bth"><Table tableHeaders={this.tableHeaders} tableData={this.state.allAllowances} /></div>
                                </section>
                                :
                                <section>
                                    <div className="emptyTable">No customer allowance exist yet!</div>
                                </section>
                        }
                    </Panel>
                </Box>}
                <Modal handleModal={this.handleModal} isOpen={this.state.showModal} deleteAllowance={this.deleteAllowance} id={this.state.id}/>
            </>
        );
    }
}

export default () => (
    <List params={useParams()} location={useLocation()} />
);
