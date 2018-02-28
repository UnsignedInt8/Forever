import * as React from 'react';
import { Layout, Menu, Icon, Row, Button, Input, Table, Popover, Modal, Upload, message } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const Dragger = Upload.Dragger;
const Search = Input.Search;
import lang from '../i18n';
import NetworkManager from '../p2p/NetworkManager';
import { FileItem } from '../components/FileItem';
import IPFSDir from '../models/Dir';
import IPFSFile from '../models/File';


const data = [];
for (let i = 0; i < 46; i++) {
    data.push({
        key: i,
        name: `Edward King ${i}`,
        type: i % 5 === 0 ? 'dir' : 'file',
        mime: ['video/', 'audio/', 'application/pdf', 'application/msword', 'text/', 'image/'][i % 6],
    });
}

interface HomeStates {
    contentMarginLeft: number;
    selectedRowKeys: string[],
    clientOffset?: ClientRect;
    newFolderName?: string;
    openUploadModal?: boolean;
    currentDir?: IPFSDir;
}

export class Home extends React.Component<{}, HomeStates> {

    readonly mobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    readonly columns = [{
        title: lang.table.name,
        dataIndex: 'name',
        width: '80%',
        sorter: (a, b) => a.name > b.name ? 1 : 0,
        render: (text: string, record: any, index: number) => { return (<FileItem name={text} type={record.type} mime={record.mime} data={record} onClick={item => this.onItemClicked(item)} />) },
    }, {
        title: lang.table.actions,
        dataIndex: '',
        width: '20%',
        className: 'center-text',
        render: (text: string, record: any, index: number) => { return (<div></div>) }
    }];

    readonly uploaderProps = {
        name: 'file',
        multiple: true,
        action: '',
        onChange(info) {
            const status = info.file.status;

            switch (status) {
                case 'done':
                    message.success(`${info.file.name} ${lang.messages.uploadingsucceeded}`);
                    break;
                case 'error':
                    message.error(`${info.file.name} ${lang.messages.uploadingfailed}`);
                    break;
                default:
                    console.log(status, info.file, info.fileList);
            }
        },
        async customRequest(options: { action: string, data: any, file: File, filename: string, headers: any, onError: (err, ret) => void, onProgress: (e: { percent: number }) => void, onSuccess: (ret, xhr) => void, withCredentials: boolean }) {
            let fs = await NetworkManager.getFs();
            let node = await NetworkManager.getNode();
            fs.addFile(options.file, 'fe70c3e0-1aa1-11e8-9260-eda66082fe72', (offset, total) => { options.onProgress({ percent: offset / total * 100 }) })
                .catch((e) => options.onError(e, null))
                .then(files => {
                    options.onSuccess(files, null);
                    console.log(files);
                });

            console.log('customRequest', options);
        },
    };

    constructor(props: any, ctx: any) {
        super(props, ctx);
        this.state = { contentMarginLeft: 200, selectedRowKeys: [] };
        window.onresize = () => { this.setState({ clientOffset: this.container.getBoundingClientRect() }) };
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    onFolderSave() {
        if (!this.state.newFolderName) return;

    }

    onItemClicked(item: IPFSDir | IPFSFile) {

    }

    onItemRename(item: IPFSDir | IPFSFile) {

    }

    onItemDelete(item: IPFSDir | IPFSFile) {

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

        const newFolder = (
            <div>
                <Input placeholder={lang.placeholders.folder} maxLength='64' onChange={e => this.setState({ newFolderName: e.target.value })} />
                <Row style={{ marginTop: 8 }} type='flex' justify='end'>
                    <Button icon='save' onClick={e => this.onFolderSave()} disabled={!(this.state.newFolderName && this.state.newFolderName.length > 0)}>{lang.buttons.save}</Button>
                </Row>
            </div>
        );

        return (
            <div ref={e => this.container = e} style={{}}>
                <Row style={{ padding: '10px 12px', width: `${this.state.clientOffset ? `${window.innerWidth - this.state.clientOffset.left}px` : '100%'}`, zIndex: 1, position: 'fixed', background: '#fff' }} type='flex' justify='space-between'>
                    <div style={{ display: `${this.mobileDevice ? 'none' : undefined}` }}>
                        <Button className='action_button' icon='upload' type='primary' onClick={e => this.setState({ openUploadModal: true })}>{lang.buttons.upload}</Button>
                        <Popover trigger='click' content={newFolder} placement='bottom'>
                            <Button className='action_button' icon='folder-add'>{lang.buttons.newfolder}</Button>
                        </Popover>
                    </div>

                    <div></div>

                    <Search
                        className='search_box'
                        placeholder={lang.placeholders.search}
                        onSearch={value => console.log(value)}
                        style={{ maxWidth: 200, }}
                    />
                </Row>

                <Row style={{ paddingTop: 52 }}>
                    <Table rowSelection={rowSelection} columns={this.columns} dataSource={data} pagination={{ pageSize: 30 }} />
                </Row>

                <Modal
                    visible={this.state.openUploadModal}
                    footer={null}
                    closable={false}
                    bodyStyle={{ height: 500, paddingBottom: 100, overflow: 'auto' }}
                    onCancel={e => this.setState({ openUploadModal: false })}
                >
                    <Dragger {...this.uploaderProps} style={{}}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">{lang.messages.dragfiles}</p>
                    </Dragger>
                </Modal>
            </div>
        );
    }
}