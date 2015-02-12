# -*- coding: utf-8 -*-

import os
import urllib
import re
import subprocess
import workerpool

import dot2jsonparser


class DownloadArtifactJob(workerpool.Job):
    def __init__(self, url, directory, filename):
        self.url = url
        self.dir = directory
        self.filename = filename

    def run(self):
        urllib.urlretrieve(self.url, self.dir + self.filename)
        subprocess.call(["tar", "-zxvf", self.dir + self.filename,
                         '--strip-components', '6', '-C',
                         self.dir])


class GraphExtractor():
    def __init__(self, directory, test_name):
        self.dir = directory
        self.test_name = test_name
        self.graphs = []

    def _get_average_run(self):
        runs = [x for x in os.listdir(self.dir) if re.search(r'^run', x)]
        
        #todo: add logic to this
        if len(runs) == 1:
            return runs[0]
        else:
            return runs[0]

    def get_files(self):
        run = self._get_average_run()
        return [os.path.join(self.dir, run, x) for x in 
                os.listdir(os.path.join(self.dir, run)) if
                re.search(r'\.dot$', x)]


class ProcessGraphJob(workerpool.Job):
    def __init__(self, filename, test_name):
        self.filename = filename
        self.test_name = test_name

    def run(self):
        json_filename = self.filename + '.json'
        parser = dot2jsonparser.Dot2JSONParser(self.filename)

        with open(json_filename, 'w') as json_file:
            print "parsing " + self.filename
            json_file.write(parser.parse())
            print "saved " + json_filename
            self.graph = dict(
                name=self.test_name,
                path=json_filename,
                originalFile="original"
            )
