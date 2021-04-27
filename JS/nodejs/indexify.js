const fs = require('fs')
const path = require('path')

const search = (dirPath) => {
    const listing = [];
    var alreadyHasIndex = false;

    fs.readdirSync(dirPath).forEach(file => {

        if(file.indexOf('_') === 0) return
        if(file.indexOf('.spec.ts') > 0) return

        if(/^index\.ts$/.test(file) === true) {
            alreadyHasIndex = true;
            var contents = fs.readFileSync(path.join(dirPath, 'index.ts'), {encoding: 'utf8'})
            if(contents === '' || contents.indexOf('export * from') === 0) {
                alreadyHasIndex = false;
            }
        }
        else if(/^index\.tsx/.test(file) === true) {
            alreadyHasIndex = true;
        } else if(/\.ts/.test(file) === true && /^index\.ts/.test(file) === false && /\.d\.ts/.test(file) === false) {
            listing.push("export * from './" + file.replace(/\.tsx?/, '') + "'");
        }

        const dirFile = path.join(dirPath, file);
        if (fs.lstatSync(dirFile).isDirectory()) {
            if(file !== 'node_modules') {
                listing.push("export * from './" + file.replace(/\.tsx?/, '') + "'");
                search(dirFile);
            }
        }

    });

    if(alreadyHasIndex === false && listing.length > 0) {
        listing.push("");
        fs.writeFileSync(path.join(dirPath, 'index.ts'), listing.join('\n'));
    }

}

search(process.cwd());

