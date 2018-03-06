import zh_CN from './zh_CN';
import en_US from './en_US';

type Language = {
    siders: {
        all: string;
        files: string;
        videos: string;
        music: string;
        pictures: string;
        about: string;
        settings: string;
    },

    buttons: {
        upload: string;
        newfolder: string;
        cancel: string;
        confirm: string;
        save: string;
        delete: string;
        rename: string;
        yes: string;
        getstarted: string;
    },

    table: {
        name: string;
        actions: string;
        size: string;
    },

    placeholders: {
        folder: string;
        search: string;
        share: string;
        rename: string,
        allfiles: string;
    },

    messages: {
        dragfiles: string;
        uploadingsucceeded: string;
        uploadingfailed: string;
        areyousure: string;
        copied: string;
    },

    tooltips: {
        share: string;
        rename: string;
        delete: string;
    },

    about: {
        intro: { p1: string, p2: string; };
        dependences: string;
    }
}

export const langauges = {
    'zh-CN': zh_CN,
    'en-US': en_US,
};

export default langauges[window.navigator.language] as Language || en_US;
