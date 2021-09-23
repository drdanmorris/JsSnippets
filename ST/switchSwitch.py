import sublime
import sublime_plugin
import random
import re

class Case:
    def __init__(self, line):
        print(re.match('^\s+', line))
        gutter = re.match('^\s+', line)
        self.gutter = ''
        if gutter: self.gutter = gutter[0]
        self.c = re.search('case "([^"]+)"', line)[1]
        self.r = re.search('return "([^"]+)"', line)[1]

    def getLiteralFrom(self, s):
        s = re.sub('^[^"]+', '', s)
        s = re.sub('[^"]+$', '', s)
        return s


class SwitchswitchCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        selection = self.view.sel()
        for region in selection:
            region_text = self.view.substr(region)
            lines = region_text.split('\n')
            cases = self.process_cases(lines)
            revcases = self.reverse_cases(cases)
            self.view.replace(edit, region, revcases)

    def process_cases(self, lines):
        cases = []
        for line in lines:
            if len(line.strip()) > 10:
                cases.append(Case(line))
        return cases

    def reverse_cases(self, cases):
        rCases = []
        for case in cases:
            rCases.append(f'{case.gutter}case "{case.r}": return "{case.c}";')
        return '\n'.join(rCases)
