import React, { Component } from 'react';
import { StatefulTable } from '@bigcommerce/big-design';

export class Table extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        const key = 'email';
        const uniqueData = [...new Map(this.props.tableData.map(item =>
            [item[key], item])).values()];

        return (
            <StatefulTable
                columns={this.props.tableHeaders}
                itemName="Customer Allowances"
                items={uniqueData}
                pagination
                search
                stickyHeader
            />
        );
    }
}
