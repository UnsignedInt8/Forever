import * as React from 'react';
import { Layout, Menu, Icon, Row, Col, Button, Input, Table, Popover, Modal, Upload, Tooltip, message, Breadcrumb } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const confirm = Modal.confirm;
const Dragger = Upload.Dragger;
const Search = Input.Search;
import * as filesize from 'filesize';
import lang from '../i18n';
import NetworkManager from '../p2p/NetworkManager';
import { FileItem } from '../components/FileItem';
import { FilePreviewer } from '../components/FilePreviewer';
import IPFSDir from '../models/Dir';
import IPFSFile from '../models/File';
import FileSystem from '../p2p/FileSystem';
import StorageItem from '../models/StorageItem';
import * as Clipboard from 'clipboard';
import { UploadFile } from 'antd/lib/upload/interface';
import { CSSProperties } from 'react';

interface DiskStates {
    clientOffset?: ClientRect;
    newFolderName?: string;
    openUploadModal?: boolean;
    openShareModal?: boolean;
    openRenameModal?: boolean;
    openPreviewModal?: boolean;
    folderPopVisible?: boolean;
    selectedPopVisible?: boolean;

    ipfsReady?: boolean;
    isLoading: boolean;

    currentDir?: IPFSDir;
    selectedRowKeys: string[];
    data: (IPFSDir | IPFSFile)[];
    selectedItem?: IPFSDir | IPFSFile;
    newItemName?: string;

    dirsStack: IPFSDir[];
}

interface DiskProps {
    list?: 'all' | 'videos' | 'music' | 'images';
    style?: CSSProperties;
}

export class Disk extends React.Component<DiskProps, DiskStates> {

    container: HTMLDivElement;
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
                let deleteItem = () => confirm({
                    title: `${lang.tooltips.delete} ${record.title}`,
                    content: '',
                    okText: lang.buttons.yes,
                    okType: 'danger',
                    cancelText: lang.buttons.cancel,
                    onOk: () => {
                        this.onItemDelete(record)
                    },
                    onCancel: () => {
                    },
                });

