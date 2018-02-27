import * as React from 'react';
import { Layout, Menu, Icon, Row, Button, Input, Table } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const Search = Input.Search;
import lang from '../i18n';


const data = [];
for (let i = 0; i < 46; i++) {
    data.push({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
    });
}

interface HomeStates {
    contentMarginLeft: number;
    selectedRowKeys: string[],
    clientOffset?: ClientRect;
}

export class Home extends React.Component<{}, HomeStates> {

    readonly mobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    readonly columns = [{
        title: lang.table.name,
        dataIndex: 'name',
        width: '80%',
        render: (text: string, record: any, index: number) => { return (<div></div>) }
    }, {
        title: lang.table.actions,
        dataIndex: '',
        width: '20%',
        render: (text: string, record: any, index: number) => { return (<div></div>) }
    }];

    constructor(props: any, ctx: any) {
        super(props, ctx);
        this.state = { contentMarginLeft: 200, selectedRowKeys: [] };
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    componentDidMount() {
        this.setState({ clientOffset: this.container.getBoundingClientRect() })
    }

    container: HTMLDivElement;

    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        return (
            <div ref={e => this.container = e} style={{}}>
                <Row style={{ padding: '10px 12px', width: `${this.state.clientOffset ? `${window.innerWidth - this.state.clientOffset.left}px` : '100%'}`, zIndex: 1, position: 'fixed', background: '#fff' }} type='flex' justify='space-between'>
                    <div style={{ display: `${this.mobileDevice ? 'none' : undefined}` }}>
                        <Button className='action_button' icon='upload' type='primary'>{lang.buttons.upload}</Button>
                        <Button className='action_button' icon='folder-add'>{lang.buttons.newfolder}</Button>
                    </div>

                    <div></div>

                    <Search
                        className='search_box'
                        placeholder="input search text"
                        onSearch={value => console.log(value)}
                        style={{ maxWidth: 200, }}
                    />
                </Row>

                <Row style={{ paddingTop: 52 }}>
                    <Table rowSelection={rowSelection} columns={this.columns} dataSource={data} pagination={{ pageSize: 30 }} />
                </Row>

            </div>
        );
    }
}