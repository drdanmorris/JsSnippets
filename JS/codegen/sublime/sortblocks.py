import sublime
import sublime_plugin
import random
import re
class Block:
    def __init__(self, name, line):
        self.name = name
        self.lines = []
        self.append(line)
    def append(self, line):
        self.lines.append(line)
class SortblocksCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        selection = self.view.sel()
        count = 1
        for region in selection:
            region_text = self.view.substr(region)
            lines = region_text.split('\n')
            blocks = self.process_lines(lines)
            sortedBlocks = self.sort_blocks(blocks)
            blockLines = self.blocks_to_string(sortedBlocks)
            self.view.replace(edit, region, blockLines)
            # self.view.insert(edit, region.end(), self.block_names(sortedBlocks))
    def process_lines(self, lines):
        inBlock = False
        curlyDepth = 0
        blocks = []
        for line in lines:
            openCurlyLineCount = 0
            closeCurlyLineCount = 0
            hasOpenBracket = False
            hasCloseBracket = False
            name = ''
            if inBlock:
                currentBlock.append(line)
            for letter in line:
                if letter == '{':
                    curlyDepth += 1
                    openCurlyLineCount += 1
                elif letter == '}':
                    curlyDepth -= 1
                    closeCurlyLineCount += 1
                elif letter == ')':
                    hasOpenBracket = True
                elif letter == '(':
                    hasCloseBracket = True
            if inBlock and curlyDepth == 0:
                blocks.append(currentBlock)
                inBlock = False
            elif inBlock == False and hasOpenBracket and hasCloseBracket:
                inBlock = True
                name = re.sub(r'[\{\}\(\)]', '', line)
                name = name.replace('get ', '').strip()
                currentBlock = Block(name, line)
        return blocks
    def sort_blocks(self, blocks):
        return sorted(blocks, key=lambda block: block.name)
    def blocks_to_string(self, blocks):
        lines = []
        for block in blocks:
            for line in block.lines:
                lines.append(line)
        return '\n'.join(lines)
    def block_names(self, blocks):
        names = []
        for block in blocks:
            names.append(block.name)
        return '\n\n// ' + ','.join(names)
