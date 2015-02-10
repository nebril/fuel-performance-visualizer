# -*- coding: utf-8 -*-

import json
import os
import shutil
import urllib
import workerpool

import jobs

LAST_BUILD_URL_BASE = ('https://fuel-jenkins.mirantis.com/job/'
             'nailgun_performance_tests/126/')

LAST_BUILD_INFO = LAST_BUILD_URL_BASE + 'api/json'

LAST_BUILD_TAR_BASE = LAST_BUILD_URL_BASE + 'artifact/results/results/'

CSV_URL = LAST_BUILD_URL_BASE + 'artifact/nailgun/nailgun_perf_test_report.csv'

CSV_TARGET_PATH = '/usr/share/nginx/html/test_report.csv'

DOT_TARGET_DIR = 'dot/'


try:
    with open('build_number', 'r') as bn_file:
        previous_build_number = int(bn_file.read())
except (IOError, ValueError):
    previous_build_number = 0

current_build_info = json.loads(urllib.urlopen(LAST_BUILD_INFO).read())

current_build_number = current_build_info['number']

if current_build_number >= previous_build_number:
    with open('build_number', 'w') as bn_file:
        bn_file.write(str(current_build_number))

    #urllib.urlretrieve(CSV_URL, CSV_TARGET_PATH)

    shutil.rmtree(DOT_TARGET_DIR)
    os.mkdir(DOT_TARGET_DIR)

    arts = [x['fileName'] for x in current_build_info['artifacts'] if 'tar.gz' in x['fileName']]

    pool = workerpool.WorkerPool(size=5)

    for filename in arts:
        print filename
        job = jobs.ProcessArtifactJob(
            LAST_BUILD_TAR_BASE + filename,
            DOT_TARGET_DIR,
            filename
        )

        pool.put(job)

    pool.shutdown()
    pool.wait()
