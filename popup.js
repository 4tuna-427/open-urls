'use strict';

class UrlsOpener {
    constructor() {
        this.addEventListeners();
    }

    addEventListeners() {
        const openButton = document.getElementById('open');
        if (openButton) {
            openButton.addEventListener('click', this.onCliclOpenButon.bind(this));
        }
    }

    async onCliclOpenButon() {
        const urls = this.getTextAreaUrls();
        if (urls.length > 0) {
            const openedTabs = await this.openTabs(urls);
            await this.createTabGroup(openedTabs);
        }
    }

    getTextAreaUrls() {
        const textarea = document.querySelector(`[name="urls"]`);
        if (textarea) {
            const urls = textarea.value.split('\n').filter(url => url !== '');
            return urls;
        } else {
            return [];
        }
    }

    async openTabs(urls) {
        const tabs = [];
        for (const url of urls) {
            const tab = await chrome.tabs.create({ url: url, active: false });
            tabs.push(tab);
        }
        return tabs;
    }

    async createTabGroup(tabs) {
        await chrome.tabs.group({
            tabIds: tabs.map((tab) => tab.id)
        });

        chrome.tabs.highlight({
            tabs: tabs[0].index
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UrlsOpener();
});
