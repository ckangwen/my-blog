const path = require('path')

module.exports = {
    title: 'CKW',
    description: '你要保守你的心胜过保守一切，因为一生的果效是由心发出的',
    theme: 'seeker',
    markdown: {
        lineNumbers: true,
    },
    plugins: [
        '@vuepress/last-updated',
        [
            '@vuepress/google-analytics',
            {
              'ga': 'UA-149929964-1'
            }
        ]
    ],
    themeConfig: {
        lastUpdated: '最近更新',
        logo: '/avator.jpg',
        valine: {
            appId: 'zpYH60z3swFivRMCzdH85xHw-gzGzoHsz',
            appKey: 'eB05xKa2vXzULbAkaqR2W1EK',
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