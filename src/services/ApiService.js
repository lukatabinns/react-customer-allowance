import axios from 'axios';
const header = {'Content-Type': 'application/json'}

export const ApiService = {

    searchCustomers (txt) {
        return axios.get('/api/search-customer/' + txt, {headers: header});
    },

    getCustomers () {
        return axios.get('/api/all-customers', {headers: header});
    },

    allCustomerAllowances () {
        return axios.get('/api/customer-allowances', {headers: header});
    },

    createCustomerAllowance (result) {
        let formData = {
            "bc_customer_id":result.bc_customer_id,
            "bc_shop_id":result.bc_shop_id,
            "credit_value": result.credit_value,
            "day_number": result.day_number,
            "active": result.active
        };

        return axios.post('/api/store-customer-allowance', formData, {headers: header});
    },

    updateCustomerAllowance (result, id) {
        let formData = {
            "bc_customer_id":result.bc_customer_id,
            "bc_shop_id":result.bc_shop_id,
            "credit_value": result.credit_value,
            "day_number": result.day_number,
            "active": result.active
        };

        return axios.put("/api/update-customer-allowance/"+ id, formData,{headers: header});
    },

    deleteCustomerAllowance (id) {
        return axios.delete('/api/delete-customer-allowance/' + id, {headers: header});
    },
};
