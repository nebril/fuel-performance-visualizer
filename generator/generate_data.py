# -*- coding: utf-8 -*-

import itertools
import json
import multiprocessing
import os
import re
import shutil
import urllib
import workerpool

import jobs

LAST_BUILD_URL_BASE = ('https://fuel-jenkins.mirantis.com/job/'
             'nailgun_performance_tests/lastCompletedBuild/')

LAST_BUILD_INFO = LAST_BUILD_URL_BASE + 'api/json'

LAST_BUILD_TAR_BASE = LAST_BUILD_URL_BASE + 'artifact/results/results/'

CSV_URL = LAST_BUILD_URL_BASE + 'artifact/nailgun/nailgun_perf_test_report.csv'

CSV_TARGET_PATH = '/usr/share/nginx/html/test_report.csv'

DOT_TARGET_DIR = 'dot/'

DOT_INDEX_PATH = 'graphs.json'


try:
    with open('build_number', 'r') as bn_file:
        previous_build_number = int(bn_file.read())
except (IOError, ValueError):
    previous_build_number = 0

current_build_info = json.loads(urllib.urlopen(LAST_BUILD_INFO).read())

current_build_number = current_build_info['number']

if current_build_number > previous_build_number:
    with open('build_number', 'w') as bn_file:
        bn_file.write(str(current_build_number))

    urllib.urlretrieve(CSV_URL, CSV_TARGET_PATH)

    shutil.rmtree(DOT_TARGET_DIR)
    os.mkdir(DOT_TARGET_DIR)

    arts = [x['fileName'] for x in current_build_info['artifacts'] if 'tar.gz' in x['fileName']]

    pool = workerpool.WorkerPool(size=2)

    for filename in arts:
        job = jobs.DownloadArtifactJob(
            LAST_BUILD_TAR_BASE + filename,
            DOT_TARGET_DIR,
            filename
        )

        pool.put(job)

    pool.shutdown()
    pool.wait()

    tests = [x for x in os.listdir(DOT_TARGET_DIR) if 'tar.gz' not in x and
             'txt' not in x]


    processing_jobs = []
    for test in tests:
        name = re.search(r'[^0-9._].*', test).group(0)

        extractor = jobs.GraphExtractor(DOT_TARGET_DIR + test, name)
        for graph in extractor.get_files():
            job = jobs.ProcessGraphJob(graph, name)
            processing_jobs.append(job)


    def run_job(job):
        job.run()
        return {'test_name': job.test_name, 'graph': job.graph}

    process_pool = multiprocessing.Pool(2)

    processed_data_index = process_pool.map(run_job, processing_jobs)

    process_pool.close()

    graphs_index = {k: list(v) for k,v in itertools.groupby(processed_data_index, lambda x : x['test_name'])}
    with open(DOT_INDEX_PATH, 'w') as graphs_file:
        graphs_file.write(json.dumps(graphs_index))
