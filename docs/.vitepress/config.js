import { defineConfig } from 'vitepress'

const customElements = [
    'font',
    'center'
]
export default defineConfig({
    // Head及SEO设置
    head: [
        [
            "meta",
            {
                name: "viewport",
                content: "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no",
            },
        ],
        ["meta", { name: "keywords", content: "Wayne Xia的Blog" }],
        ["link", { rel: "icon", href: "./public/favicon.ico" }],
    ],

    // 浏览器默认标签栏文本：左侧
    title: 'Wayne Xia\'s Blog',
    // 浏览器默认标签栏文本：右侧
    titleTemplate: 'Wayne Xia',

    // 全局配置
    themeConfig: {
        // 顶部导航栏设置：左侧
        logo: '/avatar.png',
        siteTitle: 'Wayne Xia',

        // 顶部导航栏设置：右侧
        nav: [
            {
                text: '前端',
                items: [
                    // 单一菜单
                    // {text: 'JavaScript', link: '/01FE/JavaScript', activeMatch: '/01FE/'},
                    // {text: 'Engineering', link: '/01FE/Engineering', activeMatch: '/01FE/'},

                    // 下拉菜单
                    {
                        // text: 'JavaScript',
                        items: [
                            { text: 'JavaScript', link: '/01FE/JavaScript' },
                            { text: 'TypeScript', link: '/01FE/TypeScript' },
                            { text: '工程化', link: '/01FE/Engineering' },
                            { text: 'PM2工具', link: '/01FE/pm2/index' },
                        ]
                    },
                    {
                        // text: 'H && C',
                        items: [
                            { text: 'Html', link: '/01FE/HTML' },
                            { text: 'CSS', link: '/01FE/CSS' }
                        ]
                    }
                ]
            },
            {
                text: '后端',
                items: [
                    {
                        // text: '语言',
                        items: [
                            { text: 'NodeJS', link: '/02BE/NodeJS' },
                            { text: 'Go', link: '/02BE/Golang' },
                            { text: 'Rust', link: '/02BE/Rust' }
                        ]
                    },
                    {
                        // text: '数据库',
                        items: [
                            { text: 'MongoDB', link: '/02BE/MongoDB' },
                            { text: 'MySQL', link: '/02BE/MySQL' }
                        ]
                    }
                ]
            },
            {
                text: '服务器',
                items: [
                    {
                        // text: '服务器',
                        items: [
                            { text: 'Linux', link: '/03Server/Linux' },
                            { text: 'Shell', link: '/03Server/Shell' },
                        ]
                    },
                    {
                        // text: '架构',
                        items: [
                            { text: 'Docker', link: '/03Server/Docker' },
                            { text: 'GitLab', link: '/03Server/GitLab.md' },
                            { text: 'CI & CD', link: '/03Server/CICD' },
                            { text: '架构', link: '/03Server/Architecture.md' },
                        ]
                    },
                ]
            },
            {
                text: '基础技能',
                items: [
                    {
                        // text: '基础技能',
                        items: [
                            // { text: '计算机组成原理', link: '/05Skill/PrinciplesOfComputerComposition.md' },
                            { text: '数据结构与算法', link: '/05Skill/DataStructuresAndAlgorithms.md' },
                            { text: '设计模式', link: '/05Skill/DesignPatterns.md' },
                        ]
                    },
                    {
                        // text: '工具',
                        items: [
                            { text: 'Git', link: '/05Skill/Git.md' },
                            { text: 'IT工具', link: '/05Skill/Network.md' },
                            // { text: '自有库', link: '/05Skill/PrivateLib.md' },
                            // { text: '思维导图', link: '/05Skill/MindMap.md' },
                        ]
                    },


                ]
            },
            {
                text: '面试',
                items: [
                    // { text: '职业规划', link: '/06Interview/CareerPlanning.md' },
                    { text: '前端面试题', link: '/06Interview/FEQuestions.md' },
                    { text: '后端面试题', link: '/06Interview/BEQuestions.md' },
                    { text: 'Leetcode', link: '/06Interview/Leetcode.md' },
                    // { text: '管理', link: '/06Interview/Management.md' },
                ]
            },
            {
                text: '游戏开发',
                items: [
                    { text: '游戏开发', link: '/07Game/GameDevelopment.md' },
                    { text: '人工智能', link: '/07Game/ArtificialIntelligence.md' },
                    { text: '三维开发', link: '/07Game/ThreeDimensions.md' },
                ]
            },

            { text: 'Github', link: 'https://github.com/orgs/algorithm003/dashboard' },
            { text: 'Gitee', link: 'https://gitee.com/wushuang5112/dashboard/projects' },
        ],

        // 社交账号
        // socialLinks: [
        // { icon: 'github', link: 'https://github.com/orgs/algorithm003/dashboard' },
        // ],

        // 侧边栏配置
        sidebar: {
            '/01FE/': [
                {
                    text: 'JavaScript',
                    collapsible: true,
                    items: [
                        { text: 'JavaScript', link: '/01FE/JavaScript', activeMatch: '/01FE/' },
                        { text: 'TypeScript', link: '/01FE/TypeScript' },
                        { text: '工程化', link: '/01FE/Engineering' },
                        { 
                            text: 'PM2工具',
                            collapsible: true,
                            collapsed: false,
                            items: [
                                { text: 'pm2 基础', link: '/01FE/pm2/index' },
                                { text: 'pm2 管理状态', link: '/01FE/pm2/restart_strategies' },
                            ]
                        },
                    ]
                },
                {
                    text: 'H && C',
                    collapsible: true,
                    items: [
                        { text: 'HTML', link: '/01FE/HTML' },
                        { text: 'CSS', link: '/01FE/CSS' },
                    ]
                }
            ],
            '/02BE/': [
                {
                    text: '语言',
                    items: [
                        { text: 'NodeJS', link: '/02BE/NodeJS' },
                        { text: 'Go', link: '/02BE/Golang' },
                        { text: 'Rust', link: '/02BE/Rust' }
                    ]
                },
                {
                    text: '数据库',
                    items: [
                        { text: 'MongoDB', link: '/02BE/MongoDB' },
                        { text: 'MySQL', link: '/02BE/MySQL' }
                    ]
                }
            ],
            '/03Server/': [
                {
                    text: '服务器',
                    items: [
                        { text: 'Linux', link: '/03Server/Linux' },
                        { text: 'Shell', link: '/03Server/Shell' },
                    ]
                },
                {
                    text: '架构',
                    items: [
                        { text: 'Docker', link: '/03Server/Docker' },
                        { text: 'GitLab', link: '/03Server/GitLab.md' },
                        { text: 'CI & CD', link: '/03Server/CICD' },
                        { text: '架构', link: '/03Server/Architecture.md' },
                    ]
                },
            ],
            '/05Skill/': [
                {
                    // text: '基础技能',
                    items: [
                        // { text: '计算机组成原理', link: '/05Skill/PrinciplesOfComputerComposition.md' },
                        { text: '数据结构与算法', link: '/05Skill/DataStructuresAndAlgorithms.md' },
                        { text: '设计模式', link: '/05Skill/DesignPatterns.md' },
                    ]
                },
                {
                    // text: '工具',
                    items: [
                        { text: 'Git', link: '/05Skill/Git.md' },
                        { text: 'IT工具', link: '/05Skill/Network.md' },
                        // { text: '自有库', link: '/05Skill/PrivateLib.md' },
                        // { text: '思维导图', link: '/05Skill/MindMap.md' },
                    ]
                }
            ],
            '/06Interview/': [
                {
                    text: '面经',
                    items: [
                        // { text: '职业规划', link: '/06Interview/CareerPlanning.md' },
                        { text: '前端面试题', link: '/06Interview/FEQuestions.md' },
                        { text: '后端面试题', link: '/06Interview/BEQuestions.md' },
                        { text: 'Leetcode', link: '/06Interview/Leetcode.md' },
                        // { text: '管理', link: '/06Interview/Management.md' },
                    ]
                }
            ],
            '/07Game/': [
                {
                    // text: '游戏开发',
                    items: [
                        { text: '游戏开发', link: '/07Game/GameDevelopment.md' },
                        { text: '人工智能', link: '/07Game/ArtificialIntelligence.md' },
                        { text: '三维开发', link: '/07Game/ThreeDimensions.md' },
                    ]
                }
            ],
        },
        // 页脚
        footer: {
            message: 'Released under the MIT License.',
            copyright: '<a href="https://beian.miit.gov.cn/">Copyright ©2019-present 粤ICP备18124974号</a>'
        }
    },

    vue: {
        template: {
            compilerOptions: {
                isCustomElement: (tag) => customElements.includes(tag)
            }
        }
    }
})