dojo.provide('app.greeting');

app.greeting.helloInLang = {
    en: 'Hello world!',
    zh: '你好，世界'
};

app.greeting.sayHello = function (lang) {
    return app.greeting.helloInLang[lang];
};
