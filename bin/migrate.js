import * as Models from '../models';

async function main() {
    const models = [
        Models.Users,
        Models.Restaurant,
        Models.Table,
        Models.Categories,
        Models.Menus,
    ];
    for (const i in models) {
        console.log('--->', i);
        await models[i].sync({alter: true});
    }
    process.exit();
}

main();
