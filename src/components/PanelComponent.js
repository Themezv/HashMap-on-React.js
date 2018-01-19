import React, {Component} from 'react';
import {InputGroup, Input, InputGroupButton} from 'reactstrap';
import PropTypes from 'prop-types';

class Panel extends Component {
    constructor (props) {
        super(props);
        this.state = {
            input: '',
        };
        this.add = this.add.bind(this);
        this.getValue = this.getValue.bind(this);
        this.delValue = this.delValue.bind(this);
    }
    add () {
        this.props.add({key: this.state.input, value: this.state.input});
    }
    getValue () {
        this.props.getValue(this.state.input);
    }
    delValue () {
        this.props.getValue(this.state.input, true);
    }
    render() {
        return (
            <InputGroup>
                <Input onChange={(e) => {
                    this.setState({input: e.target.value})
                }} value={this.state.input} placeholder="Ключ"/>
                <InputGroupButton color="success" onClick={this.add}>Добавить</InputGroupButton>
                <InputGroupButton color="info" onClick={this.getValue}>Получить</InputGroupButton>
                <InputGroupButton color="danger" onClick={this.delValue}>Удалить</InputGroupButton>
            </InputGroup>
        );
    }
}

Panel.propTypes = {
    add: PropTypes.func.isRequired,
    getValue: PropTypes.func.isRequired,
};

export default Panel;
