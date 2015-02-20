# -*- coding: utf-8 -*-
#    Copyright 2015 Mirantis, Inc.
#
#    Licensed under the Apache License, Version 2.0 (the "License"); you may
#    not use this file except in compliance with the License. You may obtain
#    a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
#    License for the specific language governing permissions and limitations
#    under the License.

import os
import re
import subprocess
import urllib
import workerpool

import dot2jsonparser


class DownloadArtifactJob(workerpool.Job):
    def __init__(self, url, directory, filename):
        self.url = url
        self.dir = directory
        self.filename = filename

    def run(self):
        urllib.urlretrieve(self.url, self.dir + self.filename)
        p = subprocess.Popen(["tar", "-zxvf", self.dir + self.filename,
                              '--strip-components', '6', '-C', self.dir,
                              '--show-transformed-names'],
                             stdin=subprocess.PIPE,
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        output, err = p.communicate()

        for name in [
                n for n
                in output.split('\n') if n.find('run') == -1 and len(n) > 0
        ]:
            subprocess.call([
                'mv', os.path.join(self.dir, name),
                os.path.join(
                    self.dir,
                    '{0}::{1}'.format(name, self.filename.split('_')[0])
                )
            ])


class GraphExtractor(object):
    def __init__(self, directory, test_name):
        self.dir = directory
        self.test_name = test_name
        self.graphs = []

    def _get_average_run(self):
        dir = self.dir
        runs = [
            x
            for x
            in os.listdir(self.dir)
            if re.search(r'^run', x)
        ]

        def run_to_time(run):
            partials = os.listdir(os.path.join(dir, run))

            return dict(
                name=run,
                time=sum(
                    map(
                        lambda x: int(re.search('([0-9]+)(ms)', x).group(1)),
                        partials
                    )
                ),
            )

        if len(runs) == 1:
            return runs[0]
        else:
            sorted_runs = sorted(
                map(run_to_time, runs), key=lambda x: x['time']
            )
            return sorted_runs[len(sorted_runs) / 2]['name']

    def get_files(self):
        run = self._get_average_run()
        return [os.path.join(self.dir, run, x) for x in
                os.listdir(os.path.join(self.dir, run)) if
                re.search(r'\.dot$', x)]


class ProcessGraphJob(object):
    def __init__(self, filename, test_name):
        self.filename = filename
        self.test_name = test_name

    def run(self):
        json_filename = self.filename + '.json'
        parser = dot2jsonparser.Dot2JSONParser(self.filename)

        with open(json_filename, 'w') as json_file:
            json_file.write(parser.parse())
            self.graph = dict(
                name=self.test_name,
                path=json_filename,
                originalFile="original"
            )
