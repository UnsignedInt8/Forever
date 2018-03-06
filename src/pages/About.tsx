import * as React from 'react';
import lang from '../i18n';

export default class About extends React.Component {

    render() {
        return (
            <div style={{ padding: 12 }}>
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
            </div>
        );
    }
}