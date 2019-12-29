import json
import os.path
# from tornado import gen, web

from ...base.handlers import APIHandler


class RecentList(APIHandler):

    def get(self):
        dire = ".recentList.json"
        # Return a list of running sessions
        try:
            recentlist = json.loads(open(dire, 'r').read()) 
        except:
            rl = '{"Error":"Please Use Jupyter Notebook To Use This Feature!"}'
            self.finish(rl)
            return
        if len(recentlist)<1:
            rl = '{"Error":"Please Use Jupyter Notebook To Use This Feature!"}'
            self.finish(rl)
            return
        temp = []
        for i in range(len(recentlist)):
            if os.path.isfile(recentlist[i]['Path']):
                temp.append(recentlist[i])
        recentlist = temp
        with open(dire, 'w') as fout:
            json.dump(recentlist, fout)
        self.finish(open(dire,'r').read())

    def delete(self,recentlist_id):
        # Deletes the recent list with given recentlist_id
        dire = ".recentList.json"
        recentlist = json.loads(open(dire, 'r').read())
        temp = []
        for i in range(len(recentlist)):
            if recentlist[i]['Path']!=recentlist_id:
                temp.append(recentlist[i])
        recentlist = temp

        with open(dire, 'w') as fout:
            json.dump(recentlist, fout)
        self.finish(open(dire,'r').read())

_recentlist_id_regex = r"(?P<recentlist_id>.*)"

default_handlers = [
    (r"/api/recentlist/%s" % _recentlist_id_regex, RecentList),
    (r"/api/recentlist", RecentList),

]
