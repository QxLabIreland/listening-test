import os
import shutil
import tarfile


# Folder
base_dir = 'listeningTest'
if os.path.exists(base_dir):
    shutil.rmtree(base_dir)
# Archive file
base_dir_tgz = base_dir + '.tgz'
if os.path.exists(base_dir_tgz):
    os.remove(base_dir_tgz)

# Move tornado server files
server_dir = os.path.join(base_dir, 'server')
for v in ['/handlers', '/tools', '/server.py', '/mongodbconnection.py', '/url.py']:
    source = 'listening-test-server' + v
    if os.path.isfile(source):
        shutil.copyfile(source, server_dir + v)
    else:
        shutil.copytree(source, server_dir + v)

# Move react files
html_dir = os.path.join(base_dir, 'html')
shutil.copytree("listening-test-react/build", html_dir)

# Move configuration files
shutil.copyfile("tornado.ini", os.path.join(base_dir, "tornado.ini"))

# Create tar file
with tarfile.open(base_dir_tgz, "w:gz") as tar:
        tar.add(base_dir, arcname=os.path.basename(base_dir))
