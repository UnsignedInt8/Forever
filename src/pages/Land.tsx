import * as React from 'react';
import { Layout, Menu, Icon, Button } from 'antd';
import { Box } from 'react-feather';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import lang from '../i18n';

export class Land extends React.Component {

    render() {
        return (
            <div style={{ background: 'black', width: '100%', height: '100%', position: 'relative' }}>
                <div style={{ background: 'url(/earth.jpg) center no-repeat', width: '100%', height: '100%', backgroundSize: 'cover', opacity: 1.85, position: 'absolute', }} />

                <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', width: '100%', height: '100%', color: 'white', padding: '16px 24px', position: 'absolute' }}>
                    <Box color='white' size={32} style={{ display: 'inline-block' }} />
                    <div className='logo' style={{ cursor: 'default', display: 'inline-block', }}>Forever</div>
                </div>

                <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: 42, fontFamily: 'Montserrat', fontWeight: 100, position: 'absolute', color: 'white', textAlign: 'center', verticalAlign: 'center', lineHeight: `${window.innerHeight}px` }}>
                    <span>SHARE ALWAYS AND FOREVER.</span>
                </div>

                <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-end', width: '100%', height: '100%', position: 'absolute', padding: '16px 24px' }}>
                    <Link to='/files'>
                        <Button className='get-started-btn' size='large' type='ghost' >{lang.buttons.getstarted}</Button>
                    </Link>
                </div>
            </div>
        );
    }
}