import os
import shutil


base_dir = 'listeningTest'
if os.path.exists(base_dir):
    shutil.rmtree(base_dir)

# Move tornado server files
server_dir = os.path.join(base_dir, 'server')
shutil.copytree("listening-test-server/handlers", server_dir + "/handlers")
shutil.copytree("listening-test-server/tools", server_dir + "/tools")
shutil.copyfile("listening-test-server/server.py", server_dir + "/server.py")
shutil.copyfile("listening-test-server/mongodbconnection.py", server_dir + "/mongodbconnection.py")
shutil.copyfile("listening-test-server/url.py", server_dir + "/url.py")

# Move react files
html_dir = os.path.join(base_dir, 'html')
shutil.copytree("listening-test-react/build", html_dir)

# Move configuration files
shutil.copyfile("tornado.ini", os.path.join(base_dir, "tornado.ini"))

