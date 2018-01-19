import React, {Component} from 'react';
import {Table} from 'reactstrap';
import PropTypes from 'prop-types';

class TableComponent extends Component {
    render() {
        return (
            <Table striped hover size="sm">
                <thead>
                    <tr>
                        <th scope="row">
                            key
                        </th>
                        <th>
                            value
                        </th>
                    </tr>
                </thead>
                <tbody>
                {this.props.data.map((element, index) => element && (
                        <tr key={index}>
                            <td>
                                {element.key}
                            </td>
                            <td>
                                {element.value}
                            </td>
                        </tr>
                    )
                )}
                </tbody>

            </Table>
        );
    }
}

TableComponent.propTypes = {
    data: PropTypes.array,
};

export default TableComponent;
