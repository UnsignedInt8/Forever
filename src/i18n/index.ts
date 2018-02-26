import zh_CN from './zh_CN';
import en_US from './en_US';

type Language = {
    siders: {
        files: string;
        videos: string;
        music: string;
        about: string;
        settings: string;
    }
}

export const langauges = {
    'zh_CN': zh_CN,
    'en_US': en_US,
};

export default langauges[window.navigator.language] as Language || en_US;
