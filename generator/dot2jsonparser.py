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

import json
import sys

import pydot


class Dot2JSONParser(object):
    def __init__(self, sourcefile):
        self.source = sourcefile

    def parse(self):
        self.graph = pydot.graph_from_dot_file(self.source)

        nodes = self._get_nodes()
        edges = self._get_edges()

        return json.dumps({
            "nodes": nodes,
            "edges": edges,
        })

    def _get_nodes(self):
        nodes = []
        for node in self.graph.get_node_list():
            try:
                function, percentage, percentage2, times = tuple(
                    node.get_label().split('\\n'))
                nodes.append({
                    "data": {
                        "id": str(int(node.get_name())),
                        "funcName": function,
                        "percentage": float(percentage.strip('()%')),
                        "percentage2": float(percentage2.strip('()%')),
                        "callCount": times,
                        "label": "{0}, {1}, {2}".format(
                            function, percentage, times),
                    },
                    "position": {
                        "x": 0,
                        "y": 0,
                    },
                })

            except (ValueError, AttributeError):
                sys.stderr.write("Skipped {0}\n".format(node.get_name()))
                pass
        return nodes

    def _get_edges(self):
        edges = []

        for edge in self.graph.get_edge_list():
            percentage, times = tuple(
                edge.get_label().strip('"').split('\xc3')[0].split('\\n')
            )
            edges.append({
                "data": {
                    "id": 'e' + (str(int(edge.get_source()))
                                 + '_'
                                 + str(int(edge.get_destination()))),
                    "source": edge.get_source(),
                    "target": edge.get_destination(),
                    "percentage": float(percentage.strip('()%')),
                    "callCount": int(times),
                    "label": "{0}, {1}x".format(percentage, times),
                }
            })

        return edges
