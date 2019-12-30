const path = require('path')

module.exports = {
    base: '/my-blog/',
    title: 'CKW',
    description: '你要保守你的心胜过保守一切，因为一生的果效是由心发出的',
    head: [
        [
            'link', {
                rel: 'icon',
                href: '/favicon.ico'
            }
        ]
    ],
    theme: 'seeker',
    markdown: {
        lineNumbers: true,
    },
    plugins: [
        '@vuepress/last-updated',
        '@vuepress/back-to-top',
        [
            '@vuepress/google-analytics',
            {
              'ga': 'UA-149929964-1'
            }
        ],
    ],
    themeConfig: {
        lastUpdated: '最近更新',
        logo: '/avator.jpg',
        valine: {
            appId: 'sKM9soQCpuzO6okq1tLeEGkw-gzGzoHsz',
            appKey: 'OwzXQE46LrJ2bKOujheDxVjJ',
        },
        footer: {
            slogan: 'poetry',
            copyright: 'Made by ckangwen',
        },
        nav: [
            {
                text: '归档',
                link: '/archive/'
            },
            {
                text: '分类',
                link: '/categories/'
            },
            {
                text: '关于',
                link: '/about/'
            },
        ],
        sidebar: "auto",
    },
    configureWebpack() {
        return {
            resolve: {
                alias: {
                    '@public': path.join(__dirname, './public')
                }
            }
        }
    }
}