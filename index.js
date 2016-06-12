'use strict';

const execa = require('execa');
const moment = require('moment');

function substitute(str, o) {
    return str.replace(/\\?\{([^{}]+)\}/g, function (match, name) {
        if (match.charAt(0) === '\\') {
            return match.slice(1);
        }
        return (o[name] === undefined) ? '' : o[name];
    });
}

module.exports = {
    website: {
        assets: './assets',
        css: [
            'style.css'
        ]
    },

    hooks: {
        "page:before": function (page) {
            const defaults = {
                createTpl: 'Created by {user} at {timeStamp}',
                modifyTpl: 'Last modified by {user} at {timeStamp}',
                timeStampFormat: 'YYYY-MM-DD HH:mm:ss'
            };
            const pluginConfig = this.config.get('pluginsConfig')['git-author'];
            const options = Object.assign({}, defaults, pluginConfig);

            const createTpl = options.createTpl;
            const modifyTpl = options.modifyTpl;
            const timeStampFormat = options.timeStampFormat;

            return execa.shell(`git log --format="%an|%at" -- ${page.rawPath}`).then((ret) => {
                // none commit to this file
                if (!ret.stdout) {
                    this.log.debug(`none commit to file ${page.path}`);
                    return page;
                }

                const commits = ret.stdout.split(/\r?\n/).map((log) => {
                    const arr = log.split('|');
                    const timeStamp = moment(arr[1] * 1000).format(timeStampFormat);

                    return {
                        user: arr[0],
                        timestamp: timeStamp,
                        timeStamp: timeStamp
                    }
                });

                const lastCommit = commits[0];
                const firstCommit = commits.slice(-1)[0];

                let gitAuthorContent = '<div class="git-author-container">';

                if (modifyTpl) {
                    const modifyMsg = substitute(modifyTpl, lastCommit);
                    gitAuthorContent += `<div class="modified">${modifyMsg}</div>`;
                }

                if (createTpl) {
                    const createMsg = substitute(createTpl, firstCommit);
                    gitAuthorContent += `<div class="created">${createMsg}</div>`;
                }

                gitAuthorContent += '</div>';

                page.content += gitAuthorContent;

                return page;
            }).catch((e) => {
                this.log.warn('initialize git repository and commit files firstly');
                this.log.warn(e);
                return page;
            });
        }
    }
};
