import React, {Component} from 'react';
import './App.css';
import {Container, Row, Col, Alert} from 'reactstrap';
import PanelComponent from './components/PanelComponent';
import TableComponent from './components/TableComponent';

const K = 4;
const hasher = Math.random();
const hasher2 = Math.random();
const arrLength = 101;

function multihash(toHash) {
    let f = toHash * hasher;
    return Math.abs(Math.floor((f - Math.trunc(f)) * arrLength - 2) % arrLength);
}

function multihash2(toHash) {
    let f = toHash * hasher2;
    return Math.abs(Math.floor((f - Math.trunc(f)) * arrLength - 2) % arrLength);
}

function gorner(numbers) {
    return numbers.map((element, index, array) => {
        if (index === 0) {
            return element;
        }
        return K * array[index - 1] + element;
    })
}

function toNumber(key) {
    let numbers = [];
    let sKey = String(key);
    for (let char of sKey) {
        numbers.push(char.charCodeAt(0));
    }
    return +gorner(numbers).join('');
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: new Array(arrLength),
            collision: 0,
        };
        this.addKey = this.addKey.bind(this);
        this.getValue = this.getValue.bind(this);
    }

    addKey(data) {
        let procData = {...data, key: multihash(toNumber(data.key))};
        this.setState((prevState) => {
            const {data: oldData} = prevState;
            if (!oldData[procData.key]) {
                oldData[procData.key] = procData;
                return {
                    data: oldData,
                }
            } else {
                let iters = 0;
                while (oldData[procData.key] && iters < 2000) {
                    procData.key = (multihash(procData.key) + multihash2(procData.key)) % oldData.length;
                    iters++;
                    console.log(procData.key, iters, oldData.length);
                }
                oldData[procData.key] = procData;
                return {collision: prevState.collision + iters, data: oldData};
            }

        });
    }

    deletElem(arr, key){
        arr[key] = undefined;
        console.log('DEL', arr);
        return arr.slice(0)
    }

    finde(key, del=false) {
        let hkey = multihash(toNumber(key));
        if (!!this.state.data[hkey]) {
            const finded = {...this.state.data[hkey]};
            del?this.setState((prevState) => ({data: this.deletElem(prevState.data, hkey), deleted:finded})):this.setState({finded})
        } else {
            let iters = 0;
            while (!this.state.data[+hkey] && iters < 2000) {
                hkey = (multihash(hkey) + multihash2(hkey)) % arrLength;
                iters++;
            }
            if (iters < 2000) {
                const finded = {...this.state.data[hkey]};
                del?this.setState((prevState) => ({data: this.deletElem(prevState.data, hkey), deleted:finded})):this.setState({finded})

            } else {
                this.setState({error: 'Не найден'})
            }
            console.log(iters, hkey)
        }
    }

    getValue(key, del=false) {
        this.setState(
            {
                finded: undefined,
                error: undefined,
                deleted: undefined,
            }, this.finde.bind(this, key, del)
        )
    }

    getMapLength() {
        return this.state.data.filter((element) => !!element).length
    }

    render() {
        return (
            <Container>
                <div className="panel">
                    <PanelComponent add={this.addKey} getValue={this.getValue}/>
                </div>

                <Row>
                    <Col md={8}>
                        <div className="content">
                            <TableComponent data={this.state.data}/>
                        </div>
                    </Col>
                    <Col md={4}>
                        <Alert color="secondary">
                            Тип ключа – строка текста произвольной длины. <br/>
                            Преобразование строки – формирование значения числа из кодов символов по схеме
                            Горнера. <br/>
                            Метод хеширования – мультипликативный. <br/>
                            Метод разрешения коллизий – двойное хеширование. <br/>
                        </Alert>
                        <Alert color="success">
                            Беймо Ю., Зверев. А. <br/>
                            Количество записей: {this.getMapLength()}
                        </Alert>
                        {!!this.state.collision && (<Alert color="warning">Коллизий: {this.state.collision}</Alert>)}
                        {!!this.state.finded && (<Alert color="success">{`Найден: ${this.state.finded.key} со значением ${this.state.finded.value}`}</Alert>)}
                        {!!this.state.deleted && (<Alert color="success">{`Удален: ${this.state.deleted.key} со значением ${this.state.deleted.value}`}</Alert>)}
                        {this.state.error && (<Alert color="danger">{this.state.error}</Alert>)}

                    </Col>
                </Row>
            </Container>
        );
    }
}

export default App;
