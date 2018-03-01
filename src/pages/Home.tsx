import * as React from 'react';
import { Layout, Menu, Icon, Row, Button, Input, Table, Popover, Modal, Upload, Tooltip, message, Breadcrumb } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const Dragger = Upload.Dragger;
const Search = Input.Search;
import * as filesize from 'filesize';
import lang from '../i18n';
import NetworkManager from '../p2p/NetworkManager';
import { FileItem } from '../components/FileItem';
import IPFSDir from '../models/Dir';
import IPFSFile from '../models/File';
import FileSystem from '../p2p/FileSystem';


// const data2 = [];
// for (let i = 0; i < 46; i++) {
//     data2.push({
//         key: i,
//         title: `Edward King ${i}`,
//         type: i % 5 === 0 ? 'dir' : 'file',
//         mime: ['video/', 'audio/', 'application/pdf', 'application/msword', 'text/', 'image/'][i % 6],
//     });
// }

interface HomeStates {
    clientOffset?: ClientRect;
    newFolderName?: string;
    openUploadModal?: boolean;
    popoverVisible?: boolean;

    ipfsReady?: boolean;
    isLoading: boolean;

    currentDir?: IPFSDir;
    selectedRowKeys: string[];
    data: (IPFSDir | IPFSFile)[];
}

export class Home extends React.Component<{}, HomeStates> {

    fs: FileSystem;

    readonly mobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    readonly columns = [
        {
            title: lang.table.name,
            dataIndex: 'title',
            width: '75%',
            sorter: (a, b) => a.name > b.name ? 1 : 0,
            render: (text: string, record: any, index: number) => {
                return (<FileItem name={text} type={record.type} mime={record.mime} data={record} onClick={item => this.onItemClicked(item)} />);
            },
        },
        {
            title: lang.table.size,
            dataIndex: '',
            width: '10%',
            render: (text: string, record: any, index: number) => {
                return (<div style={{ fontSize: 13 }}>{record.size ? filesize(record.size) : ''}</div>)
            },
        },
        {
            title: lang.table.actions,
            dataIndex: '',
            width: '15%',
            className: 'center-text',
            render: (text: string, record: any, index: number) => {
                return (
                    <div>
                        <Tooltip title={lang.tooltips.share}><Icon className='action_icon' type='share-alt' /></Tooltip>
                        <Tooltip title={lang.tooltips.rename}><Icon className='action_icon' type='form' /></Tooltip>
                        <Tooltip title={lang.tooltips.delete}><Icon className='action_icon' type='delete' /></Tooltip>
                    </div>
                );
            },
        }
    ];

    readonly uploaderProps = {
        name: 'file',
        multiple: true,
        action: '',
        onChange: (info) => {
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
        customRequest: async (options: { action: string, data: any, file: File, filename: string, headers: any, onError: (err, ret) => void, onProgress: (e: { percent: number }) => void, onSuccess: (ret, xhr) => void, withCredentials: boolean }) => {
            let fs = await NetworkManager.getFs();
            let node = await NetworkManager.getNode();
            let dirId = this.state.currentDir.id;

            fs.addFile(options.file, dirId, (offset, total) => { options.onProgress({ percent: offset / total * 100 }) })
                .catch((e) => options.onError(e, null))
                .then(files => { options.onSuccess(files, null); this.refreshCurrentDir(), console.log(files); });

            console.log('customRequest', options);
        },
    };

    constructor(props: any, ctx: any) {
        super(props, ctx);
        this.state = { selectedRowKeys: [], data: [], isLoading: true };
        window.onresize = () => { this.setState({ clientOffset: this.container.getBoundingClientRect() }) };
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    async onFolderSave() {
        this.setState({ popoverVisible: false, newFolderName: '' });

        if (!this.state.newFolderName) return;
        if (!this.fs) return;
        let dir = await this.fs.mkdir(this.state.newFolderName, this.state.currentDir.id);
        if (!dir) return;
        await this.refreshCurrentDir();
    }

    onItemClicked(item: IPFSDir | IPFSFile) {

    }

    onItemRename(item: IPFSDir | IPFSFile) {

    }

    onItemDelete(item: IPFSDir | IPFSFile) {

    }

    async componentDidMount() {
        this.setState({ clientOffset: this.container.getBoundingClientRect() })
        NetworkManager.onStateChanged(this.updateNetworkState);
        this.fs = await NetworkManager.getFs();
        this.setState({ isLoading: false, currentDir: this.fs.getRootDir() });
        await this.refreshCurrentDir();
    }

    componentWillUnmount() {
        NetworkManager.removeListener(this.updateNetworkState);
    }

    private updateNetworkState = () => {
        this.setState({ ipfsReady: NetworkManager.ready });
    }

    private async refreshCurrentDir() {
        this.setState({ isLoading: true });
        let dir = await this.fs.getDir(this.state.currentDir.id)
        let data = dir.dirs.concat(dir.files as any[]);
        this.setState({ data, isLoading: false });
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
                <Input placeholder={lang.placeholders.folder} maxLength='64' value={this.state.newFolderName} onChange={e => this.setState({ newFolderName: e.target.value })} />
                <Row style={{ marginTop: 8 }} type='flex' justify='end'>
                    <Button icon='save' onClick={e => this.onFolderSave()} disabled={!(this.state.newFolderName && this.state.newFolderName.length > 0)}>{lang.buttons.save}</Button>
                </Row>
            </div>
        );

        return (
            <div ref={e => this.container = e} style={{}}>
                <Row style={{ padding: '10px 12px 2px 12px', width: `${this.state.clientOffset ? `${window.innerWidth - this.state.clientOffset.left}px` : '100%'}`, zIndex: 1, position: 'fixed', background: '#fff' }} >
                    <Row style={{}} type='flex' justify='space-between'>
                        <div style={{ display: `${this.mobileDevice ? 'none' : undefined}` }}>
                            <Button className='action_button' icon='upload' type='primary' disabled={!this.state.ipfsReady} onClick={e => this.setState({ openUploadModal: true })}>{lang.buttons.upload}</Button>
                            <Popover trigger='click' content={newFolder} placement='bottom' visible={this.state.popoverVisible}>
                                <Button className='action_button' icon='folder-add' disabled={!this.state.ipfsReady} onClick={e => this.setState({ popoverVisible: true })} >{lang.buttons.newfolder}</Button>
                            </Popover>
                            <Button style={{ display: `${this.state.selectedRowKeys.length > 0 ? undefined : 'none'}` }}>{lang.buttons.delete}</Button>
                        </div>

                        <div></div>

                        <Search
                            className='search_box'
                            placeholder={lang.placeholders.search}
                            onSearch={value => console.log(value)}
                            style={{ maxWidth: 200, }}
                        />
                    </Row>

                    <Row style={{ marginTop: 4, paddingLeft: 0, fontSize: 12 }}>
                        <Breadcrumb separator='>'>
                            <Breadcrumb.Item>All Files</Breadcrumb.Item>
                        </Breadcrumb>
                    </Row>
                </Row>

                <Row style={{ paddingTop: 72 }}>
                    <Table loading={this.state.isLoading} rowSelection={rowSelection} columns={this.columns} dataSource={this.state.data} pagination={{ pageSize: 30 }} rowKey='id' />
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