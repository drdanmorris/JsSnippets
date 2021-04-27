import sublime
import sublime_plugin
import re
class SassdefinitionCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        selection = self.view.sel()
        for region in selection:
            region_text = self.view.substr(region)
            self.process_text(region_text)
    def process_text(self, text):
        linepattern = re.compile(r'[.\w\s,]+\{')
        classpattern = re.compile(r'\.(\w+)')
        defs = []
        names = []
        for (linematch) in re.findall(linepattern, text):
            for (name) in re.findall(classpattern, linematch):
                if name not in names:
                    defs.append('export const ' + name + ': string;')
                    names.append(name)
        defs.sort()
        exports = "\n//This file was generated by SassDefinition:\n" + "\n".join(defs)
        #print(exports);
        fn = self.view.file_name()
        f = open(fn + '.d.ts', 'w')
        f.write(exports + "\n")
        return
