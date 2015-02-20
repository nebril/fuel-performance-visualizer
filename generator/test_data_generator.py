# -*- coding: utf-8 -*-

import itertools
import json
import multiprocessing
import os
import re
import shutil
import subprocess
import urllib
import workerpool

import jobs


def run_job(job):
    job.run()
    return {'test_name': job.test_name, 'graph': job.graph}


class TestDataGenerator(object):
    LAST_BUILD_URL_BASE = ('https://fuel-jenkins.mirantis.com/job/'
                 'nailgun_performance_tests/lastCompletedBuild/')
    LAST_BUILD_INFO = LAST_BUILD_URL_BASE + 'api/json'
    LAST_BUILD_TAR_BASE = LAST_BUILD_URL_BASE + 'artifact/results/results/'
    CSV_URL = LAST_BUILD_URL_BASE + ('artifact/nailgun/'
                                     'nailgun_perf_test_report.csv')
    CSV_TARGET_PATH = '/usr/share/nginx/html/test_report.csv'
    FAILED_TESTS_URL = LAST_BUILD_URL_BASE + ('artifact/nailgun/'
                                              'failed_tests.txt')
    DOT_TARGET_DIR = 'dot/'
    DOT_COPY_DIR = '/usr/share/nginx/html/dot'
    DOT_INDEX_PATH = 'dot/graphs.json'

    def __init__(self):
        try:
            with open('build_number', 'r') as bn_file:
                self.previous_build_number = int(bn_file.read())
        except (IOError, ValueError):
            self.previous_build_number = 0

        self.current_build_info = json.loads(
            urllib.urlopen(self.LAST_BUILD_INFO).read())

        self.current_build_number = self.current_build_info['number']

    def generate(self):
        if self.current_build_number > self.previous_build_number:
            with open('build_number', 'w') as bn_file:
                bn_file.write(str(self.current_build_number))

            self._get_csv()

            self._get_fresh_dots()
            self._process_dots(self._get_priority_tests())
            self._process_dots()
            self._move_dot_results()

    def _get_csv(self):
        urllib.urlretrieve(self.CSV_URL, self.CSV_TARGET_PATH)

    def _get_fresh_dots(self):
        try:
            shutil.rmtree(self.DOT_TARGET_DIR)
        except OSError:
            pass

        os.mkdir(self.DOT_TARGET_DIR)

        arts = [
            x['fileName'] 
            for x 
            in self.current_build_info['artifacts'] 
            if 'tar.gz' in x['fileName']
        ]

        pool = workerpool.WorkerPool(size=5)

        for filename in arts:
            job = jobs.DownloadArtifactJob(
                self.LAST_BUILD_TAR_BASE + filename,
                self.DOT_TARGET_DIR,
                filename
            )

            pool.put(job)

        pool.shutdown()
        pool.wait()

    def _process_dots(self, names=None):
        tests = [
            x
            for x
            in os.listdir(self.DOT_TARGET_DIR) 
            if 'tar.gz' not in x and 'txt' not in x and 'json' not in x
        ]

        if names:
            tests = filter(lambda x: any(p in x for p in names), tests)

        processing_jobs = []
        for test in tests:
            name = re.search(r'[^0-9._].*', test).group(0)

            extractor = jobs.GraphExtractor(self.DOT_TARGET_DIR + test, name)
            for graph in extractor.get_files():
                job = jobs.ProcessGraphJob(graph, name)
                processing_jobs.append(job)

        process_pool = multiprocessing.Pool(1)

        processed_data_index = process_pool.map(run_job, processing_jobs)

        process_pool.close()

        graphs_index = {
            k: list(v) 
            for k,v 
            in itertools.groupby(
                processed_data_index,
                lambda x : x['test_name']
            )
        }
        with open(self.DOT_INDEX_PATH, 'w') as graphs_file:
            graphs_file.write(json.dumps(graphs_index))

    def _get_priority_tests(self):
        # todo(mkwiek): uncomment this when the artifact is available
        #names = urllib.urlopen(self.FAILED_TESTS_URL).read(30000).split("\n")
        names = [
            'nailgun/test/performance/unit/test_notification_operations.py::NotificationOperationsLoadTest::test_notifications_creation',
            'nailgun/test/performance/unit/test_notification_operations.py::NotificationOperationsLoadTest::test_notifications_retrieval'
        ]

        return ['::'.join(reversed(name.split('::')[-2:])) for name in names]

    def _move_dot_results(self):
        subprocess.call(['mv', self.DOT_TARGET_DIR,  self.DOT_COPY_DIR])
