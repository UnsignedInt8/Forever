import * as React from 'react';
import lang from '../i18n';
import { CSSProperties } from 'react';

interface AboutProps {
    style?: CSSProperties;
}

export default class About extends React.Component<AboutProps, {}> {

    render() {
        return (
            <div style={Object.assign({ padding: 12, fontSize: 14, fontWeight: 200 }, this.props.style)}>
                <p>
                    {lang.about.intro.p1}<br />
                    {lang.about.intro.p2}
                </p>
                <p>
                    {lang.about.dependences}<br />
                    <a href="https://ant.design" target='_blank'>Ant Design</a><br />
                    <a href="http://feathericons.com" target='_blank'>Feather Icon</a><br />
                    <a href="https://reactjs.org" target='_blank'>React.js</a><br />
                </p>
                <p style={{ fontSize: 10 }}>
                    Ver 0.1.1
                </p>
            </div>
        );
    }
}