                return (
                    <div>
                        <Tooltip title={lang.tooltips.share}><Icon onClick={e => this.onItemShare(record)} className='action_icon' type='share-alt' style={{ color: `${record.type === 'file' ? undefined : 'lightgrey'}` }} /></Tooltip>
                        <Tooltip title={lang.tooltips.rename}><Icon onClick={e => this.setState({ openRenameModal: true, selectedItem: record })} className='action_icon' type='form' /></Tooltip>
                        <Tooltip title={lang.tooltips.delete}><Icon onClick={e => deleteItem()} className='action_icon' type='delete' /></Tooltip>
                    </div>
                );
            },
        }
    ];

    readonly uploaderProps = {
        name: 'file',
        multiple: true,
        action: '',
        beforeUpload: (file: UploadFile, fileList: UploadFile[]) => { if (file) return file.type.length > 0; return true; },
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
                    // console.log(status, info.file, info.fileList);
                    break;
            }
        },
        customRequest: async (options: { action: string, data: any, file: File, filename: string, headers: any, onError: (err, ret) => void, onProgress: (e: { percent: number }) => void, onSuccess: (ret, xhr) => void, withCredentials: boolean }) => {

            if (!options.file.type) {
                options.onProgress({ percent: 0 });
                options.onError(new Error(`Can't upload folder`), null);
                return;
            }

            let fs = await NetworkManager.getFs();
            let node = await NetworkManager.getNode();
            let dirId = this.state.currentDir.id;

            fs.addFile(options.file, dirId, (offset, total) => { options.onProgress({ percent: offset / total * 100 }) })
                .catch((e) => options.onError(e, null))
                .then(files => { options.onSuccess(files, null); this.refreshCurrentDir() });
        },
    };

    constructor(props: any, ctx: any) {
        super(props, ctx);
        this.state = { selectedRowKeys: [], data: [], isLoading: true, dirsStack: [] };
        window.onresize = () => { this.setState({ clientOffset: this.container.getBoundingClientRect() }) };
        (new Clipboard('.share_btn')).on('success', () => { message.success(lang.messages.copied) });
    }

    async onFolderSave() {
        this.setState({ folderPopVisible: false, newFolderName: '' });

        if (!this.state.newFolderName) return;
        if (!this.fs) return;
        let dir = await this.fs.mkdir(this.state.newFolderName, this.state.currentDir.id);
        if (!dir) return;
        await this.refreshCurrentDir();
    }

    onItemClicked(item: IPFSDir | IPFSFile) {
        this.setState({ selectedItem: item });

        switch (item.type) {
            case 'dir':
                this.switchFolder(item as IPFSDir);
                break;
            case 'file':
                this.openFile(item as IPFSFile);
                break;
            default: break;
        }
    }

    private switchFolder(dir: IPFSDir) {
        this.state.dirsStack.push(dir);
        this.setState({ currentDir: dir }, async () => {
            await this.refreshCurrentDir();
        });
    }

    private jumpToFolder(target: IPFSDir) {
        target = target || this.fs.getRootDir();

        let dir: IPFSDir;
        while (true) {
            dir = this.state.dirsStack[this.state.dirsStack.length - 1];
            if (!dir) break;

            if (dir.id !== target.id) this.state.dirsStack.pop();
            if (dir.id === target.id) break;
        }

        dir = dir || this.fs.getRootDir();
        this.setState({ currentDir: dir }, () => this.refreshCurrentDir());
    }

    private openFile(file: IPFSFile) {
        console.log(file.mime, FilePreviewer.isSupported(file.mime));

        if (!FilePreviewer.isSupported(file.mime)) {
            window.open(`https://ipfs.io/ipfs/${file.id}`, '_blank');
            return;
        }

        this.setState({ openPreviewModal: true });
    }

    async onItemRename(item: IPFSDir | IPFSFile) {
        if (!this.state.newItemName) return;
        this.state.selectedItem.title = this.state.newItemName;

        if (this.state.selectedItem.type === 'dir') {
            await this.fs.updateDir(this.state.selectedItem as IPFSDir);
        }
        else {
            this.fs.updateDir(this.state.currentDir);
        }

        this.setState({ openRenameModal: false, newItemName: '' });
    }

    async onItemDelete(item: IPFSDir | IPFSFile) {
        if (item.type === 'dir') {
            return await this.fs.rmdir(item.id);
        }

        if (!this.state.currentDir.id) {
            this.deleteFiles([item.id]);
            return;
        }

        let index = this.state.currentDir.files.findIndex(i => i.id === item.id);
        if (index === -1) return;
        this.state.currentDir.files.splice(index, 1);
        await this.fs.updateDir(this.state.currentDir);
        await this.refreshCurrentDir();
    }

    onItemShare(item: IPFSFile) {
        if (item.type === 'dir') return;
        this.setState({ selectedItem: item, openShareModal: true });
    }

    async onSelectedRowDelete() {
        if (!this.state.selectedRowKeys || this.state.selectedRowKeys.length === 0) return;

        if (!this.state.currentDir.id) {
            this.deleteFiles(this.state.selectedRowKeys);
            this.setState({ selectedPopVisible: false, selectedRowKeys: [] });
            return;
        }

        this.setState({ isLoading: true });

        for (let id of this.state.selectedRowKeys) {
            let index = this.state.currentDir.dirs.findIndex(i => i.id === id);
            if (index > -1) {
                this.state.currentDir.dirs.splice(index, 1);
                await this.fs.rmdir(id);
                continue;
            }

            index = this.state.currentDir.files.findIndex(i => i.id === id);
            if (index > -1) this.state.currentDir.files.splice(index, 1);
        }

        this.setState({ selectedPopVisible: false, selectedRowKeys: [], isLoading: false });
        await this.fs.updateDir(this.state.currentDir);
        await this.refreshCurrentDir();
    }

    private async deleteFiles(ids: string[]) {
        this.setState({ isLoading: true });

        let files = this.state.data as IPFSFile[];
        let pending = files.filter(f => ids.indexOf(f.id) > -1);

        for (let file of pending) {
            let dir = this.fs.getDir(file.dirId);
            let index = dir.files.findIndex(v => v.id === file.id);
            if (index === -1) continue;
            dir.files.splice(index, 1);
            await this.fs.updateDir(dir);
        }

        await this.refreshCurrentDir();
    }

    onTableSelectChange = (selectedRowKeys) => this.setState({ selectedRowKeys });

    async componentDidMount() {
        this.setState({ clientOffset: this.container.getBoundingClientRect() })

        NetworkManager.onStateChanged(this.updateNetworkState);
        this.fs = await NetworkManager.getFs();

        this.setState({ isLoading: false, currentDir: this.fs.getRootDir() }, () => this.refreshCurrentDir());
    }

    componentWillUnmount() {
        NetworkManager.removeListener(this.updateNetworkState);
    }

    private updateNetworkState = () => {
        this.setState({ ipfsReady: NetworkManager.ready });
    }

    async refreshCurrentDir() {
        if (!this.fs) return;

        this.setState({ isLoading: true });

        if (this.props.list && this.props.list !== 'all') {
            let allFolders = this.fs.listAllItems().filter(i => i.type === 'dir') as IPFSDir[];
            let mimeMaps = new Map([['videos', 'video/'], ['music', 'audio/'], ['images', 'image/']])
            let files = allFolders.reduce<IPFSFile[]>((prev, cur) => prev.concat(cur.files.filter(f => f.mime.startsWith(mimeMaps.get(this.props.list)))), []);
            files = files.distinct((i1, i2) => i1.id === i2.id).toArray();
            let vDir: IPFSDir = { files, dirs: [], id: null, parentId: null, title: 'vDir', type: 'dir' };
            this.setState({ data: files, isLoading: false, currentDir: vDir, dirsStack: [] });
            return;
        }

        let id = this.state.currentDir && this.state.currentDir.id ? this.state.currentDir.id : 'root';

        let dir = this.fs.getDir(id);
        let data = dir.dirs.concat(dir.files as any[]);
        this.setState({ data, isLoading: false, currentDir: dir });
    }

    private filterItems(keywords: string) {
        let dir = this.state.currentDir;
        keywords = keywords.toLowerCase();
        let data = dir.dirs.concat(dir.files as any[]).filter(i => keywords ? i.title.toLowerCase().includes(keywords) : true);
        this.setState({ data });
    }

    render() {
        const actionButtonsDisabled = (this.props.list && this.props.list !== 'all') ? true : !this.state.ipfsReady;

        const selectedHash = this.state.selectedItem ? this.state.selectedItem.id : '';
        const selectedTitle = this.state.selectedItem ? this.state.selectedItem.title : '';
        const selectedMime = this.state.selectedItem ? this.state.selectedItem['mime'] : '';

        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onTableSelectChange,
        };

        const newFolder = (
            <div>
                <Input placeholder={lang.placeholders.folder} maxLength='64' value={this.state.newFolderName} onChange={e => this.setState({ newFolderName: e.target.value })} />
                <Row style={{ marginTop: 8 }} type='flex' justify='end'>
                    <Button icon='save' onClick={e => this.onFolderSave()} disabled={!(this.state.newFolderName && this.state.newFolderName.length > 0)}>{lang.buttons.save}</Button>
                </Row>
            </div>
        );

        const deleteRows = (
            <div>
                <div style={{ color: 'red' }}><Icon type="exclamation-circle" /> {lang.messages.areyousure}</div>
                <Button type='danger' style={{ width: '100%', marginTop: 8 }} onClick={e => this.onSelectedRowDelete()}>{lang.buttons.yes}</Button>
            </div>
        );

        return (
            <div ref={e => this.container = e} style={Object.assign({ position: 'relative', background: 'white' }, this.props.style)}>
                <Row style={{ padding: '10px 12px 2px 12px', width: `${this.state.clientOffset ? `${window.innerWidth - this.state.clientOffset.left}px` : '100%'}`, zIndex: 1, position: 'fixed', background: '#fff' }} >
                    <Row style={{}} type='flex' justify='space-between'>
                        <div style={{ display: `${this.mobileDevice ? 'none' : undefined}` }}>
                            <Button className='action_button' icon='upload' type='primary' disabled={actionButtonsDisabled} onClick={e => this.setState({ openUploadModal: true })}>{lang.buttons.upload}</Button>
                            <Popover trigger='click' content={newFolder} placement='bottom' visible={this.state.folderPopVisible}>
                                <Button className='action_button' icon='folder-add' disabled={actionButtonsDisabled} onClick={e => this.setState({ folderPopVisible: !this.state.folderPopVisible })} >{lang.buttons.newfolder}</Button>
                            </Popover>
                            <Popover trigger='click' content={deleteRows} placement='bottom' visible={this.state.selectedPopVisible}>
                                <Button className='action_button' icon='delete' style={{ display: `${this.state.selectedRowKeys.length > 0 ? '' : 'none'}` }} onClick={e => this.setState({ selectedPopVisible: !this.state.selectedPopVisible })}>{lang.buttons.delete}</Button>
                            </Popover>
                        </div>

                        <div></div>

                        <Search
                            className='search_box'
                            placeholder={lang.placeholders.search}
                            onChange={e => this.filterItems(e.target.value)}
                            style={{ maxWidth: 200, }}
                        />
                    </Row>

                    <Row style={{ marginTop: 4, paddingLeft: 0, fontSize: 12, fontWeight: 200, }}>
                        <Breadcrumb separator='>'>
                            <Breadcrumb.Item><a className='breadcrumb-text' onClick={e => this.jumpToFolder(null)}>{lang.placeholders.allfiles}</a></Breadcrumb.Item>
                            {
                                this.state.dirsStack.map((d, i) =>
                                    <Breadcrumb.Item key={d.id}>
                                        {i === this.state.dirsStack.length - 1 ? <span className='breadcrumb-text'>{d.title}</span> : <a className='breadcrumb-text' onClick={e => this.jumpToFolder(d)}>{d.title}</a>}
                                    </Breadcrumb.Item>
                                )
                            }
                        </Breadcrumb>
                    </Row>
                </Row>

                <Row style={{ paddingTop: 72, position: 'relative' }}>
                    <Table loading={this.state.isLoading} rowSelection={rowSelection} columns={this.columns} dataSource={this.state.data} pagination={{ pageSize: 30 }} rowKey='id' />
                </Row>

                <Modal visible={this.state.openPreviewModal} footer={null} bodyStyle={{ width: '100%' }} width={window.innerWidth * 0.8} onCancel={e => this.setState({ openPreviewModal: false })}>
                    <FilePreviewer style={{ width: '100%', height: '100%' }} ipfsHash={selectedHash} mime={selectedMime} name={selectedTitle} />
                </Modal>

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

                <Modal visible={this.state.openShareModal} footer={null} closable={false} onCancel={e => this.setState({ openShareModal: false })}>
                    <div>
                        <div style={{ fontSize: 18, marginBottom: 12, position: 'relative' }} >
                            <Icon type='share-alt' style={{ marginRight: 8, fontSize: 24 }} />
                            <div style={{ position: 'absolute', display: 'inline-block', top: -1 }}>{`${lang.placeholders.share} ${this.state.selectedItem ? this.state.selectedItem.title : ''}`}</div>
                        </div>

                        <Row style={{ marginBottom: 12 }}>
                            <Col span={22}>
                                <Input id='ipfs_link' readOnly value={`ipfs://${selectedHash}`} style={{ display: 'inline-block' }} />
                            </Col>
                            <Col span={2} style={{ marginLeft: 0, display: 'flex', justifyContent: 'center' }}>
                                <Button className='share_btn' icon='copy' data-clipboard-target='#ipfs_link' />
                            </Col>
                        </Row>

                        <Row>
                            <Col span={22}>
                                <Input id='https_link' readOnly value={`https://ipfs.io/ipfs/${selectedHash}`} style={{ display: 'inline-block' }} />
                            </Col>
                            <Col span={2} style={{ marginLeft: 0, display: 'flex', justifyContent: 'center' }}>
                                <Button className='share_btn' icon='copy' data-clipboard-target='#https_link' />
                            </Col>
                        </Row>
                    </div>
                </Modal>

                <Modal
                    title={`${lang.placeholders.rename} ${this.state.selectedItem ? this.state.selectedItem.title : ''}`}
                    visible={this.state.openRenameModal}
                    onOk={e => this.onItemRename(this.state.selectedItem)}
                    onCancel={e => this.setState({ openRenameModal: false })}
                >
                    <Input onChange={e => this.setState({ newItemName: e.target.value })} />
                </Modal>
            </div>
        );
    }
}