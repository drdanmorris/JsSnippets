const fs = require("fs")
const path = require("path")

var name = process.argv[2] || "NewEntity"
var cssName = name[0].toLowerCase() + name.substr(1)
var snakeName = cssName.replace(/([A-Z])/g, "-$1").toLowerCase()
var dir = path.join(process.cwd(), snakeName)
var pluralName = name + 's'


function createEntityFolder() {
  if (fs.existsSync(dir)) {
    fs.rmdirSync(dir, { recursive: true });
  }
  fs.mkdirSync(dir)
}

function createEntity() {
  const ts = `import { ${name}Dto } from '.'

export class ${name} {
  constructor(private dto: ${name}Dto) {}
  getType() {
    return '${name}'
  }
  // get name() {
  //   return this.dto.name
  // }
}
  `
  if (fs.existsSync(dir)){
    fs.writeFileSync(path.join(dir, `${snakeName}.ts`), ts)
  }
}

function createEntities() {
  const ts = `import { ${name}, ${name}Dto } from '.'

export class ${pluralName} {
  private __${cssName}s: ${name}[] = []

  constructor(dtos: ${name}Dto[]) {
    this.__${cssName}s = dtos.map((dto) => (new ${name}(dto)))
  }

  get payees() {
    return this.__${cssName}s
  }
}

  `
  if (fs.existsSync(dir)){
    fs.writeFileSync(path.join(dir, `${snakeName}s.ts`), ts)
  }
}

function createDto() {
  const ts = `export interface ${name}Dto {
  //
}
  `
  if (fs.existsSync(dir)){
    fs.writeFileSync(path.join(dir, `${snakeName}-dto.ts`), ts)
  }
}

function createIndex() {
  const ts = `export * from './${snakeName}-dto'
  export * from './${snakeName}'
  `
  if (fs.existsSync(dir)){
    fs.writeFileSync(path.join(dir, `index.ts`), ts)
  }
}

createEntityFolder()
createEntity()
createDto()
createIndex()

