import sublime
import sublime_plugin
import random
import re
class Block:
    def __init__(self, name, line):
        self.name = name
        self.lines = []
        self.line = ''
        self.append(line)
    def append(self, line):
        self.lines.append(line)
        self.line = line
class MirrorequalsCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        selection = self.view.sel()
        for region in selection:
            region_text = self.view.substr(region)
            lines = region_text.split('\n')
            lines = self.process_lines(lines)
            region_updated = self.lines_to_string(lines)
            #print(region_updated)
            self.view.replace(edit, region, region_updated)

    def process_lines(self, lines):
        outLines = []
        for line in lines:
            #print(line)
            trimmed = line.strip()
            nameMatch = re.match('([\w\d]+)\s?=\s?""', trimmed)
            #print(nameMatch)
            if nameMatch and len(nameMatch.groups()) == 1: 
                #print(nameMatch[1])
                name = nameMatch[1]
                outLines.append(line.replace('""', f'"{name}"'))
            else: outLines.append(line)
        return outLines

    def lines_to_string(self, lines):
        return '\n'.join(lines)
