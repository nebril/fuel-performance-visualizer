# -*- coding: utf-8 -*-

import urllib
import subprocess
import workerpool

class ProcessArtifactJob(workerpool.Job):
    def __init__(self, url, directory, filename):
        self.url = url
        self.dir = directory
        self.filename = filename
    def run(self):
        urllib.urlretrieve(self.url, self.dir + self.filename)
        subprocess.call(["tar", "-zxvf", self.dir + self.filename, '-C',
                         self.dir])
