# -*- coding: utf-8 -*-

import json
import urllib


BUILD_URL = ('https://fuel-jenkins.mirantis.com/job/'
            'nailgun_performance_tests/lastBuild/api/json')

CSV_URL = ('https://fuel-jenkins.mirantis.com/job/nailgun_performance_tests'
           '/lastSuccessfulBuild/artifact/nailgun'
           '/nailgun_perf_test_report.csv')

CSV_TARGET_PATH = '/usr/share/nginx/html/test_report.csv'


try:
    with open('build_number') as bn_file:
        previous_build_number = int(bn_file.read())
except IOError:
    previous_build_number = 0

current_build_number = json.loads(urllib.urlopen(BUILD_URL).read())['number']

if current_build_number > previous_build_number:
    urllib.urlretrieve(CSV_URL, CSV_TARGET_PATH)
    with open('build_number', 'w') as bn_file:
        bn_file.write(current_build_number)
