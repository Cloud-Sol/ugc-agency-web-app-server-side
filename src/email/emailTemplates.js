const fs = require('fs-extra');
const handlebars = require('handlebars');

const compileTemplate = async (templateName, data) => {
    const filePath = `./src/email/templates/${templateName}.html`;
    const source = await fs.readFile(filePath, 'utf-8');
    const template = handlebars.compile(source);
    return template(data);
};

module.exports = { compileTemplate };
