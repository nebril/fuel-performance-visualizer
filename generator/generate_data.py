# -*- coding: utf-8 -*-

import json
import urllib
import subprocess


LAST_BUILD_URL = ('https://fuel-jenkins.mirantis.com/job/'
             'nailgun_performance_tests/lastBuild/api/json')

LAST_BUILD_TAR_BASE = ('https://fuel-jenkins.mirantis.com/job/'
                       'nailgun_performance_tests/lastBuild/artifact/'
                       'results/results/')

CSV_URL = ('https://fuel-jenkins.mirantis.com/job/nailgun_performance_tests'
           '/lastBuild/artifact/nailgun'
           '/nailgun_perf_test_report.csv')

CSV_TARGET_PATH = '/usr/share/nginx/html/test_report.csv'

DOT_TARGET_DIR = 'dot/'


try:
    with open('build_number', 'r') as bn_file:
        previous_build_number = int(bn_file.read())
except (IOError, ValueError):
    previous_build_number = 0

current_build_info = json.loads(urllib.urlopen(LAST_BUILD_URL).read())

current_build_number = current_build_info['number']

if current_build_number >= previous_build_number:
    with open('build_number', 'w') as bn_file:
        bn_file.write(str(current_build_number))

    #urllib.urlretrieve(CSV_URL, CSV_TARGET_PATH)

    arts = [x for x in current_build_info['artifacts'] if 'tar.gz' in x['fileName']]

    for artifact in arts:
        filename = artifact['fileName']
        print filename
        urllib.urlretrieve(
            LAST_BUILD_TAR_BASE + filename,
            DOT_TARGET_DIR + filename 
        )

        subprocess.call(["tar", "-zxvf", DOT_TARGET_DIR + filename, '-C', DOT_TARGET_DIR])
