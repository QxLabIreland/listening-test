import os
import shutil
import tarfile
import subprocess


print('Start cleaning build folder and archive file...')
base_dir = 'listeningTest'
if os.path.exists(base_dir):
    shutil.rmtree(base_dir)
# Archive file
base_dir_tgz = base_dir + '.tgz'
if os.path.exists(base_dir_tgz):
    os.remove(base_dir_tgz)

# # Move tornado server files
# server_dir = os.path.join(base_dir, 'server')
# for v in ['/handlers', '/tools', '/server.py', '/mongodbconnection.py', '/url.py']:
#     source = 'listening-test-server' + v
#     if os.path.isfile(source):
#         shutil.copyfile(source, server_dir + v)
#     else:
#         shutil.copytree(source, server_dir + v, ignore=shutil.ignore_patterns('*.pyc', '__pycache__'))

print('Move server files...')
server_dir = os.path.join(base_dir, 'server')
shutil.copytree('listening-test-server', server_dir, ignore=shutil.ignore_patterns('*.pyc', '__pycache__', '.idea', 'static2', 'venv', '.gitignore'))

print('Move react files...')
html_dir = os.path.join(base_dir, 'html')
shutil.copytree("listening-test-react/build", html_dir)

print('Move configuration files...')
shutil.copyfile("tornado.ini", os.path.join(base_dir, "tornado.ini"))

print('Create tar file...')
with tarfile.open(base_dir_tgz, "w:gz") as tar:
        tar.add(base_dir, arcname=os.path.basename(base_dir))

print('Transfer the files to server...')
subprocess.run(f'scp -i ForStudy.pem -r {base_dir} ubuntu@63.34.10.16:/home/ubuntu/listeningTest')

print('Start ssh...')
# subprocess.run('ssh -i ForStudy.pem ubuntu@63.34.10.16 "sudo supervisorctl reload"')
subprocess.run('ssh -i ForStudy.pem ubuntu@63.34.10.16 "sudo supervisorctl restart golisten"')
